// ============================================================
// EL CLIENTE TE CONTACTA — ENVÍO SILENCIOSO
//
// El cliente rellena el modal y pulsa "Enviar". Nada se abre en su pantalla:
// una petición a /api/lead (función serverless en Vercel) registra la solicitud
// en tu Google Sheet, te avisa por correo con el proyecto .zip adjunto y manda
// al cliente un "recibido". Ver api/lead.js y SETUP.md.
//
// En `npm run dev` la función no existe: usa `vercel dev` o prueba en una
// preview de Vercel.
// ============================================================

import { buildProjectFiles } from './scaffold'
import { buildZipBlob } from './zip'

// Solo para el enlace `mailto:` de respaldo que muestra el modal si algo falla.
export const CONTACT_EMAIL = 'cmassoweb@gmail.com'

// Por debajo de este tamaño de blob, el .zip viaja en el POST a /api/lead (en
// base64 crece ~33 %; el límite de cuerpo de Vercel ronda los 4,5 MB). Por
// encima, se omite: el enlace de vista previa ya lleva diseño y textos.
const MAX_ZIP_INLINE = 3_400_000

/** En el volcado legible, acorta solo las imágenes subidas grandes. */
const stripDataUris = (_k, v) =>
  typeof v === 'string' && v.startsWith('data:image/') && v.length > 60000
    ? `[imagen subida — ${Math.round(v.length / 1024)} KB, en el .zip: public/img/]`
    : v

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] || '')
    r.onerror = () => reject(new Error('read'))
    r.readAsDataURL(blob)
  })

/**
 * @param {{ config: object, content: object, previewLink: string,
 *           lead: { name: string, email: string, phone?: string, note?: string } }} args
 * @returns {Promise<void>} resuelve si la solicitud quedó registrada; lanza si no.
 */
export async function submitLead({ config, content, previewLink, lead }) {
  const brand = content?.brand?.name || ''
  const { files, projectName } = buildProjectFiles(config, content)
  const { blob, filename } = await buildZipBlob(files, projectName)
  const zipBase64 = blob.size <= MAX_ZIP_INLINE ? await blobToBase64(blob) : ''

  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      note: lead.note || '',
      brand,
      previewLink,
      consent: true,
      configText: JSON.stringify(config, null, 2),
      contentText: JSON.stringify(content, stripDataUris, 2),
      zipBase64,
      zipName: filename,
    }),
  }).catch(() => null)

  const data = res && res.ok ? await res.json().catch(() => ({})) : {}
  if (!data.ok) throw new Error('No se pudo registrar la solicitud.')
}
