import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { continueRender, delayRender } from 'remotion'
import { PreviewCanvas } from '../../../src/preview/PreviewCanvas'
import { DemoPage } from '../../../src/preview/DemoPage'
import { ensureFonts, familyOf } from '../../../src/theme/fonts'
import '../../../src/styles/reset.css'
import '../../../src/preview/demo.css'

// ============================================================
// EL ESCENARIO — la web de maketa.es, de verdad, dentro del vídeo
//
// No es una maqueta: son los mismos componentes de `src/preview/`, con el
// mismo CSS y los mismos guardarraíles que el configurador. El config se fija
// por fotograma, así que cada cambio cae exactamente donde dice el guion.
//
// Va dentro de un iframe porque el CSS del sitio usa media queries de VENTANA
// (`max-width: 860px`): a lo ancho del vídeo saldría la versión de escritorio.
// Un iframe de ~430 px responde como un teléfono y luego se escala.
// ============================================================

const PESOS = [400, 500, 600, 700, 800]

// En el vídeo manda el fotograma, no el reloj: las transiciones y animaciones
// CSS del sitio saldrían a medias, así que se apagan. El ritmo lo pone la
// plantilla (el golpe de escala en cada cambio).
const CSS_REEL = `
  html, body { margin: 0; overflow: hidden; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
  ::-webkit-scrollbar { display: none; }
`

const DOC_VACIO = '<!doctype html><html lang="es"><head><meta charset="utf-8"></head><body></body></html>'

/** Todas las URL de imagen de un contenido, para precargarlas. */
function imagenesDe(valor, salida = new Set()) {
  if (typeof valor === 'string') {
    if (/^https?:\/\/.+\.(jpe?g|png|webp)|picsum\.photos|images\.pexels\.com/i.test(valor)) salida.add(valor)
  } else if (valor && typeof valor === 'object') {
    for (const v of Object.values(valor)) imagenesDe(v, salida)
  }
  return salida
}

const hojaCargada = (link) =>
  link.sheet
    ? Promise.resolve()
    : new Promise((ok) => {
        link.addEventListener('load', ok, { once: true })
        link.addEventListener('error', ok, { once: true })
      })

/**
 * @param config     config de este fotograma (ya con guardarraíles)
 * @param contenido  contenido de la web
 * @param todos      { configs, contenidos } de todo el reel: fuentes e imágenes
 *                   se precargan de una vez, antes del primer fotograma
 * @param scroll     0 = arriba del todo, 1 = abajo del todo
 * @param ancho/alto tamaño de la ventana del sitio, en px CSS
 * @param escala     cuánto se amplía esa ventana en el vídeo
 */
export function Escenario({ config, contenido, todos, scroll = 0, ancho = 430, alto = 580, escala = 2 }) {
  const iframe = useRef(null)
  const [doc, setDoc] = useState(null)
  const [espera] = useState(() => delayRender('Preparando la web del reel'))

  const alCargar = async () => {
    const d = iframe.current.contentDocument
    // El CSS del sitio lo inyecta webpack en el documento principal; se copia
    // al del iframe, que es donde vive la web.
    for (const nodo of document.head.querySelectorAll('style, link[rel="stylesheet"]')) {
      d.head.appendChild(nodo.cloneNode(true))
    }
    const propio = d.createElement('style')
    propio.textContent = CSS_REEL
    d.head.appendChild(propio)

    const familias = new Set()
    for (const c of todos.configs) {
      familias.add(c.typography.headingFamily)
      familias.add(c.typography.bodyFamily)
    }
    ensureFonts([...familias], d)
    await Promise.all([...d.head.querySelectorAll('link[data-google-font]')].map(hojaCargada))
    const cargas = []
    for (const stack of familias) {
      const familia = familyOf(stack)
      if (familia) for (const p of PESOS) cargas.push(d.fonts.load(`${p} 32px "${familia}"`))
    }
    const urls = new Set()
    for (const c of todos.contenidos) imagenesDe(c, urls)
    for (const url of urls) {
      const img = new d.defaultView.Image()
      img.src = url
      cargas.push(img.decode().catch(() => {}))
    }

    await Promise.all(cargas)
    setDoc(d)
    continueRender(espera)
  }

  useLayoutEffect(() => {
    if (!doc) return
    const recorrido = doc.documentElement.scrollHeight - doc.defaultView.innerHeight
    doc.defaultView.scrollTo(0, Math.max(0, recorrido) * scroll)
  })

  return (
    <>
      <iframe
        ref={iframe}
        srcDoc={DOC_VACIO}
        onLoad={alCargar}
        title="web"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: ancho,
          height: alto,
          border: 0,
          transform: `scale(${escala})`,
          transformOrigin: 'top left',
        }}
      />
      {doc &&
        createPortal(
          <PreviewCanvas config={config} doc={doc}>
            <DemoPage content={contenido} />
          </PreviewCanvas>,
          doc.body,
        )}
    </>
  )
}
