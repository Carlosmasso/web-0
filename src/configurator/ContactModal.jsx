import { useEffect, useRef, useState } from 'react'
import { submitLead, summariseImages, CONTACT_EMAIL } from '../export/contact'

const EMPTY = { name: '', email: '', phone: '', note: '', company: '' }

// Lo único que ve el cliente al pulsar "Pedir presupuesto": sus datos + el
// consentimiento. Al enviar, todo va por fetch a /api/lead — nada se abre en
// su pantalla. No hay pago ni venta aquí, solo una petición de presupuesto.
export function ContactModal({ open, onClose, content, previewLink, editLink }) {
  const [lead, setLead] = useState(EMPTY)
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const firstFieldRef = useRef(null)
  const modalRef = useRef(null)
  const openedAt = useRef(0)
  const hadImages = useRef(false)

  // Refs para que el efecto de abajo lea lo actual sin re-registrarse (ni
  // re-disparar el reset) en cada cambio.
  const statusRef = useRef(status)
  statusRef.current = status
  const contentRef = useRef(content)
  contentRef.current = content

  // Reset + foco: SOLO al abrir. Meter `status` aquí haría que el efecto se
  // resetee a sí mismo en cuanto pasa a "sending".
  useEffect(() => {
    if (!open) return undefined
    setLead(EMPTY)
    setConsent(false)
    setStatus('idle')
    openedAt.current = Date.now()
    hadImages.current = Boolean(summariseImages(contentRef.current))
    const raf = requestAnimationFrame(() => firstFieldRef.current?.focus())
    const onKey = (e) => {
      if (e.key === 'Escape' && statusRef.current !== 'sending') return onClose()
      // Trampa de foco: Tab no se escapa del modal mientras está abierto.
      if (e.key !== 'Tab') return
      const f = modalRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])',
      )
      if (!f || !f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const canSubmit = lead.name.trim() && lead.email.trim() && consent && status !== 'sending'
  const set = (key) => (e) => setLead((prev) => ({ ...prev, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('sending')
    try {
      await submitLead({
        content,
        previewLink,
        editLink,
        elapsedMs: Date.now() - openedAt.current,
        lead: {
          name: lead.name.trim(),
          email: lead.email.trim(),
          phone: lead.phone.trim(),
          note: lead.note.trim(),
          company: lead.company, // honeypot: un humano lo deja vacío
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
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        ref={modalRef}
      >
        {status === 'sent' ? (
          <div className="modal__done">
            <span className="modal__done-mark" aria-hidden="true">
              ✓
            </span>
            <h2 id="contact-title">¡Recibido!</h2>
            <p>Te paso el presupuesto en menos de un día laborable. Sin compromiso.</p>
            {hadImages.current && (
              <p className="modal__done-note">
                Subiste fotos: guárdalas a mano. Te las pediré al responderte —
                no viajan en el enlace.
              </p>
            )}
            <button type="button" className="modal__submit" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="modal__head">
              <div>
                <h2 id="contact-title">Presupuesto sin compromiso</h2>
                <p>Déjame tus datos y te paso un presupuesto de esta web. No hay ningún pago ni obligación ahora.</p>
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
              {/* Honeypot: fuera de pantalla y del recorrido de tab. Un humano
                  no lo ve; un bot lo rellena y el servidor lo descarta. */}
              <div className="modal__hp" aria-hidden="true">
                <label>
                  Empresa
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={lead.company}
                    onChange={set('company')}
                  />
                </label>
              </div>

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

              <label className="modal__consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>
                  He leído y acepto la{' '}
                  <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">
                    política de privacidad
                  </a>
                  . Usaré tus datos solo para enviarte el presupuesto y responderte.
                </span>
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
