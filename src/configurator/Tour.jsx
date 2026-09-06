import { useCallback, useEffect, useLayoutEffect, useState } from 'react'

// ============================================================
// TOUR GUIADO  —  SOLO MODO CLIENTE
//
// La primera vez que un cliente entra, un recorrido de seis pasos le explica
// para qué es la herramienta y cómo usarla en su caso. Se marca como visto en
// localStorage; el botón "¿Cómo funciona?" lo vuelve a lanzar.
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
    title: 'Empieza por un punto de partida',
    body: 'Elige por tu sector (dentista, bufete, cafetería…) o por un estilo. Todo lo demás llega ya afinado y encajado.',
  },
  {
    target: '[data-tour="identity"]',
    title: 'Ajústalo a lo tuyo',
    body: 'Tu color de marca, la tipografía, las esquinas, el aire. Cada control hace exactamente lo que dice, sin sorpresas.',
  },
  {
    target: '.stage',
    title: 'Se ve al instante',
    body: 'Todo lo que tocas aparece aquí al momento, tal cual quedará tu web publicada. Prueba cosas sin miedo: nada se rompe y puedes deshacer.',
  },
  {
    target: '.shell__tabs',
    title: 'Tus textos y fotos, si quieres',
    body: 'En "Contenido" puedes escribir tus textos y subir tus imágenes. Es opcional: si lo prefieres, los pongo yo al construirla.',
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

export function Tour({ steps, open, onClose }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)
  const step = steps[i]
  const last = i === steps.length - 1

  useEffect(() => {
    if (open) setI(0)
  }, [open])

  // Mide el objetivo del paso, tras un scroll suave por si está fuera de vista.
  useLayoutEffect(() => {
    if (!open) return undefined
    const measure = () => {
      const el = step.target ? document.querySelector(step.target) : null
      setRect(el ? el.getBoundingClientRect() : null)
    }
    const el = step.target ? document.querySelector(step.target) : null
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    measure()
    const t = setTimeout(measure, 280)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
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
            // Recorta el resalte a lo que se ve: una capa alta (la de presets)
            // no debe pintar un halo de 900 px.
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
