import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { MONO, SANS } from '../fuentes'
import { FONDO, LINEA, MUELLE, TINTA, TINTA_TENUE } from '../marca'

// La pastilla del intro: flota sobre la web y dice qué se está cambiando
// ("Color principal · #1D4ED8"). La usan el intro y el motor de reels.

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

/** Etiqueta flotante sobre la web: dice qué se está cambiando. */
export const Etiqueta = ({ desde, hasta, children }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const e = spring({ frame: frame - desde, fps, config: MUELLE.vivo })
  const s = hasta == null ? 0 : spring({ frame: frame - (hasta - 8), fps, config: MUELLE.suave, durationInFrames: 8 })
  if (frame < desde || s > 0.999) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 290,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: interpolate(e, [0, 0.5], [0, 1], clamp) * (1 - s),
        transform: `translateY(${(1 - e) * 34 - s * 24}px) scale(${interpolate(e, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '16px 30px 16px 18px',
          background: FONDO,
          border: `2px solid ${LINEA}`,
          borderRadius: 999,
          boxShadow: '0 14px 34px -14px rgba(22,23,27,0.28)',
          fontFamily: SANS,
          fontSize: 38,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: TINTA,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** El valor que acompaña a la etiqueta; da un golpe cada vez que cambia. */
export const Valor = ({ desde, children }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = spring({ frame: frame - desde, fps, config: MUELLE.pop })
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: MONO,
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: 0,
        color: TINTA_TENUE,
        transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`,
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
      }}
    >
      {children}
    </span>
  )
}
