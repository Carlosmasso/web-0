import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Diapositiva } from './Diapositiva'
import { ALTO, ANCHO } from './formato'
import { resolverCarrusel } from './plantillas'

// ============================================================
// LAS COMPOSICIONES DE LOS CARRUSELES
//
// Remotion también sirve para imágenes fijas: el carrusel es una composición
// con UN FOTOGRAMA POR DIAPOSITIVA (a 1 fps, en el editor se pasa una por
// segundo), y `carrusel.mjs` captura cada fotograma como PNG. Así los
// carruseles comparten con los reels las fuentes, los colores, el logo y el
// empaquetado, y una diapositiva es un componente que un reel podría animar.
// ============================================================

// El contenido llega entero en `carrusel`, nunca repartido por las props:
// Remotion mezcla las props de entrada con las de por defecto de la
// composición, y un campo opcional que faltase en un JSON (el cierre, el
// resumen) se heredaría del carrusel de ejemplo.
export const calcularCarrusel = ({ props }) => {
  const diapositivas = resolverCarrusel(props.carrusel)
  return { durationInFrames: diapositivas.length, props: { ...props, diapositivas } }
}

export function Carrusel({ diapositivas }) {
  const frame = useCurrentFrame()
  if (!diapositivas) return null
  const d = diapositivas[frame]
  // La clave remonta la diapositiva al cambiar de fotograma o de datos, y
  // con ella se vuelve a medir si el texto cabe.
  return <Diapositiva key={`${frame}-${JSON.stringify(d)}`} d={d} indice={frame} total={diapositivas.length} />
}

// ------------------------------------------------------------
// HOJA DE CONTACTOS: todas las diapositivas en una imagen, para revisar el
// carrusel de un vistazo (ritmo, repeticiones, qué diapositiva sobra).

const HOJA = { escala: 0.3, hueco: 28, borde: 56, columnas: 5 }

const medidasHoja = (n) => {
  const columnas = Math.min(n, HOJA.columnas)
  const filas = Math.ceil(n / columnas)
  const w = ANCHO * HOJA.escala
  const h = ALTO * HOJA.escala
  return {
    columnas,
    width: Math.round(HOJA.borde * 2 + columnas * w + (columnas - 1) * HOJA.hueco),
    height: Math.round(HOJA.borde * 2 + filas * h + (filas - 1) * HOJA.hueco),
  }
}

export const calcularHoja = ({ props }) => {
  const diapositivas = resolverCarrusel(props.carrusel)
  const { width, height } = medidasHoja(diapositivas.length)
  return { durationInFrames: 1, width, height, props: { ...props, diapositivas } }
}

export function HojaContactos({ diapositivas }) {
  if (!diapositivas) return null
  const { columnas } = medidasHoja(diapositivas.length)
  return (
    <AbsoluteFill
      style={{
        background: '#e4e4df',
        padding: HOJA.borde,
        display: 'grid',
        gridTemplateColumns: `repeat(${columnas}, ${ANCHO * HOJA.escala}px)`,
        gap: HOJA.hueco,
        alignContent: 'start',
      }}
    >
      {diapositivas.map((d, i) => (
        <div
          key={i}
          style={{
            width: ANCHO * HOJA.escala,
            height: ALTO * HOJA.escala,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 14,
            boxShadow: '0 10px 30px -18px rgba(22,23,27,0.5)',
          }}
        >
          <div style={{ position: 'relative', width: ANCHO, height: ALTO, transform: `scale(${HOJA.escala})`, transformOrigin: 'top left' }}>
            <Diapositiva d={d} indice={i} total={diapositivas.length} />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  )
}
