import { useEffect, useState } from 'react'

// ============================================================
// FOCO
//
// Resuelve el problema de orientación: el usuario toca un control y no sabe
// qué parte del sitio va a cambiar. Al pasar el puntero por un control del
// panel, el lienzo desplaza hasta el primer elemento afectado y dibuja un
// contorno sobre todos ellos.
//
// Pasar el ratón NUNCA desplaza. Barrer el puntero por la lista de controles
// dispararía un scroll por cada uno y el lienzo daría saltos constantes.
// Iluminar es pasivo; ir hasta allí es un clic deliberado (scrollTo).
//
// Se mide en un bucle de rAF mientras el foco está activo, porque durante un
// desplazamiento suave los rectángulos se mueven. Solo vive mientras dura el
// foco, así que el coste es irrelevante.
// ============================================================

export function Spotlight({ selector, label, scrollTo }) {
  const [rects, setRects] = useState([])

  useEffect(() => {
    if (!selector) {
      setRects([])
      return undefined
    }

    const els = Array.from(document.querySelectorAll(selector))
    if (els.length === 0) {
      setRects([])
      return undefined
    }

    // `scrollTo` es una marca de tiempo: cambia en cada clic, de modo que
    // pulsar "Ver" dos veces vuelve a desplazar.
    if (scrollTo) {
      els[0].scrollIntoView({ block: 'center', behavior: 'smooth' })
    }

    let raf = 0
    const measure = () => {
      setRects(
        els.map((el) => {
          const r = el.getBoundingClientRect()
          return { top: r.top, left: r.left, width: r.width, height: r.height }
        }),
      )
      raf = requestAnimationFrame(measure)
    }
    measure()
    return () => cancelAnimationFrame(raf)
  }, [selector, scrollTo])

  if (rects.length === 0) return null

  return (
    <div className="pv-spot" aria-hidden="true">
      {rects.map((r, i) => (
        <span
          key={i}
          className="pv-spot__ring"
          style={{ top: r.top, left: r.left, width: r.width, height: r.height }}
        >
          {i === 0 && label && <em className="pv-spot__tag">{label}</em>}
        </span>
      ))}
    </div>
  )
}
