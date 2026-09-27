import { spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { revelarPalabra, salir } from '../diseno/animaciones'
import { MUELLE } from '../diseno/marca'
import { palabras, titular } from '../diseno/texto'

// ============================================================
// TEXTO QUE ENTRA PALABRA A PALABRA — el mismo gesto que el intro
//
// Cada palabra sube y se enfoca, escalonada. Lo que va *entre asteriscos*
// sale en el color de acento. Si hay `hasta`, el bloque entero se va hacia
// arriba en los últimos fotogramas.
// ============================================================

export function Palabras({ texto, desde = 0, hasta = null, color, acento, tamano, ancho, alinear = 'flex-start' }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const salida = hasta == null ? 0 : spring({ frame: frame - (hasta - 10), fps, config: MUELLE.suave, durationInFrames: 10 })
  if (frame < desde || salida > 0.999) return null

  return (
    <div
      style={{
        width: ancho,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: alinear,
        columnGap: tamano * 0.26,
        ...titular(tamano, color),
        lineHeight: 1.08,
        ...salir(salida),
      }}
    >
      {palabras(texto).map(({ p, acento: esAcento }, i) => {
        const e = spring({ frame: frame - desde - 4 - i * 3, fps, config: MUELLE.vivo })
        return (
          <span
            key={i}
            style={{ ...revelarPalabra(e, tamano), color: esAcento ? acento : undefined }}
          >
            {p}
          </span>
        )
      })}
    </div>
  )
}
