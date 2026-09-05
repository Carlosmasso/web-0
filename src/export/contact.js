// ============================================================
// EL CLIENTE TE CONTACTA — ENVÍO SILENCIOSO
//
// El cliente rellena el modal y pulsa "Enviar". Nada se abre en su pantalla:
// una petición fetch a FormSubmit lleva sus datos + la config + el contenido
// + el proyecto ya empaquetado (.zip adjunto) a tu correo. Ve solo un
// "gracias, te contactamos".
//
// PRIMERA VEZ: FormSubmit te manda un correo de confirmación con un enlace.
// Ábrelo una vez y a partir de ahí llegan todos los envíos.
// ============================================================

import { buildProjectFiles } from './scaffold'
import { buildZipBlob } from './zip'

// A dónde llegan los avisos. Cámbialo aquí si algún día usas otra dirección.
export const CONTACT_EMAIL = 'cmassoweb@gmail.com'

const ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`

/**
 * @param {{ config: object, content: object, previewLink: string,
 *           lead: { name: string, email: string, phone?: string, note?: string } }} args
 * @returns {Promise<void>}  resuelve si FormSubmit acepta el envío; lanza si no.
 */
export async function submitLead({ config, content, previewLink, lead }) {
  const brand = content?.brand?.name || 'mi negocio'
  const { files, projectName } = buildProjectFiles(config, content)
  const { blob, filename } = await buildZipBlob(files, projectName)

  const form = new FormData()
  form.append('name', lead.name)
  form.append('email', lead.email)
  if (lead.phone) form.append('phone', lead.phone)
  if (lead.note) form.append('message', lead.note)

  // Campos de control de FormSubmit
  form.append('_subject', `Quiero esta web para ${brand} — ${lead.name}`)
  form.append('_captcha', 'false')
  form.append('_template', 'table')

  // Todo lo que necesitas para entregar, en el mismo correo
  form.append('vista_previa', previewLink)
  form.append('configuracion', JSON.stringify(config, null, 2))
  form.append('contenido', JSON.stringify(content, null, 2))
  form.append('attachment', blob, filename)

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: form,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === 'false' || data.success === false) {
    if (/activ/i.test(data.message || '')) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Estudio] FormSubmit aún no está activo para ${CONTACT_EMAIL}. ` +
          `Revisa ese correo y pulsa el enlace "Activate Form" una vez.`,
      )
    }
    throw new Error(data.message || `FormSubmit respondió ${res.status}`)
  }
}
