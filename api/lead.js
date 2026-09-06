// ============================================================
// /api/lead  —  función serverless (Vercel)
//
// Recibe una petición de presupuesto del modal de contacto y hace tres cosas
// independientes, para que el lead nunca se pierda si una falla:
//   1. Añade una fila a tu Google Sheet (registro que controlas tú).
//   2. Te avisa por correo, con el proyecto .zip adjunto si cabe.
//   3. Manda al cliente un "recibido".
//
// Variables de entorno (Vercel → Settings → Environment Variables), ver
// .env.example. Si falta la config de una vía, esa vía se salta sin romper.
// ============================================================

const send = (res, code, body) => res.status(code).json(body)

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' })

  let p
  try {
    p = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
  } catch {
    return send(res, 400, { error: 'bad_json' })
  }

  const {
    name,
    email,
    phone = '',
    note = '',
    brand = '',
    previewLink = '',
    consent,
    configText = '',
    contentText = '',
    zipBase64 = '',
    zipName = 'proyecto.zip',
  } = p

  if (!name || !email || !consent) return send(res, 400, { error: 'missing_fields' })

  const now = new Date()
  const out = { sheet: false, adminMail: false, clientMail: false }

  // --- 1. Google Sheet ---
  if (process.env.LEAD_SHEET_URL) {
    out.sheet = await fetch(process.env.LEAD_SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: process.env.LEAD_SHEET_TOKEN || '',
        fecha: now.toISOString(),
        nombre: name,
        email,
        telefono: phone,
        negocio: brand,
        enlace: previewLink,
        nota: note,
        consentimiento: 'sí',
      }),
    })
      .then((r) => r.ok)
      .catch(() => false)
  }

  // --- 2 y 3. Correos (Resend) ---
  const key = process.env.RESEND_API_KEY
  const from = process.env.LEAD_FROM_EMAIL
  const to = process.env.LEAD_TO_EMAIL
  if (key && from && to) {
    // Resend admite hasta ~40 MB por mensaje; el límite real aquí es el cuerpo
    // de la petición a Vercel, así que el cliente ya recorta si es grande.
    const attachments = zipBase64 ? [{ filename: zipName, content: zipBase64 }] : undefined

    out.adminMail = await sendEmail(key, {
      from,
      to,
      reply_to: email,
      subject: `Petición de presupuesto — ${brand || 'web'} · ${name}`,
      text: adminText({ name, email, phone, note, brand, previewLink, now, hasZip: !!attachments, configText, contentText }),
      attachments,
    })
      .then((r) => r.ok)
      .catch(() => false)

    out.clientMail = await sendEmail(key, {
      from,
      to: email,
      subject: 'Hemos recibido tu petición de presupuesto',
      text: clientText(name),
    })
      .then((r) => r.ok)
      .catch(() => false)
  }

  // Vale con que UNA vía de registro haya funcionado (hoja o correo a ti).
  const ok = out.sheet || out.adminMail
  return send(res, ok ? 200 : 502, { ok, out })
}

function sendEmail(apiKey, body) {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function adminText({ name, email, phone, note, brand, previewLink, now, hasZip, configText, contentText }) {
  return [
    `Solicitud recibida el ${now.toLocaleString('es-ES')}`,
    '',
    `Nombre:   ${name}`,
    `Email:    ${email}`,
    `Teléfono: ${phone || '—'}`,
    `Negocio:  ${brand || '—'}`,
    '',
    `Nota: ${note || '—'}`,
    '',
    `Vista previa del diseño: ${previewLink}`,
    hasZip
      ? 'Proyecto .zip adjunto a este correo.'
      : 'Sin .zip adjunto (imágenes grandes). Abre el enlace y regenera el proyecto desde "Código".',
    '',
    '----- configuración -----',
    configText || '(no incluida)',
    '',
    '----- contenido -----',
    contentText || '(no incluido)',
  ].join('\n')
}

function clientText(name) {
  return [
    `Hola ${name},`,
    '',
    'He recibido el diseño de tu web. Te paso un presupuesto sin compromiso en menos de un día laborable.',
    '',
    'Un saludo.',
  ].join('\n')
}
