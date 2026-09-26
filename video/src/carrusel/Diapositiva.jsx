import { AbsoluteFill } from 'remotion'
import { SANS } from '../fuentes'
import { Marca } from '../Logo'
import { ACENTO, ACENTO_CLARO, FONDO, FONDO_ALT, LINEA, TINTA, TINTA_SUAVE, TINTA_TENUE } from '../marca'
import { Cabe } from './Cabe'
import { ALTO, ANCHO, MARGEN, RETICULA, TIPO } from './formato'
import { Antetitulo, CajaIcono, Casilla, ConAcento, Icono, Numero, Pastilla, Tarjeta, cuerpo, titular } from './piezas'

// ============================================================
// UNA DIAPOSITIVA — todas con el mismo esqueleto
//
//   cabecera   la marca a la izquierda y el contador a la derecha
//   icono      el cuadrado de 120 px, arriba a la izquierda
//   etiqueta   el antetítulo en mayúsculas ("Error 02", "Caso 1 de 3")
//   titular    72 px (96 en la portada)
//   texto      40 px
//   abajo      pegado al pie: la tarjeta de la variante (resalte, lista…)
//   progreso   un tramo por diapositiva
//
// Las variantes NO cambian tamaños ni posiciones: solo dicen qué va en cada
// hueco y en qué fondo. Así el titular está a la misma altura y mide lo
// mismo en todas las diapositivas de todos los carruseles.
//
//   portada    fondo tinta con el halo, como el gancho de los reels
//   respuesta  la respuesta corta y, abajo, de qué depende
//   punto      un error y, abajo, "mejor así"
//   caso       si pasa esto… y, abajo, "entonces"
//   item       una comprobación y, abajo, la pregunta que hay que hacer
//   lista      varias líneas con casilla o número, para guardar
//   cierre     fondo blanco, la llamada a la acción y la marca, como el
//              cierre del intro
// ============================================================

const FONDOS = {
  tinta: { fondo: TINTA, oscuro: true },
  claro: { fondo: FONDO_ALT, oscuro: false },
  blanco: { fondo: FONDO, oscuro: false },
}

function Cabecera({ indice, total, oscuro }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Marca tamano={34} tema={oscuro ? 'oscuro' : 'claro'} />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: oscuro ? 'rgba(255,255,255,0.5)' : TINTA_TENUE,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(indice + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

/** La barra de progreso de los reels, en tramos: uno por diapositiva. */
function Progreso({ indice, total, oscuro }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background:
              i <= indice ? (oscuro ? ACENTO_CLARO : ACENTO) : oscuro ? 'rgba(255,255,255,0.14)' : 'rgba(128,128,128,0.18)',
          }}
        />
      ))}
    </div>
  )
}

/**
 * El esqueleto. `abajo` se pega al pie de la zona de contenido; lo demás
 * empieza siempre en el mismo sitio.
 */
function Esqueleto({ d, indice, total, fondo, marcada = false, tamanoTitular = TIPO.titular, extra, abajo }) {
  const { fondo: color, oscuro } = FONDOS[fondo]
  const acento = oscuro ? ACENTO_CLARO : ACENTO
  return (
    <AbsoluteFill
      style={{
        width: ANCHO,
        height: ALTO,
        background: color,
        padding: `${MARGEN.y}px ${MARGEN.x}px`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: SANS,
        boxSizing: 'border-box',
      }}
    >
      {oscuro ? (
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${ACENTO}38 0%, transparent 58%)` }} />
      ) : null}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Cabecera indice={indice} total={total} oscuro={oscuro} />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', margin: `${RETICULA.cabecera}px 0` }}>
          <Cabe nombre={`la diapositiva ${indice + 1}`}>
            <CajaIcono nombre={d.icono} oscuro={oscuro} marcada={marcada} />
            <Antetitulo oscuro={oscuro} style={{ marginTop: RETICULA.trasIcono }}>
              {d.antetitulo}
            </Antetitulo>
            <h1 style={{ ...titular(tamanoTitular, oscuro ? '#fff' : TINTA), marginTop: RETICULA.trasEtiqueta }}>
              <ConAcento texto={d.titulo} acento={acento} />
            </h1>
            {d.texto ? (
              <p style={{ ...cuerpo(oscuro ? 'rgba(255,255,255,0.68)' : TINTA_SUAVE), marginTop: RETICULA.trasTitular }}>
                <ConAcento texto={d.texto} acento={acento} />
              </p>
            ) : null}
            {extra}
            {abajo ? <div style={{ marginTop: 'auto', paddingTop: RETICULA.bloque }}>{abajo}</div> : null}
          </Cabe>
        </div>
        <Progreso indice={indice} total={total} oscuro={oscuro} />
      </div>
    </AbsoluteFill>
  )
}

// ------------------------------------------------------------
// BLOQUES DE ABAJO — todos en la misma tarjeta y con el mismo tamaño de letra

const detalle = (color = TINTA) => cuerpo(color, TIPO.detalle)

/** Un icono, una etiqueta y una frase (y una nota opcional): "mejor así", "pregunta", "entonces". */
function Resalte({ resalte }) {
  return (
    <Tarjeta style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
      <CajaIcono nombre={resalte.icono} tamano={80} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
        <Antetitulo>{resalte.etiqueta}</Antetitulo>
        <p style={{ ...detalle(), fontWeight: 600 }}>
          <ConAcento texto={resalte.texto} />
        </p>
        {resalte.nota ? (
          <p style={{ ...detalle(TINTA_SUAVE), marginTop: 6 }}>
            <ConAcento texto={resalte.nota} />
          </p>
        ) : null}
      </div>
    </Tarjeta>
  )
}

/** Varias líneas separadas por un filete, con icono, número o casilla delante. */
function Filas({ lista, marcador }) {
  return (
    <Tarjeta style={{ padding: '8px 48px' }}>
      {lista.map((l, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '18px 0', borderTop: i ? `2px solid ${LINEA}` : 'none' }}
        >
          {marcador === 'casilla' ? (
            <Casilla estado={l.estado} />
          ) : marcador === 'icono' && l.icono ? (
            <Icono nombre={l.icono} tamano={44} color={ACENTO} />
          ) : (
            <Numero>{String(i + 1).padStart(2, '0')}</Numero>
          )}
          <p style={detalle()}>
            <ConAcento texto={l.texto} />
          </p>
        </div>
      ))}
    </Tarjeta>
  )
}

const Desliza = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 14,
      fontSize: TIPO.etiqueta + 4,
      fontWeight: 600,
      color: 'rgba(255,255,255,0.72)',
    }}
  >
    Desliza
    <Icono nombre="flecha" tamano={34} color={ACENTO_CLARO} />
  </div>
)

const FirmaMarca = () => (
  <div style={{ borderTop: `2px solid ${LINEA}`, padding: '40px 0 12px', display: 'flex', flexDirection: 'column', gap: 24 }}>
    <Marca tamano={56} />
    <span style={{ fontSize: TIPO.detalle, fontWeight: 600, letterSpacing: '-0.025em', color: TINTA_SUAVE }}>
      Diséñala tú.{' '}
      <span style={{ position: 'relative', color: TINTA }}>
        Yo la construyo.
        {/* El subrayado del cierre de los reels. */}
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 6, borderRadius: 3, background: ACENTO }} />
      </span>
    </span>
  </div>
)

// ------------------------------------------------------------
// VARIANTES — solo rellenan los huecos

const resalteDe = (d) => (d.resalte ? <Resalte resalte={d.resalte} /> : null)

const VARIANTES = {
  portada: (p) => <Esqueleto {...p} fondo="tinta" tamanoTitular={TIPO.portada} abajo={p.total > 1 ? <Desliza /> : null} />,
  respuesta: (p) => (
    <Esqueleto {...p} fondo="claro" abajo={p.d.lista?.length ? <Filas lista={p.d.lista} marcador="icono" /> : null} />
  ),
  punto: (p) => <Esqueleto {...p} fondo="claro" abajo={resalteDe(p.d)} />,
  caso: (p) => <Esqueleto {...p} fondo="claro" abajo={resalteDe(p.d)} />,
  item: (p) => <Esqueleto {...p} fondo="claro" marcada abajo={resalteDe(p.d)} />,
  lista: (p) => <Esqueleto {...p} fondo="claro" abajo={<Filas lista={p.d.lista} marcador={p.d.marcador} />} />,
  cierre: (p) => (
    <Esqueleto
      {...p}
      fondo="blanco"
      extra={
        p.d.cta ? (
          <div style={{ marginTop: RETICULA.bloque, display: 'flex' }}>
            <Pastilla icono={p.d.icono}>{p.d.cta}</Pastilla>
          </div>
        ) : null
      }
      abajo={<FirmaMarca />}
    />
  ),
}

export const VARIANTES_DISPONIBLES = Object.keys(VARIANTES)

export function Diapositiva({ d, indice, total }) {
  const Variante = VARIANTES[d.variante]
  if (!Variante) throw new Error(`Variante de diapositiva desconocida: "${d.variante}"`)
  return <Variante d={d} indice={indice} total={total} />
}
