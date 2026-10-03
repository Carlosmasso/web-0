import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'
import { submitLead, summariseImages, noteWithExtras, CONTACT_EMAIL } from '../export/contact'
import { track } from '../config/analytics'
import { isStudio } from '../config/mode'

const EMPTY = { name: '', email: '', phone: '', note: '', company: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Lo que puede necesitar además de la página que ha diseñado (TARIFAS.md).
const EXTRAS = ['Más páginas', 'Reservas o citas', 'Vender online', 'Cambios después de publicar']

/** Lo que falta para poder enviar, campo a campo. Vacío = se puede enviar. */
function validate(lead, consent) {
  const errors = {}
  if (!lead.name.trim()) errors.name = 'Dime cómo te llamas.'
  if (!lead.email.trim()) errors.email = 'Necesito un email para poder escribirte.'
  else if (!EMAIL_RE.test(lead.email.trim())) errors.email = 'Revisa el email: parece que le falta algo.'
  if (!consent) errors.consent = 'Marca la casilla para que pueda usar tus datos.'
  return errors
}

// Lo único que ve el cliente al pulsar "Quiero esta web": sus datos + el
// consentimiento. Al enviar, todo va por fetch a /api/lead — nada se abre en
// su pantalla. No hay pago ni venta aquí: me escribe para que la veamos juntos.
export function ContactModal({
  open,
  onClose,
  content,
  previewLink,
  editLink,
  versionName = null,
}) {
  const [lead, setLead] = useState(EMPTY)
  const [consent, setConsent] = useState(false)
  const [extras, setExtras] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  // Los errores se enseñan solo tras el primer intento de envío; desde ahí se
  // recalculan en vivo, así que desaparecen en cuanto el campo se arregla.
  const [tried, setTried] = useState(false)
  const firstFieldRef = useRef(null)
  const emailRef = useRef(null)
  const consentRef = useRef(null)
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
    setExtras([])
    setStatus('idle')
    setTried(false)
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

  const errors = tried ? validate(lead, consent) : {}
  const set = (key) => (e) => setLead((prev) => ({ ...prev, [key]: e.target.value }))
  // Props de accesibilidad de un campo con posible error.
  const invalid = (key) =>
    errors[key] ? { 'aria-invalid': true, 'aria-describedby': `contact-${key}-error` } : {}
  const fieldError = (key) =>
    errors[key] ? (
      <span className="field__error" id={`contact-${key}-error`}>
        {errors[key]}
      </span>
    ) : null

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const found = validate(lead, consent)
    if (Object.keys(found).length) {
      setTried(true)
      // Al primero que falla, en el orden en que se leen.
      const ref = found.name ? firstFieldRef : found.email ? emailRef : consentRef
      ref.current?.focus()
      return
    }
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
          note: noteWithExtras(lead.note, extras),
          company: lead.company, // honeypot: un humano lo deja vacío
        },
      })
      setStatus('sent')
      if (!isStudio) track('lead_submitted', { extras: extras.join(', ') || 'ninguno' })
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
              <IconCheck size={22} stroke={2.2} />
            </span>
            <h2 id="contact-title">¡Recibido!</h2>
            <p>
              Te escribo desde <strong>{CONTACT_EMAIL}</strong> en menos de un día
              laborable para verla juntos. (Si no lo ves, mira en spam.)
            </p>
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
                <h2 id="contact-title">Cuéntame y te escribo yo</h2>
                <p>Déjame tus datos y te escribo en persona para verla juntos. Sin compromiso: aquí no pagas nada.</p>
                {/* Con varias versiones guardadas hay que decir cuál se está
                    pidiendo: el enlace que viaja es el del diseño en pantalla. */}
                {versionName && (
                  <p className="modal__version">
                    Me llega <strong>{versionName}</strong>, la versión que tienes en
                    pantalla.
                  </p>
                )}
              </div>
              <button
                type="button"
                className="modal__close"
                onClick={onClose}
                disabled={status === 'sending'}
                aria-label="Cerrar"
              >
                <IconX size={16} stroke={1.8} aria-hidden />
              </button>
            </div>

            <form onSubmit={submit} noValidate aria-busy={status === 'sending'}>
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

              <label className={`field${errors.name ? ' field--invalid' : ''}`}>
                <span className="field__label">Nombre</span>
                <input
                  ref={firstFieldRef}
                  type="text"
                  required
                  autoComplete="name"
                  value={lead.name}
                  onChange={set('name')}
                  placeholder="Tu nombre"
                  {...invalid('name')}
                />
                {fieldError('name')}
              </label>

              <label className={`field${errors.email ? ' field--invalid' : ''}`}>
                <span className="field__label">Email</span>
                <input
                  ref={emailRef}
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={lead.email}
                  onChange={set('email')}
                  placeholder="tu@correo.com"
                  {...invalid('email')}
                />
                {fieldError('email')}
              </label>

              <label className="field">
                <span className="field__label">
                  Teléfono<em>opcional</em>
                </span>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={lead.phone}
                  onChange={set('phone')}
                  placeholder="600 000 000"
                />
              </label>

              <fieldset className="field modal__extras">
                <legend className="field__label">
                  ¿Te hace falta algo más?<em>opcional</em>
                </legend>
                <div className="modal__extras-list">
                  {EXTRAS.map((x) => (
                    <label key={x} className="modal__extra">
                      <input
                        type="checkbox"
                        checked={extras.includes(x)}
                        onChange={(e) =>
                          setExtras((prev) =>
                            e.target.checked ? [...prev, x] : prev.filter((y) => y !== x),
                          )
                        }
                      />
                      <span>{x}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

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

              <label className={`modal__consent${errors.consent ? ' modal__consent--invalid' : ''}`}>
                <input
                  ref={consentRef}
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  {...invalid('consent')}
                />
                <span>
                  He leído y acepto la{' '}
                  <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">
                    política de privacidad
                  </a>
                  . Usaré tus datos solo para escribirte sobre tu web.
                </span>
              </label>
              {errors.consent && (
                <p className="field__error modal__consent-error" id="contact-consent-error">
                  {errors.consent}
                </p>
              )}

              {status === 'error' && (
                <p className="modal__error" role="alert">
                  No se pudo enviar. Vuelve a intentarlo o escríbeme a{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              )}

              <button type="submit" className="modal__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Enviando…' : 'Escríbeme'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
