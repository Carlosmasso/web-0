// ============================================================
// EL CLIENTE PIDE PRESUPUESTO — ENVÍO SILENCIOSO
//
// El cliente rellena el modal y pulsa "Enviar". Nada se abre en su pantalla:
// una petición a /api/lead (función serverless en Vercel) registra la solicitud
// en tu Google Sheet y te avisa por correo. Ver api/lead.js y SETUP.md.
//
// El .zip NO se envía por correo (los adjuntos disparan los filtros de spam):
// se regenera desde el configurador con el enlace `?c=` que va en la hoja.
//
// En `npm run dev` la función no existe: usa `vercel dev` o el deploy.
// ============================================================

// Solo para el enlace `mailto:` de respaldo que muestra el modal si algo falla.
export const CONTACT_EMAIL = 'cmassoweb@gmail.com'

/** En el volcado de contenido para la hoja, acorta las imágenes subidas grandes. */
const stripDataUris = (_k, v) =>
  typeof v === 'string' && v.startsWith('data:image/') && v.length > 60000
    ? `[imagen subida — ${Math.round(v.length / 1024)} KB, pídela al cliente]`
    : v

/**
 * @param {{ content: object, previewLink: string, editLink: string,
 *           lead: { name: string, email: string, phone?: string, note?: string } }} args
 * @returns {Promise<void>} resuelve si la solicitud quedó registrada; lanza si no.
 */
export async function submitLead({ content, previewLink, editLink, lead }) {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      note: lead.note || '',
      brand: content?.brand?.name || '',
      previewLink,
      editLink,
      consent: true,
      contentText: JSON.stringify(content, stripDataUris, 2),
    }),
  }).catch(() => null)

  const data = res && res.ok ? await res.json().catch(() => ({})) : {}
  if (!data.ok) throw new Error('No se pudo registrar la solicitud.')
}
