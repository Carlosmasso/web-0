import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

// ============================================================
// TOUR GUIADO
//
// La primera vez que se entra, un recorrido guiado explica para qué es la
// herramienta y cómo usarla. Se marca como visto en localStorage; el botón
// "¿Cómo funciona?" lo vuelve a lanzar.
//
// Un paso puede llevar:
//   - `expand: true` — si apunta a la cabecera de una capa plegada, la abre
//     antes de resaltarla.
//   - `reveal: { selector, label }` — dispara el mismo "Ver" del panel en el
//     lienzo, para enseñar en vivo cómo el panel señala partes del sitio.
// ============================================================

const TOUR_KEY = 'web0.tour.v1'

export const isTourDone = () => {
  try {
    return localStorage.getItem(TOUR_KEY) === '1'
  } catch {
    return true // sin almacenamiento, no insistas
  }
}

export const markTourDone = () => {
  try {
    localStorage.setItem(TOUR_KEY, '1')
  } catch {
    /* ignore */
  }
}

/** `target` es un selector CSS; sin él, el paso va centrado. */
export const TOUR_STEPS = [
  {
    title: 'Esta herramienta es para ti',
    body: 'Aquí diseñas tu propia web: eliges cómo se ve. Cuando te guste, pides un presupuesto sin compromiso y yo la construyo con tu contenido y te la entrego.',
  },
  {
    target: '[data-tour="start"]',
    title: 'No empiezas de cero',
    body: 'Elige una base por tu sector (dentista, bufete, cafetería…) o por el estilo que te guste. Viene con colores, tipografía y secciones que ya encajan entre sí, y puedes cambiarla cuando quieras.',
  },
  {
    target: '[data-tour="identity"]',
    title: 'Ponle tu marca',
    body: 'Tu color, tu tipografía, la forma de las esquinas y el movimiento. Elijas el color que elijas, el resto de la paleta se ajusta solo para que todo se lea bien.',
  },
  {
    target: '[data-tour="fine"]',
    expand: true,
    title: 'Afina los detalles, si quieres',
    body: 'Aquí eliges qué secciones aparecen y en qué orden, y retocas detalles como el fondo de la portada o el estilo de los botones. Va plegado a propósito: la base ya viene bien, esto es solo para rematar.',
  },
  {
    target: '.stage',
    reveal: { selector: '.db-footer', label: 'El pie de página' },
    title: 'Se ve al instante, y te señala qué cambia',
    body: 'Todo lo que tocas aparece aquí al momento. Y cada ajuste del panel dice a qué parte de la web afecta: pásale el ratón y se ilumina aquí, o pulsa "Ver" y baja hasta ella (como ahora, al pie). Prueba sin miedo: nada se rompe y arriba tienes "Deshacer".',
  },
  {
    target: '.shell__tabs',
    title: 'Tus textos y fotos, si quieres',
    body: 'En "Contenido" escribes tus textos y subes imágenes. Ahí va también tu WhatsApp, si quieres un botón flotante para que te escriban. Todo opcional: si lo prefieres, lo pongo yo al construirla.',
  },
  {
    target: '.shell__cta',
    title: 'Pide presupuesto cuando quieras',
    body: 'Pulsa "Pedir presupuesto", déjame tus datos y te paso un precio sin compromiso para esta web. No hay ningún pago por aquí.',
  },
]

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const CARD_W = 320

/** Coloca la tarjeta a un lado del elemento resaltado, o debajo si no cabe. */
function placeCard(rect) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 16
  const top = clamp(rect.top, 12, vh - 260)
  if (vw - rect.right > CARD_W + gap + 12) return { left: rect.right + gap, top }
  if (rect.left > CARD_W + gap + 12) return { left: rect.left - CARD_W - gap, top }
  return { left: clamp(rect.left, 12, vw - CARD_W - 12), top: clamp(rect.bottom + gap, 12, vh - 260) }
}

export function Tour({ steps, open, onClose, onReveal }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)
  const step = steps[i]
  const last = i === steps.length - 1

  useEffect(() => {
    if (open) setI(0)
  }, [open])

  // Pasos con `reveal`: disparan el "Ver" en el lienzo, con un respiro para que
  // la tarjeta y el recuadro ya estén puestos. Al salir del paso se limpia.
  useEffect(() => {
    if (!open || !onReveal || !step.reveal) return undefined
    const t = setTimeout(() => onReveal(step.reveal), 380)
    return () => {
      clearTimeout(t)
      onReveal(null)
    }
  }, [open, i, step, onReveal])

  // Mide el objetivo del paso. El scroll es instantáneo y centra el objetivo:
  // la transición CSS de `.tour__spot` hace el desplazamiento visible entre
  // pasos, y así la medida no compite con una animación de scroll a medias
  // (era lo que descuadraba el recuadro en los pasos con panel desplazado).
  useLayoutEffect(() => {
    if (!open) return undefined
    const el = step.target ? document.querySelector(step.target) : null
    if (!el) {
      setRect(null)
      return undefined
    }

    // Si el paso apunta a una capa plegada, ábrela para que se vea qué lleva.
    if (step.expand && el.closest('.layer')?.classList.contains('is-open') === false) {
      el.click()
    }

    el.scrollIntoView({ block: 'center', behavior: 'auto' })

    const measure = () => setRect(el.getBoundingClientRect())
    let raf1 = 0
    let raf2 = 0
    // Dos frames: uno para que el scroll cuaje, otro para el layout resultante.
    raf1 = requestAnimationFrame(() => {
      measure()
      raf2 = requestAnimationFrame(measure)
    })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.removeEventListener('resize', measure)
    }
  }, [open, i, step])

  const next = useCallback(() => {
    if (last) onClose()
    else setI((v) => v + 1)
  }, [last, onClose])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next()
      else if (e.key === 'ArrowLeft') setI((v) => Math.max(0, v - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, next, onClose])

  if (!open) return null

  const cardStyle = rect
    ? placeCard(rect)
    : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-label="Cómo funciona">
      {rect && (
        <div
          className="tour__spot"
          style={{
            left: rect.left - 8,
            top: Math.max(4, rect.top - 8),
            width: rect.width + 16,
            // Salvaguarda: nunca más alto que el viewport, por si un paso apunta
            // a un elemento grande.
            height: Math.min(rect.height + 16, window.innerHeight - Math.max(4, rect.top - 8) - 8),
          }}
        />
      )}
      {!rect && <div className="tour__veil" />}

      <div className="tour__card" style={cardStyle}>
        <p className="tour__count">
          {i + 1} / {steps.length}
        </p>
        <h3>{step.title}</h3>
        <p>{step.body}</p>
        <div className="tour__nav">
          {!last ? (
            <button type="button" className="tour__skip" onClick={onClose}>
              Saltar
            </button>
          ) : (
            <span />
          )}
          <div className="tour__nav-right">
            {i > 0 && (
              <button type="button" className="tour__back" onClick={() => setI((v) => v - 1)}>
                Atrás
              </button>
            )}
            <button type="button" className="tour__next" onClick={next}>
              {last ? 'Entendido' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
