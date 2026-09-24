import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

// ============================================================
// TOUR GUIADO
//
// La primera vez que se entra, un recorrido guiado explica para qué es la
// herramienta y cómo usarla. Se marca como visto en localStorage; el botón
// "¿Cómo funciona?" lo vuelve a lanzar.
//
// Un paso puede llevar:
//   - `panel: 'start' | 'identity' | 'fine'` — lleva el panel de diseño a ese
//     paso antes de resaltarlo, porque solo se pinta el paso activo.
//   - `tab: 'design' | 'content'` — cambia de pestaña del panel. Sin él, un paso
//     con `panel` vuelve solo a Diseño, para que ir hacia atrás no deje la
//     pestaña cruzada con el paso que se está explicando.
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
    target: '[data-tour="steps"]',
    panel: 'start',
    title: 'Tres pasos, siempre a la vista',
    body: 'El diseño se hace en tres: eliges una base, le pones tu marca y, si te apetece, afinas los detalles. Puedes saltar de uno a otro cuando quieras — nada se pierde por el camino.',
  },
  {
    target: '[data-tour="start"]',
    panel: 'start',
    title: 'Paso 1 · No empiezas de cero',
    body: 'Elige una base por tu sector (dentista, bufete, cafetería…) o por el estilo que te guste. Viene con colores, tipografía y secciones que ya encajan entre sí, y puedes cambiarla cuando quieras.',
  },
  {
    target: '.surprise',
    panel: 'start',
    title: 'Y si no sabes por dónde empezar, tira el dado',
    body: 'Pulsa "Sorpréndeme" y te monta una combinación entera —color, tipografía, acabado y estructura— coherente y sin romper nada. Púlsalo las veces que quieras: es la forma más rápida de descubrir qué te gusta, y lo que salga sigue siendo tuyo para retocarlo.',
  },
  {
    target: '[data-tour="identity"]',
    panel: 'identity',
    title: 'Paso 2 · Ponle tu marca',
    body: 'Tu color, tu tipografía, la forma de las esquinas y el movimiento. Elijas el color que elijas, el resto de la paleta se ajusta solo para que todo se lea bien.',
  },
  {
    target: '[data-tour="fine"]',
    panel: 'fine',
    title: 'Paso 3 · Afina los detalles, si quieres',
    body: 'Aquí eliges qué secciones aparecen y en qué orden, y retocas detalles como el fondo de la portada o el estilo de los botones. Es opcional: la base ya viene bien, esto es solo para rematar.',
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
    body: 'En "Contenido" escribes tus textos y subes tus imágenes. Es opcional: si lo prefieres, lo pongo yo al construirla con lo que me pases.',
  },
  {
    target: '[data-field="brand.whatsapp"]',
    tab: 'content',
    title: 'El botón de WhatsApp es tuyo',
    body: 'Ese botón verde flotante que ves abajo a la derecha en tu web abre una conversación de WhatsApp contigo. Ahora lleva un número de ejemplo que no existe: escribe aquí el tuyo con el prefijo (+34…) y ya funciona. Si no lo quieres, borra el campo y el botón desaparece.',
  },
  {
    target: '.shell__cta',
    title: 'Pide presupuesto cuando quieras',
    body: 'Pulsa "Pedir presupuesto", déjame tus datos y te paso un precio sin compromiso para esta web. No hay ningún pago por aquí.',
  },
]

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const CARD_W = 320

/**
 * Coloca la tarjeta a un lado del elemento resaltado, o debajo si no cabe.
 *
 * `cardH` es la altura MEDIDA, no una estimación: con un texto de seis líneas la
 * tarjeta pasaba de los 260px que se daban por hechos y el botón "Siguiente"
 * se quedaba por debajo del borde de la ventana — el paso se volvía un callejón
 * sin salida para quien no supiera que Enter también avanza.
 */
function placeCard(rect, cardH) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 16
  const maxTop = Math.max(12, vh - cardH - 12)
  const top = clamp(rect.top, 12, maxTop)
  if (vw - rect.right > CARD_W + gap + 12) return { left: rect.right + gap, top }
  if (rect.left > CARD_W + gap + 12) return { left: rect.left - CARD_W - gap, top }
  return {
    left: clamp(rect.left, 12, vw - CARD_W - 12),
    top: clamp(rect.bottom + gap, 12, maxTop),
  }
}

export function Tour({ steps, open, onClose, onReveal, panel, onPanel, tab, onTab }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)
  const cardRef = useRef(null)
  const [cardH, setCardH] = useState(260)
  const step = steps[i]
  const last = i === steps.length - 1

  useEffect(() => {
    if (open) setI(0)
  }, [open])

  // Pasos con `panel`: llevan el panel a ese paso. Va en su propio efecto y
  // antes del que mide, porque el objetivo (`[data-tour="identity"]`, por
  // ejemplo) no existe en el DOM hasta que el panel ha cambiado de paso; el
  // `panel` que llega de vuelta como prop es lo que dispara la medición.
  useEffect(() => {
    if (open && step.panel) onPanel?.(step.panel)
  }, [open, i, step, onPanel])

  // La pestaña, por el mismo motivo que el paso: el objetivo de un paso de
  // Contenido no existe en el DOM mientras se está mirando Diseño.
  useEffect(() => {
    if (!open) return
    if (step.tab) onTab?.(step.tab)
    else if (step.panel) onTab?.('design')
  }, [open, i, step, onTab])

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
  }, [open, i, step, panel, tab])

  // La altura real de la tarjeta, para que `placeCard` no la deje a medias
  // fuera de la ventana. El guarda de 2px evita el bucle medir -> pintar.
  useLayoutEffect(() => {
    const h = cardRef.current?.offsetHeight
    if (h && Math.abs(h - cardH) > 2) setCardH(h)
  })

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

  // Todos los hooks quedan por encima de esta línea: el early return no puede
  // saltarse ninguno o React pierde el orden entre renders.
  if (!open) return null

  const cardStyle = rect
    ? placeCard(rect, cardH)
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

      <div className="tour__card" style={cardStyle} ref={cardRef}>
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
