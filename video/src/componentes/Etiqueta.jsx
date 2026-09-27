import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { MONO, SANS } from '../diseno/fuentes'
import { ACENTO, FONDO, LINEA, MUELLE, TINTA, TINTA_TENUE } from '../diseno/marca'

// La pastilla del intro: flota sobre la web y dice qué se está cambiando
// ("Color principal · #1D4ED8"). La usan el intro, el motor de reels y la
// portada de los reels: es la firma de todos.

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

/** La pastilla en sí, quieta: fondo blanco, borde fino, sombra suave. */
export function CajaPastilla({ children }) {
  return (
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
  )
}

/** Etiqueta flotante sobre la web: dice qué se está cambiando. */
export const Etiqueta = ({ desde, hasta, arriba = 290, children }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const e = spring({ frame: frame - desde, fps, config: MUELLE.vivo })
  const s = hasta == null ? 0 : spring({ frame: frame - (hasta - 8), fps, config: MUELLE.suave, durationInFrames: 8 })
  if (frame < desde || s > 0.999) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: arriba,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: interpolate(e, [0, 0.5], [0, 1], clamp) * (1 - s),
        transform: `translateY(${(1 - e) * 34 - s * 24}px) scale(${interpolate(e, [0, 1], [0.9, 1])})`,
      }}
    >
      <CajaPastilla>{children}</CajaPastilla>
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

/**
 * El icono de la pastilla, el mismo para cada tipo de cambio en todos los
 * reels (como en el intro): las muestras de color si las hay; si no, la
 * rejilla (estilo, preset, portada) o la letra (tipografía, titular).
 */
export function IconoPastilla({ tipo, muestras }) {
  if (muestras.length) return <Muestras colores={muestras} />
  const letra = { tipografia: 'Aa', titular: 'Tt', recorrido: '↕' }[tipo]
  if (letra) return <span style={{ width: 44, textAlign: 'center', fontSize: 34, fontWeight: 700, color: ACENTO }}>{letra}</span>
  return (
    <div style={{ width: 44, height: 44, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, padding: 4, boxSizing: 'border-box' }}>
      {[0, 1, 2, 3].map((k) => (
        <div key={k} style={{ borderRadius: 4, background: k === 0 ? ACENTO : '#cfcfca' }} />
      ))}
    </div>
  )
}

export function Muestras({ colores }) {
  return (
    <div style={{ display: 'flex' }}>
      {colores.slice(0, 3).map((c, i) => (
        <div
          key={i}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: c,
            border: '3px solid #fff',
            marginLeft: i ? -12 : 0,
            boxShadow: `0 0 0 1px ${LINEA}`,
          }}
        />
      ))}
    </div>
  )
}
