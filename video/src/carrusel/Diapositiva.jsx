import { AbsoluteFill } from 'remotion'
import { SANS } from '../fuentes'
import { Marca } from '../Logo'
import { ACENTO, ACENTO_CLARO, FONDO, FONDO_ALT, LINEA, TINTA, TINTA_SUAVE, TINTA_TENUE } from '../marca'
import { Ajustar } from './Ajustar'
import { ALTO, ANCHO, MARGEN, TINTE, TIPO, px, tamanoTitular } from './formato'
import {
  Antetitulo,
  CajaIcono,
  Casilla,
  ConAcento,
  Icono,
  Numero,
  Pastilla,
  Tarjeta,
  cuerpo,
  titular,
} from './piezas'

// ============================================================
// UNA DIAPOSITIVA
//
// Recibe una diapositiva ya resuelta (ver `resolver.js`) y la pinta con el
// diseño de su `variante`. Las variantes son genéricas: una plantilla nueva
// reutiliza las que hay y solo añade una si ninguna le sirve.
//
//   portada    fondo tinta con el halo, como el gancho de los reels
//   respuesta  la respuesta corta en grande ("Depende.") y de qué depende
//   punto      un número grande, una idea y "mejor así"
//   caso       si pasa esto → entonces esto
//   item       la lista en casillas (se marcan al avanzar), qué comprobar y qué preguntar
//   lista      varias líneas con casilla o número, para guardar
//   cierre     fondo blanco, la llamada a la acción y la marca, como el
//              cierre del intro
// ============================================================

/** Marca pequeña y contador, arriba de las diapositivas de contenido. */
function Cabecera({ indice, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Marca tamano={34} />
      <span
        style={{
          fontFamily: SANS,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: TINTA_TENUE,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(indice + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

/** La barra de progreso de los reels, en tramos: uno por diapositiva. */
function Progreso({ indice, total, oscuro = false }) {
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

/** Fondo y márgenes comunes. */
function Marco({ fondo, children }) {
  return (
    <AbsoluteFill
      style={{
        width: ANCHO,
        height: ALTO,
        background: fondo,
        padding: `${MARGEN.y}px ${MARGEN.x}px`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: SANS,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </AbsoluteFill>
  )
}

/** Diapositiva de contenido: fondo claro, cabecera, contenido ajustado y progreso. */
function Contenido({ indice, total, alinear = 'center', children }) {
  return (
    <Marco fondo={FONDO_ALT}>
      <Cabecera indice={indice} total={total} />
      <Ajustar nombre={`la diapositiva ${indice + 1}`} alinear={alinear} style={{ margin: '48px 0' }}>
        {children}
      </Ajustar>
      <Progreso indice={indice} total={total} />
    </Marco>
  )
}

const Titulo = ({ texto, base = TIPO.titulo, color = TINTA, acento = ACENTO, style }) =>
  texto ? (
    <h1 style={{ ...titular(tamanoTitular(texto, base), color), ...style }}>
      <ConAcento texto={texto} acento={acento} />
    </h1>
  ) : null

const Parrafo = ({ texto, color = TINTA_SUAVE, tamano, style }) =>
  texto ? (
    <p style={{ ...cuerpo(color, tamano), ...style }}>
      <ConAcento texto={texto} />
    </p>
  ) : null

/** La caja de "mejor así" o "pregúntalo así": un icono, una etiqueta y una frase. */
function Resalte({ resalte, style }) {
  if (!resalte?.texto) return null
  return (
    <Tarjeta style={{ display: 'flex', gap: px(30), alignItems: 'flex-start', ...style }}>
      <CajaIcono nombre={resalte.icono ?? 'idea'} tamano={84} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: px(10), paddingTop: px(4) }}>
        <Antetitulo>{resalte.etiqueta}</Antetitulo>
        <Parrafo texto={resalte.texto} color={TINTA} tamano={38} />
      </div>
    </Tarjeta>
  )
}

// ------------------------------------------------------------
// VARIANTES

function Portada({ d, indice, total }) {
  return (
    <Marco fondo={TINTA}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${ACENTO}38 0%, transparent 58%)` }} />
      <Progreso indice={indice} total={total} oscuro />
      <Ajustar nombre="la portada" alinear="center" style={{ margin: '56px 0', position: 'relative' }}>
        <Antetitulo oscuro style={{ marginBottom: px(36) }}>
          {d.antetitulo}
        </Antetitulo>
        <Titulo texto={d.titulo} base={TIPO.portada} color="#fff" acento={ACENTO_CLARO} />
        <Parrafo
          texto={d.texto}
          color="rgba(255,255,255,0.68)"
          tamano={TIPO.subtitulo}
          style={{ marginTop: px(40), maxWidth: 820 }}
        />
      </Ajustar>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Marca tamano={40} tema="oscuro" />
        {total > 1 ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            Desliza
            <Icono nombre="flecha" tamano={34} color={ACENTO_CLARO} />
          </span>
        ) : null}
      </div>
    </Marco>
  )
}

function Respuesta({ d, indice, total }) {
  return (
    <Contenido indice={indice} total={total}>
      <Antetitulo style={{ marginBottom: px(28) }}>{d.antetitulo}</Antetitulo>
      <Titulo texto={d.titulo} base={150} style={{ letterSpacing: '-0.05em' }} />
      <Parrafo texto={d.texto} tamano={TIPO.subtitulo} style={{ marginTop: px(34) }} />
      {d.lista?.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: px(18), marginTop: px(52) }}>
          {d.lista.map((l, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: px(24),
                padding: `${px(24)} ${px(32)}`,
                background: FONDO,
                border: `2px solid ${LINEA}`,
                borderRadius: px(28),
              }}
            >
              {l.icono ? <CajaIcono nombre={l.icono} tamano={68} /> : <Numero tamano={40}>{String(i + 1).padStart(2, '0')}</Numero>}
              <Parrafo texto={l.texto} color={TINTA} tamano={38} />
            </div>
          ))}
        </div>
      ) : null}
    </Contenido>
  )
}

function Punto({ d, indice, total }) {
  return (
    <Contenido indice={indice} total={total} alinear="start">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: px(36) }}>
        <Numero tamano={TIPO.numero}>{d.numero}</Numero>
        {d.icono ? <CajaIcono nombre={d.icono} tamano={112} /> : null}
      </div>
      <Antetitulo style={{ marginBottom: px(18) }}>{d.antetitulo}</Antetitulo>
      <Titulo texto={d.titulo} />
      <Parrafo texto={d.texto} style={{ marginTop: px(28) }} />
      <Resalte resalte={d.resalte} style={{ marginTop: 'auto' }} />
    </Contenido>
  )
}

function Caso({ d, indice, total }) {
  return (
    <Contenido indice={indice} total={total}>
      <Antetitulo style={{ marginBottom: px(30) }}>{d.antetitulo}</Antetitulo>
      <Tarjeta style={{ display: 'flex', flexDirection: 'column', gap: px(16) }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: px(22) }}>
          {d.icono ? <CajaIcono nombre={d.icono} tamano={72} /> : null}
          <span style={{ ...cuerpo(TINTA_TENUE, 34), fontWeight: 600 }}>Si…</span>
        </div>
        <Titulo texto={d.titulo} base={64} />
      </Tarjeta>
      <div style={{ display: 'flex', justifyContent: 'center', margin: `${px(-10)} 0` }}>
        <div
          style={{
            width: px(84),
            height: px(84),
            borderRadius: 999,
            background: TINTE,
            border: `${px(8)} solid ${FONDO_ALT}`,
            display: 'grid',
            placeItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Icono nombre="abajo" tamano={38} color={ACENTO} />
        </div>
      </div>
      <Tarjeta fondo={ACENTO} style={{ border: 'none', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: px(14) }}>
        <span style={{ ...cuerpo('rgba(255,255,255,0.72)', 34), fontWeight: 600 }}>Entonces</span>
        <Parrafo texto={d.consecuencia} color="#fff" tamano={46} style={{ fontWeight: 600, letterSpacing: '-0.025em' }} />
      </Tarjeta>
      <Parrafo texto={d.texto} tamano={36} style={{ marginTop: px(34) }} />
    </Contenido>
  )
}

function Item({ d, indice, total }) {
  const { actual, cuantos } = d.progreso
  return (
    <Contenido indice={indice} total={total} alinear="start">
      {/* La lista entera en casillas: se van marcando al pasar diapositivas. */}
      <div style={{ display: 'flex', gap: px(14), flexWrap: 'wrap' }}>
        {Array.from({ length: cuantos }, (_, i) => (
          <Casilla key={i} tamano={60} estado={i <= actual ? 'marcada' : 'pendiente'} />
        ))}
      </div>
      {d.icono ? (
        <div style={{ marginTop: px(64) }}>
          <CajaIcono nombre={d.icono} tamano={136} />
        </div>
      ) : null}
      <Antetitulo style={{ marginTop: px(48), marginBottom: px(18) }}>{d.antetitulo}</Antetitulo>
      <Titulo texto={d.titulo} base={84} />
      <Parrafo texto={d.texto} style={{ marginTop: px(28) }} />
      <Resalte resalte={d.resalte} style={{ marginTop: 'auto' }} />
    </Contenido>
  )
}

function Lista({ d, indice, total }) {
  return (
    <Contenido indice={indice} total={total}>
      <Antetitulo style={{ marginBottom: px(22) }}>{d.antetitulo}</Antetitulo>
      <Titulo texto={d.titulo} base={68} />
      <Tarjeta style={{ marginTop: px(40), padding: `${px(12)} ${px(44)}` }}>
        {d.lista.map((l, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: px(28),
              padding: `${px(24)} 0`,
              borderTop: i ? `2px solid ${LINEA}` : 'none',
            }}
          >
            {d.marcador === 'numero' ? (
              <Numero tamano={40}>{String(i + 1).padStart(2, '0')}</Numero>
            ) : (
              <Casilla tamano={48} estado={l.estado ?? 'pendiente'} />
            )}
            <Parrafo texto={l.texto} color={TINTA} tamano={38} />
          </div>
        ))}
      </Tarjeta>
      <Parrafo texto={d.texto} tamano={34} style={{ marginTop: px(30) }} />
    </Contenido>
  )
}

function Cierre({ d, indice, total }) {
  return (
    <Marco fondo={FONDO}>
      <Progreso indice={indice} total={total} />
      <Ajustar nombre="el cierre" alinear="center" style={{ margin: '48px 0' }}>
        <Antetitulo style={{ marginBottom: px(28) }}>{d.antetitulo}</Antetitulo>
        <Titulo texto={d.titulo} base={88} />
        <Parrafo texto={d.texto} tamano={TIPO.subtitulo} style={{ marginTop: px(32) }} />
        {d.cta ? (
          <div style={{ marginTop: px(56), display: 'flex' }}>
            <Pastilla icono={d.ctaIcono ?? 'guardar'}>{d.cta}</Pastilla>
          </div>
        ) : null}
      </Ajustar>
      <div style={{ borderTop: `2px solid ${LINEA}`, paddingTop: 48, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Marca tamano={56} />
        <span style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em', color: TINTA_SUAVE }}>
          Diséñala tú.{' '}
          <span style={{ position: 'relative', color: TINTA }}>
            Yo la construyo.
            {/* El subrayado del cierre de los reels. */}
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 6, borderRadius: 3, background: ACENTO }} />
          </span>
        </span>
      </div>
    </Marco>
  )
}

const VARIANTES = { portada: Portada, respuesta: Respuesta, punto: Punto, caso: Caso, item: Item, lista: Lista, cierre: Cierre }

export const VARIANTES_DISPONIBLES = Object.keys(VARIANTES)

export function Diapositiva({ d, indice, total }) {
  const Variante = VARIANTES[d.variante]
  if (!Variante) throw new Error(`Variante de diapositiva desconocida: "${d.variante}"`)
  return <Variante d={d} indice={indice} total={total} />
}
