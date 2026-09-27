import { SANS } from '../diseno/fuentes'
import { Marca } from './Logo'

// ============================================================
// EL MARCO de las piezas fijas (diapositivas y portadas): la cabecera con la
// marca y la barra de progreso en tramos. Colores del tema.
// ============================================================

/** La marca a la izquierda y, a la derecha, el contador ("03 / 08") o la serie. */
export function Cabecera({ tema, derecha }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Marca tamano={34} tema={tema.oscuro ? 'oscuro' : 'claro'} />
      {derecha ? (
        <span
          style={{
            fontFamily: SANS,
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: tema.tenue,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {derecha}
        </span>
      ) : null}
    </div>
  )
}

export const contador = (indice, total) => `${String(indice + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

/** La barra de progreso de los reels, en tramos: uno por diapositiva. */
export function Progreso({ indice, total, tema }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{ flex: 1, height: 6, borderRadius: 3, background: i <= indice ? tema.acento : tema.linea }}
        />
      ))}
    </div>
  )
}
