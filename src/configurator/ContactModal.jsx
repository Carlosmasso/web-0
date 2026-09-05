import { useEffect, useRef, useState } from 'react'
import { submitLead, CONTACT_EMAIL } from '../export/contact'

const EMPTY = { name: '', email: '', phone: '', note: '' }

// Lo único que ve el cliente al pulsar "Quiero esta web": sus propios datos.
// Al enviar, todo viaja por fetch a FormSubmit — nada se abre en su pantalla.
export function ContactModal({ open, onClose, config, content, previewLink }) {
  const [lead, setLead] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const firstFieldRef = useRef(null)

  // Un ref para que el listener de Escape lea el estado actual sin necesidad
  // de re-registrarse (y sin re-disparar el reset de abajo) en cada cambio.
  const statusRef = useRef(status)
  statusRef.current = status

  // Reset + foco: SOLO al abrir. Meter `status` aquí haría que el efecto se
  // resetee a sí mismo en cuanto pasa a "sending".
  useEffect(() => {
    if (!open) return undefined
    setLead(EMPTY)
    setStatus('idle')
    const raf = requestAnimationFrame(() => firstFieldRef.current?.focus())
    const onKey = (e) => {
      if (e.key === 'Escape' && statusRef.current !== 'sending') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const canSubmit = lead.name.trim() && lead.email.trim() && status !== 'sending'
  const set = (key) => (e) => setLead((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    try {
      await submitLead({
        config,
        content,
        previewLink,
        lead: {
          name: lead.name.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim(),
          note: lead.note.trim(),
        },
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const veilClose = (e) => {
    if (e.target === e.currentTarget && status !== 'sending') onClose()
  }

  return (
    <div className="modal-veil" onMouseDown={veilClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
        {status === 'sent' ? (
          <div className="modal__done">
            <span className="modal__done-mark" aria-hidden="true">
              ✓
            </span>
            <h2 id="contact-title">¡Recibido!</h2>
            <p>Te escribo en menos de 24&nbsp;h para cerrar los detalles.</p>
            <button type="button" className="modal__submit" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="modal__head">
              <div>
                <h2 id="contact-title">Quiero esta web</h2>
                <p>Déjame tus datos y te escribo para cerrar los detalles.</p>
              </div>
              <button
                type="button"
                className="modal__close"
                onClick={onClose}
                disabled={status === 'sending'}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit}>
              <label className="field">
                <span className="field__label">Nombre</span>
                <input
                  ref={firstFieldRef}
                  type="text"
                  required
                  value={lead.name}
                  onChange={set('name')}
                  placeholder="Tu nombre"
                />
              </label>

              <label className="field">
                <span className="field__label">Email</span>
                <input
                  type="email"
                  required
                  value={lead.email}
                  onChange={set('email')}
                  placeholder="tu@correo.com"
                />
              </label>

              <label className="field">
                <span className="field__label">
                  Teléfono<em>opcional</em>
                </span>
                <input type="tel" value={lead.phone} onChange={set('phone')} placeholder="600 000 000" />
              </label>

              <label className="field">
                <span className="field__label">
                  Algo que deba saber<em>opcional</em>
                </span>
                <textarea
                  rows={3}
                  value={lead.note}
                  onChange={set('note')}
                  placeholder="Plazos, dudas, lo que sea…"
                />
              </label>

              {status === 'error' && (
                <p className="modal__error">
                  No se pudo enviar. Vuelve a intentarlo o escríbeme a{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              )}

              <button type="submit" className="modal__submit" disabled={!canSubmit}>
                {status === 'sending' ? 'Enviando…' : 'Enviar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
