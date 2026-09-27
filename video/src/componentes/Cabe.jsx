import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { cancelRender, continueRender, delayRender } from 'remotion'
import { Tiempo } from './Aparece'

// ============================================================
// QUE EL TEXTO QUEPA — sin cambiar de tamaño
//
// Envuelve la zona de contenido de una diapositiva (la que tiene alto fijo).
// Cuando las fuentes han cargado, mide: si algo se sale por abajo o por un
// lado, el render FALLA diciendo qué diapositiva y qué texto. No se encoge
// nada: la escala es la misma en todos los carruseles (`formato.js`), y lo
// que se adapta es el texto, que hay que acortar.
//
// Remotion no captura el fotograma hasta que se llama a `continueRender`, así
// que ninguna imagen sale sin haberse comprobado.
// ============================================================

const desborda = (zona, contenido) =>
  contenido.scrollHeight > zona.clientHeight + 1 || contenido.scrollWidth > zona.clientWidth + 1

export function Cabe({ children, nombre = 'diapositiva' }) {
  const zona = useRef(null)
  const contenido = useRef(null)
  // En vídeo (carrusel animado) no se mide: los bloques entran desplazados y
  // se contarían como desbordamiento. El texto es el mismo que en la imagen
  // fija, que se renderiza antes y sí se comprueba.
  const enVideo = useContext(Tiempo) != null
  const [espera] = useState(() => (enVideo ? null : delayRender(`Comprobando el texto de ${nombre}`)))

  useLayoutEffect(() => {
    if (espera == null) return undefined
    let vivo = true
    let hecho = false
    document.fonts.ready.then(() => {
      if (!vivo) return
      hecho = true
      if (desborda(zona.current, contenido.current)) {
        const texto = contenido.current.textContent.replace(/\s+/g, ' ').slice(0, 90)
        const sobra = Math.max(
          contenido.current.scrollHeight - zona.current.clientHeight,
          contenido.current.scrollWidth - zona.current.clientWidth,
        )
        const z = zona.current
        const c = contenido.current
        cancelRender(
          new Error(
            `No cabe el texto de ${nombre} (sobran ${sobra} px; zona ${z.clientWidth}x${z.clientHeight}, ` +
              `contenido ${c.scrollWidth}x${c.scrollHeight}); hay que acortarlo: "${texto}…"`,
          ),
        )
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
    <div ref={zona} style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
      <div ref={contenido} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
