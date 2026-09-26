import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { SANS } from '../fuentes'
import { MUELLE } from '../marca'

// ============================================================
// TEXTO QUE ENTRA PALABRA A PALABRA — el mismo gesto que el intro
//
// Cada palabra sube y se enfoca, escalonada. Lo que va *entre asteriscos*
// sale en el color de acento. Si hay `hasta`, el bloque entero se va hacia
// arriba en los últimos fotogramas.
// ============================================================

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

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
        opacity: 1 - salida,
        transform: `translateY(${-60 * salida}px)`,
      }}
    >
      {partir(texto).map(({ p, acento: esAcento }, i) => {
        const e = spring({ frame: frame - desde - 4 - i * 3, fps, config: MUELLE.vivo })
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: esAcento ? acento : undefined,
              opacity: interpolate(e, [0, 0.6], [0, 1], clamp),
              transform: `translateY(${(1 - e) * tamano * 0.65}px)`,
              filter: `blur(${Math.max(0, 1 - e) * 10}px)`,
            }}
          >
            {p}
          </span>
        )
      })}
    </div>
  )
}
