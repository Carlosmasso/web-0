import { spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { revelarPalabra, salir } from '../animaciones'
import { SANS } from '../fuentes'
import { MUELLE } from '../marca'

// ============================================================
// TEXTO QUE ENTRA PALABRA A PALABRA — el mismo gesto que el intro
//
// Cada palabra sube y se enfoca, escalonada. Lo que va *entre asteriscos*
// sale en el color de acento. Si hay `hasta`, el bloque entero se va hacia
// arriba en los últimos fotogramas.
// ============================================================

/** "La web de *tu taller*, en seis estilos." → palabras con su marca de acento. */
export function partir(texto) {
  const palabras = []
  for (const trozo of texto.split(/(\*[^*]+\*)/).filter(Boolean)) {
    const acento = trozo.startsWith('*')
    for (const p of trozo.replace(/\*/g, '').split(/\s+/).filter(Boolean)) {
      // La puntuación que sigue a un resaltado ("*tu taller*,") va pegada a él.
      if (/^[.,;:!?…]+$/.test(p) && palabras.length) palabras.at(-1).p += p
      else palabras.push({ p, acento })
    }
  }
  return palabras
}

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
        fontFamily: SANS,
        fontSize: tamano,
        fontWeight: 700,
        letterSpacing: '-0.04em',
        lineHeight: 1.08,
        color,
        ...salir(salida),
      }}
    >
      {partir(texto).map(({ p, acento: esAcento }, i) => {
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
