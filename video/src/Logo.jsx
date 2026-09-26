import { interpolate } from 'remotion'
import { SANS } from './fuentes'
import { ACENTO, ACENTO_CLARO, TINTA } from './marca'

/**
 * El dibujo del favicon: una lámina de maqueta con un bloque "por colocar".
 * `colocado` (0 → 1) lo baja a su sitio: la marca termina de montarse en pantalla.
 */
export const Logo = ({ tamano, colocado = 1 }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 32 32">
    <rect width="32" height="32" rx="7" fill={ACENTO} />
    <rect x="7" y="6.5" width="18" height="19" rx="2.5" fill="none" stroke="#fff" strokeWidth="2" />
    <rect x="10" y="9.5" width="12" height="4" rx="1" fill="#fff" />
    <rect x="10" y="16" width="5.5" height="6.5" rx="1" fill="#fff" />
    <rect
      x="17.5"
      y="16"
      width="4.5"
      height="6.5"
      rx="1"
      fill="#fff"
      opacity={interpolate(colocado, [0, 1], [0.5, 1], { extrapolateRight: 'clamp' })}
      transform={`translate(0 ${(1 - colocado) * -8})`}
    />
  </svg>
)

/** Logo + "maketa.es". `tema` decide sobre qué fondo va. */
export const Marca = ({ tamano, tema = 'claro', colocado = 1 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: tamano * 0.26 }}>
    <Logo tamano={tamano * 1.02} colocado={colocado} />
    <span
      style={{
        fontFamily: SANS,
        fontSize: tamano,
        fontWeight: 800,
        letterSpacing: '-0.045em',
        lineHeight: 1,
        color: tema === 'claro' ? TINTA : '#fff',
      }}
    >
      maketa
      <span style={{ color: tema === 'claro' ? ACENTO : ACENTO_CLARO }}>.es</span>
    </span>
  </div>
)
