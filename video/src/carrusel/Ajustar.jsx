import { useLayoutEffect, useRef, useState } from 'react'
import { cancelRender, continueRender, delayRender } from 'remotion'

// ============================================================
// QUE EL TEXTO QUEPA — la protección contra el desborde
//
// Envuelve la zona de contenido de una diapositiva (la que tiene alto fijo).
// Cuando las fuentes han cargado, mide: si el contenido se sale por abajo o
// por un lado, baja `--k` (todos los tamaños van con `px()`) hasta que
// quepa. Si ni al mínimo cabe, el render falla con el texto culpable: es
// preferible a publicar una imagen con una frase cortada.
//
// Remotion no captura el fotograma hasta que se llama a `continueRender`,
// así que la imagen sale siempre ya ajustada.
// ============================================================

const PASO = 0.03
const MINIMO = 0.62

const desborda = (zona, contenido) =>
  contenido.scrollHeight > zona.clientHeight + 1 || contenido.scrollWidth > zona.clientWidth + 1

/**
 * @param alinear  dónde se coloca el contenido en vertical ('start', 'center',
 *                 'end'). Va con `safe`: si no cabe, se desborda hacia abajo,
 *                 que es lo que se puede medir, y no hacia arriba.
 */
export function Ajustar({ children, nombre = 'diapositiva', alinear = 'start', style }) {
  const zona = useRef(null)
  const contenido = useRef(null)
  const [espera] = useState(() => delayRender(`Ajustando el texto de ${nombre}`))

  useLayoutEffect(() => {
    let vivo = true
    let hecho = false
    document.fonts.ready.then(() => {
      if (!vivo) return
      hecho = true
      let k = 1
      const aplicar = () => zona.current.style.setProperty('--k', String(k))
      aplicar()
      while (k > MINIMO && desborda(zona.current, contenido.current)) {
        k = Math.max(MINIMO, k - PASO)
        aplicar()
      }
      if (desborda(zona.current, contenido.current)) {
        const texto = contenido.current.textContent.replace(/\s+/g, ' ').slice(0, 90)
        cancelRender(new Error(`No cabe el texto de ${nombre}, ni reducido al ${MINIMO * 100}%: "${texto}…"`))
        return
      }
      continueRender(espera)
    })
    // En el editor, si la diapositiva se desmonta antes de medir, se suelta
    // la espera para que no se quede colgada.
    return () => {
      vivo = false
      if (!hecho) continueRender(espera)
    }
  }, [espera, nombre])

  return (
    <div ref={zona} style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', ...style }}>
      <div ref={contenido} style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: `safe ${alinear}` }}>
        {children}
      </div>
    </div>
  )
}
