// ============================================================
// /api/lead  —  función serverless (Vercel)
//
// Recibe una petición de presupuesto del modal de contacto y hace dos cosas
// independientes, para que el lead nunca se pierda si una falla:
//   1. Añade una fila a tu Google Sheet (registro fiable, con TODO el detalle).
//   2. Te avisa por correo — texto plano y corto, SIN adjuntos ni volcados JSON.
//   3. (Opcional) confirma al cliente. Puede fallar sin pasar nada.
//
// Antes de nada filtra el spam: campo trampa (honeypot) + tiempo mínimo en el
// formulario + topes de tamaño. Un bot recibe un 200 "ok" pero no se procesa.
//
// La respuesta incluye `out` con el detalle de cada vía, para diagnosticar.
// Variables de entorno: ver .env.example.
// ============================================================

const send = (res, code, body) => res.status(code).json(body)
const str = (v) => (typeof v === 'string' ? v : '')

// Tiempo mínimo verosímil rellenando el formulario. Por debajo, es un bot.
export const MIN_FORM_MS = 2500

/** ¿Huele a bot? Honeypot relleno o envío instantáneo. Función pura, testeable. */
export function looksLikeBot(p = {}) {
  if (str(p.company).trim()) return 'honeypot'
  const ms = Number(p.elapsedMs)
  if (Number.isFinite(ms) && ms > 0 && ms < MIN_FORM_MS) return 'too_fast'
  return null
}

/** ¿Payload fuera de rango? Corta antes de tocar Sheet o correo. */
export function tooLarge(p = {}) {
  return (
    str(p.name).length > 200 ||
    str(p.email).length > 200 ||
    str(p.phone).length > 40 ||
    str(p.brand).length > 200 ||
    str(p.note).length > 4000 ||
    str(p.contentText).length > 200000
  )
}

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
    editLink = '',
    consent,
    contentText = '',
    images = '',
  } = p

  // Bots: 200 "ok" para no darles pistas, pero sin procesar nada.
  const bot = looksLikeBot(p)
  if (bot) return send(res, 200, { ok: true, skipped: bot })

  if (tooLarge(p)) return send(res, 413, { error: 'payload_too_large' })

  if (!name || !email || !consent) return send(res, 400, { error: 'missing_fields' })

  const now = new Date()
  const out = { sheet: false, sheetDetail: null, adminMail: false, adminDetail: null }

  // --- 1. Google Sheet ---
  if (!process.env.LEAD_SHEET_URL) {
    out.sheetDetail = 'LEAD_SHEET_URL no configurada'
  } else {
    try {
      const r = await fetch(process.env.LEAD_SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        body: JSON.stringify({
          token: process.env.LEAD_SHEET_TOKEN || '',
          fecha: now.toISOString(),
          nombre: name,
          email,
          telefono: phone,
          negocio: brand,
          nota: note,
          imagenes: images,
          enlace: previewLink,
          editar: editLink,
          contenido: contentText,
          consentimiento: 'sí',
        }),
      })
      const body = await r.text()
      out.sheet = r.ok && body.includes('"ok":true')
      out.sheetDetail = { status: r.status, body: body.slice(0, 300) }
    } catch (e) {
      out.sheetDetail = { error: String(e) }
    }
  }

  // --- 2. Aviso por correo ---
  const key = process.env.RESEND_API_KEY
  const from = process.env.LEAD_FROM_EMAIL
  const to = process.env.LEAD_TO_EMAIL
  if (!(key && from && to)) {
    out.adminDetail = 'RESEND_API_KEY / LEAD_FROM_EMAIL / LEAD_TO_EMAIL incompletas'
  } else {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to,
          reply_to: email,
          subject: `Petición de presupuesto — ${brand || 'web'} · ${name}`,
          text: adminText({ name, email, phone, note, brand, previewLink, images, now }),
        }),
      })
      const body = await r.text()
      out.adminMail = r.ok
      out.adminDetail = { status: r.status, body: body.slice(0, 300) }
    } catch (e) {
      out.adminDetail = { error: String(e) }
    }

    // Confirmación al cliente (best-effort; Resend sin dominio verificado solo
    // deja enviar al correo de la cuenta).
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: email,
        subject: 'Hemos recibido tu petición de presupuesto',
        text: clientText(name),
      }),
    }).catch(() => {})
  }

  const ok = out.sheet || out.adminMail
  if (!ok) console.error('[lead] ninguna vía funcionó:', JSON.stringify(out))
  return send(res, ok ? 200 : 502, { ok, out })
}

function adminText({ name, email, phone, note, brand, previewLink, images, now }) {
  return [
    `Nueva petición de presupuesto (${now.toLocaleString('es-ES')})`,
    '',
    `Nombre:   ${name}`,
    `Email:    ${email}`,
    `Teléfono: ${phone || '-'}`,
    `Negocio:  ${brand || '-'}`,
    `Nota:     ${note || '-'}`,
    `Imágenes: ${images ? `${images} — pídeselas al cliente al responder` : 'ninguna'}`,
    '',
    `Diseño: ${previewLink}`,
    '',
    'El enlace para regenerar el proyecto y el contenido están en tu hoja de leads.',
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
