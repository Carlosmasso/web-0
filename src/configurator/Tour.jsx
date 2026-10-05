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

/**
 * `target` es un selector CSS; sin él, el paso va centrado.
 *
 * Tres pasos y no más: para qué es, que todo se ve al momento, y dónde se pide.
 * Lo demás (los tres pasos del panel, el dado, el WhatsApp) se explica solo
 * al usarlo; un recorrido de diez pantallas tapaba la web justo cuando tenía
 * que enganchar y casi nadie llegaba al paso que importa, el último.
 */
export const TOUR_STEPS = [
  {
    title: 'Esta herramienta es para ti',
    body: 'Aquí diseñas tu propia web y la ves tal cual quedará. Cuando te guste, me escribes y yo la construyo contigo.',
    sectors: true,
  },
  {
    target: '.stage',
    reveal: { selector: '.db-footer', label: 'El pie de página' },
    title: 'Todo se ve al momento',
    body: 'Lo que tocas en el panel aparece aquí al instante, y cada ajuste te señala qué parte de la web cambia. Prueba sin miedo: arriba tienes "Deshacer".',
  },
  {
    target: '.shell__cta',
    title: 'Cuando te guste, aquí me tienes',
    body: 'Pulsa "Quiero esta web", déjame tus datos y te escribo yo para verla juntos. Sin compromiso: aquí no pagas nada.',
  },
]

/**
 * "¿A qué te dedicas?": cada respuesta abre su punto de partida por sector,
 * con su contenido de ejemplo. Así nadie empieza mirando la web de otro tipo
 * de negocio. "Otra cosa" deja el ejemplo neutro.
 */
export const SECTOR_CHOICES = [
  { preset: 'local-food', label: 'Comercio u hostelería', note: 'Obrador, cafetería, tienda, taller' },
  { preset: 'medical-wellness', label: 'Salud y bienestar', note: 'Clínica, fisio, consulta' },
  { preset: 'corporate-legal', label: 'Despacho o asesoría', note: 'Abogados, gestoría, consultoría' },
  { preset: 'real-estate', label: 'Casas y arquitectura', note: 'Estudio, inmobiliaria, reformas' },
  { preset: null, label: 'Otra cosa', note: 'Empiezo por un ejemplo neutro' },
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

export function Tour({ steps, open, onClose, onReveal, panel, onPanel, tab, onTab, askSector = false, onSector }) {
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

  // En el móvil la tarjeta va siempre abajo, a lo ancho: así no tapa la web,
  // que es lo que tiene que enganchar.
  const narrow = window.innerWidth < 700
  const cardStyle = narrow
    ? { left: 12, right: 12, bottom: 12, width: 'auto' }
    : rect
      ? placeCard(rect, cardH)
      : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
  const showSectors = step.sectors && askSector

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
        {showSectors ? (
          <div className="tour__sectors" role="group" aria-label="¿A qué te dedicas?">
            <p className="tour__ask">¿A qué te dedicas?</p>
            {SECTOR_CHOICES.map((c) => (
              <button
                key={c.label}
                type="button"
                className="tour__sector"
                onClick={() => {
                  if (c.preset) onSector?.(c.preset)
                  next()
                }}
              >
                <strong>{c.label}</strong>
                <span>{c.note}</span>
              </button>
            ))}
          </div>
        ) : null}
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
            {showSectors ? null : (
              <button type="button" className="tour__next" onClick={next}>
                {last ? 'Entendido' : 'Siguiente'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
