import { AbsoluteFill } from 'remotion'
import { antetitulo, cuerpo, titular } from '../diseno/texto'
import { CELDA } from '../diseno/formatos'
import { FONDO_ALT, TINTA, TINTA_SUAVE, ACENTO } from '../diseno/marca'
import { PortadaPieza, tamanoPortada } from '../portadas/PortadaPieza'

// ============================================================
// EL BORRADOR DEL FEED — el perfil de Instagram antes de publicar
//
// Las ideas que le pases (`pnpm crear feed IR-03 IC-07 …`, en el orden en que
// las publicarás) tal como las verá quien entre en el perfil: lo más reciente
// arriba a la izquierda, cada portada recortada a 3:4 como hace Instagram, y
// debajo su id, formato, serie, tema y layout.
//
// Sirve para mirar el conjunto antes de subir: si una fila se ve igual, si
// hay demasiado oscuro seguido, si la serie se reconoce. Son las mismas
// portadas que se publican (portadas/PortadaPieza.jsx), no una maqueta.
// ============================================================

export const REJILLA = { columnas: 3, celda: 340, hueco: 14, margen: 64, leyenda: 84, cabecera: 150 }
const ALTO_CELDA = Math.round((REJILLA.celda * CELDA.alto) / CELDA.ancho)

export const medidasFeed = (n) => {
  const filas = Math.max(1, Math.ceil(n / REJILLA.columnas))
  return {
    width: REJILLA.margen * 2 + REJILLA.columnas * REJILLA.celda + (REJILLA.columnas - 1) * REJILLA.hueco,
    height: REJILLA.margen * 2 + REJILLA.cabecera + filas * (ALTO_CELDA + REJILLA.leyenda) + (filas - 1) * REJILLA.hueco,
  }
}

/** Una portada recortada a 3:4 y escalada a la celda, como en el perfil. */
function Celda({ celda }) {
  const { ancho, alto } = tamanoPortada(celda.formato)
  // Cubre la celda (como object-fit: cover) y se centra.
  const escala = Math.max(REJILLA.celda / ancho, ALTO_CELDA / alto)
  return (
    <div style={{ width: REJILLA.celda, height: ALTO_CELDA, position: 'relative', overflow: 'hidden', background: '#ddd' }}>
      <div
        style={{
          position: 'absolute',
          width: ancho,
          height: alto,
          left: (REJILLA.celda - ancho * escala) / 2,
          top: (ALTO_CELDA - alto * escala) / 2,
          transform: `scale(${escala})`,
          transformOrigin: 'top left',
        }}
      >
        <PortadaPieza {...celda.portada} />
      </div>
    </div>
  )
}

function Leyenda({ celda }) {
  const v = celda.portada.visual
  return (
    <div style={{ height: REJILLA.leyenda, padding: '12px 2px 0', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ ...cuerpo(TINTA, 17), fontWeight: 700 }}>{celda.id}</span>
        <span style={antetitulo(12, ACENTO)}>{celda.orden}ª en publicarse</span>
      </div>
      <div style={{ ...cuerpo(TINTA_SUAVE, 15), marginTop: 4 }}>
        {celda.formato === 'reel' ? 'Reel' : 'Carrusel'} · {celda.portada.serie?.nombre ?? celda.portada.pilar ?? 'sin serie'} · {v.tema} · {v.layout}{v.portada && v.portada !== 'pila' ? ` · ${v.portada}` : ''}
      </div>
    </div>
  )
}

/**
 * @param celdas  las publicaciones, de la más reciente a la más antigua:
 *                { id, orden, formato, portada }
 */
export function Feed({ celdas = [], titulo = 'Borrador del feed' }) {
  return (
    <AbsoluteFill style={{ background: FONDO_ALT, padding: REJILLA.margen, boxSizing: 'border-box' }}>
      <div style={{ height: REJILLA.cabecera }}>
        <div style={antetitulo(18, ACENTO)}>Maketa · Instagram</div>
        <h1 style={{ ...titular(52, TINTA), marginTop: 12 }}>{titulo}</h1>
        <div style={{ ...cuerpo(TINTA_SUAVE, 18), marginTop: 10 }}>
          {celdas.length} publicaciones · lo más reciente arriba a la izquierda, como en el perfil
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${REJILLA.columnas}, ${REJILLA.celda}px)`,
          columnGap: REJILLA.hueco,
          rowGap: REJILLA.hueco,
        }}
      >
        {celdas.map((c) => (
          <div key={c.id}>
            <Celda celda={c} />
            <Leyenda celda={c} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
