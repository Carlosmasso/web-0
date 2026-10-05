import { AbsoluteFill, Img } from 'remotion'
import { Escenario } from '../componentes/Escenario'
import { CajaPastilla, IconoPastilla } from '../componentes/Etiqueta'
import { Marca } from '../componentes/Logo'
import { ConAcento, Icono } from '../componentes/piezas'
import { MARGEN, REEL, TIPO_REEL } from '../diseno/formatos'
import { MONO, SANS } from '../diseno/fuentes'
import { ACENTO, ACENTO_CLARO, FONDO, LINEA, TINTA, TINTA_TENUE } from '../diseno/marca'
import { fondoDe } from '../diseno/temas'
import { antetitulo, cuerpo, titular } from '../diseno/texto'

// ============================================================
// LAS PORTADAS DE LOS REELS — un sistema cerrado de cuatro variantes
//
// Todas comparten el marco (la marca y la serie arriba, el gancho y el tema)
// y cambian el cuerpo, cada una con un trabajo distinto en el feed:
//
//   pila     la web y, asomando detrás, sus versiones siguientes. La firma:
//            reconocimiento de marca. Es la de por defecto.
//   duelo    la primera versión frente a la última. Contraste y curiosidad:
//            el antes y el después se entiende sin reproducir el vídeo.
//   rejilla  cuatro versiones numeradas y "¿Cuál eliges?". Pide comentarios
//            (se contesta con un número), lo que más empuja un reel.
//   numero   el número enorme ("5 colores") sobre la pila. Se escanea de un
//            vistazo y rima con las portadas de carrusel del layout C.
//   foto     (historias) la foto real del negocio a sangre y su web delante,
//            en un móvil. Rompe la fila de fondos lisos del perfil.
//   titular  (historias que se escriben) el campo "Titular" con la frase ya
//            escrita y el cursor, sobre la web.
//
// Se elige con "visual": { "portada": "…" } en la idea. Todo cae entre y=300
// e y=1640, dentro de la franja 3:4 que enseña el perfil.
// ============================================================

export const PORTADAS_REEL = ['pila', 'duelo', 'rejilla', 'numero', 'foto', 'titular']

const Z = {
  arriba: 300,
  abajo: REEL.alto - 1640,
  trasCabecera: 64,
  trasGancho: 72,
  // La ventana de la web mide 400 px CSS de ancho (un teléfono) y más alto
  // que cualquier tarjeta: la tarjeta recorta lo que sobre.
  anchoWeb: 400,
  altoWeb: 1000,
}

// "5 colores": cómo se cuentan las versiones de cada tipo de reel.
const PLURAL = { color: 'colores', estilo: 'estilos', preset: 'presets', tipografia: 'tipografías', portada: 'portadas', titular: 'tipografías' }
const plural = (r) => (r.nombreEje.includes('+') ? 'combinaciones' : PLURAL[r.tipo] ?? 'versiones')

// ------------------------------------------------------------
// PIEZAS

/** La web real, fija, en una tarjeta. `style` la coloca; `ancho` la dimensiona. */
function Web({ config, resuelto, scroll = 0, ancho, radio = 40, style }) {
  const escala = ancho / Z.anchoWeb
  const todos = { configs: [config], contenidos: [resuelto.contenido] }
  return (
    <div
      style={{
        position: 'absolute',
        width: ancho,
        overflow: 'hidden',
        background: FONDO,
        borderRadius: radio,
        border: `2px solid ${LINEA}`,
        ...style,
      }}
    >
      <Escenario
        config={config}
        contenido={resuelto.contenido}
        todos={todos}
        scroll={scroll}
        ancho={Z.anchoWeb}
        alto={Z.altoWeb / escala}
        escala={escala}
      />
    </div>
  )
}

/** Las N versiones del reel; si hay menos (el recorrido), la misma web más abajo. */
const versiones = (pasos, n) =>
  Array.from({ length: n }, (_, i) =>
    pasos[i] ? { config: pasos[i].config, titulo: pasos[i].titulo, scroll: 0 } : { config: pasos[0].config, titulo: pasos[0].titulo, scroll: i * 0.3 },
  )

/** La pastilla de los reels: qué cambia y cuántas opciones hay. */
function Firma({ resuelto, pastilla }) {
  // Un texto propio (el vídeo de marca) sustituye a "qué cambia · N opciones".
  if (pastilla) {
    return (
      <CajaPastilla>
        <IconoPastilla tipo="estilo" muestras={[]} />
        {pastilla}
      </CajaPastilla>
    )
  }
  const muestras = [...new Set((resuelto.portada ?? resuelto.pasos).flatMap((p) => p.muestras))].slice(0, 3)
  const n = (resuelto.portada ?? resuelto.pasos).length
  return (
    <CajaPastilla>
      <IconoPastilla tipo={resuelto.tipo} muestras={muestras} />
      {resuelto.nombreEje}
      {n > 1 ? <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500, color: TINTA_TENUE }}>{n} opciones</span> : null}
    </CajaPastilla>
  )
}

// ------------------------------------------------------------
// LOS CUERPOS

/** La web delante y sus versiones siguientes asomando detrás, con la pastilla encima. */
function Pila({ resuelto, pastilla }) {
  const [frente, ...detras] = versiones((resuelto.portada ?? resuelto.pasos), 3)
  const ancho = 860
  const asoma = 44
  const pie = 40 // lo que la pastilla sobresale por debajo de la tarjeta
  const centrada = (w) => ({ left: '50%', marginLeft: -w / 2 })
  return (
    <>
      {detras.reverse().map((v, k) => (
        <Web
          key={k}
          {...v}
          resuelto={resuelto}
          ancho={ancho - (2 - k) * 90}
          style={{ ...centrada(ancho - (2 - k) * 90), top: k * asoma, bottom: pie, boxShadow: '0 20px 40px -30px rgba(22,23,27,0.45)' }}
        />
      ))}
      <Web
        {...frente}
        resuelto={resuelto}
        ancho={ancho}
        style={{ ...centrada(ancho), top: asoma * 2, bottom: pie, boxShadow: '0 50px 100px -40px rgba(22,23,27,0.55)' }}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Firma resuelto={resuelto} pastilla={pastilla} />
      </div>
    </>
  )
}

/** La primera versión frente a la última, inclinadas hacia el centro, con su nombre debajo. */
function Duelo({ resuelto, tema }) {
  const pasos = (resuelto.portada ?? resuelto.pasos)
  const [a, b] = pasos.length > 1 ? [versiones(pasos, 1)[0], { ...versiones(pasos, pasos.length).at(-1) }] : versiones(pasos, 2)
  const ancho = 440
  const hueco = 24
  const bajo = 96 // el hueco para los nombres
  const izquierda = (REEL.ancho - ancho * 2 - hueco) / 2
  const nombre = (v, i) => (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: i === 0 ? izquierda : izquierda + ancho + hueco,
        width: ancho,
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        justifyContent: 'center',
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, color: tema.acento }}>
        {String(i === 0 ? 1 : Math.max(2, pasos.length)).padStart(2, '0')}
      </span>
      <span
        style={{
          ...cuerpo(tema.texto, 32),
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: ancho - 70,
        }}
      >
        {pasos.length > 1 ? v.titulo : i === 0 ? 'Arriba' : 'Más abajo'}
      </span>
    </div>
  )
  return (
    <>
      {[a, b].map((v, i) => (
        <Web
          key={i}
          {...v}
          resuelto={resuelto}
          ancho={ancho}
          radio={32}
          style={{
            left: i === 0 ? izquierda : izquierda + ancho + hueco,
            top: 20,
            bottom: bajo,
            transform: `rotate(${i === 0 ? -2 : 2}deg)`,
            transformOrigin: 'bottom center',
            boxShadow: '0 40px 80px -40px rgba(22,23,27,0.55)',
          }}
        />
      ))}
      {/* La flecha: de la primera a la última. */}
      <div
        style={{
          position: 'absolute',
          left: REEL.ancho / 2 - 48,
          top: '42%',
          width: 96,
          height: 96,
          borderRadius: 48,
          background: FONDO,
          border: `2px solid ${LINEA}`,
          boxShadow: '0 14px 34px -14px rgba(22,23,27,0.4)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icono nombre="flecha" tamano={48} color={ACENTO} />
      </div>
      {nombre(a, 0)}
      {nombre(b, 1)}
    </>
  )
}

/** La web terminada en un móvil, sobre la foto real del negocio (el fondo lo pone PortadaReel). */
function Foto({ resuelto }) {
  const config = (resuelto.portada ?? resuelto.pasos).at(-1).config
  const ancho = 540
  return (
    <>
      <Web
        config={config}
        resuelto={resuelto}
        ancho={ancho}
        radio={56}
        style={{ left: '50%', marginLeft: -ancho / 2, top: 0, bottom: 40, border: `12px solid ${TINTA}`, boxShadow: '0 60px 120px -40px rgba(0,0,0,0.85)' }}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <CajaPastilla>
          <IconoPastilla tipo="recorrido" muestras={[resuelto.marca]} />
          Así quedaría la tuya
        </CajaPastilla>
      </div>
    </>
  )
}

/** El campo "Titular" de Maketa con la frase escrita, montado sobre la web. */
function Titular({ resuelto }) {
  const config = (resuelto.portada ?? resuelto.pasos).at(-1).config
  const ancho = 820
  // En columna: la web empieza donde acaba el campo, ocupe una línea o dos.
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginInline: MARGEN.x,
          padding: '28px 34px 32px',
          borderRadius: 28,
          background: '#17181c',
          border: '2px solid #3b3d47',
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.6)',
          fontFamily: SANS,
        }}
      >
        <div style={{ fontSize: 26, fontWeight: 600, color: '#989ca7', marginBottom: 14 }}>Titular</div>
        <div style={{ fontSize: 52, fontWeight: 650, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#eaebef' }}>
          {resuelto.texto}
          <span style={{ display: 'inline-block', width: 5, height: 54, marginLeft: 6, verticalAlign: -8, background: ACENTO_CLARO }} />
        </div>
      </div>
      <div style={{ position: 'relative', flex: 1, marginTop: 24 }}>
        <Web
          config={config}
          resuelto={resuelto}
          ancho={ancho}
          style={{ left: '50%', marginLeft: -ancho / 2, top: 0, bottom: 0, boxShadow: '0 50px 100px -40px rgba(22,23,27,0.55)' }}
        />
      </div>
    </div>
  )
}

/** Cuatro versiones numeradas y la pregunta: se contesta con un número. */
function Rejilla({ resuelto }) {
  const tiles = versiones((resuelto.portada ?? resuelto.pasos), 4)
  const ancho = 440
  const hueco = 24
  const pregunta = 110 // el hueco para la pastilla de abajo
  const izquierda = (REEL.ancho - ancho * 2 - hueco) / 2
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: izquierda,
          right: izquierda,
          top: 0,
          bottom: pregunta,
          display: 'grid',
          gridTemplateColumns: `${ancho}px ${ancho}px`,
          gridTemplateRows: '1fr 1fr',
          gap: hueco,
        }}
      >
        {tiles.map((v, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <Web {...v} resuelto={resuelto} ancho={ancho} radio={28} style={{ inset: 0, boxShadow: '0 30px 60px -36px rgba(22,23,27,0.5)' }} />
            <div
              style={{
                // Como una pegatina en la esquina: no tapa la web.
                position: 'absolute',
                top: -16,
                left: -16,
                width: 64,
                height: 64,
                borderRadius: 32,
                background: ACENTO,
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontFamily: SANS,
                fontSize: 34,
                fontWeight: 800,
                boxShadow: '0 10px 24px -10px rgba(59,83,214,0.8)',
              }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <CajaPastilla>
          <IconoPastilla tipo={resuelto.tipo} muestras={[]} />
          ¿Cuál eliges?
          <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, color: ACENTO }}>1 · 2 · 3 · 4</span>
        </CajaPastilla>
      </div>
    </>
  )
}

// ------------------------------------------------------------

/**
 * @param resuelto  el reel ya resuelto (motor/resolver.js)
 * @param tema      objeto de diseno/temas.js
 * @param serie     "WEB EN 30 SEGUNDOS · 02", o el pilar si no hay serie
 * @param variante  una de PORTADAS_REEL
 * @param pastilla  texto propio para la pastilla (si no, "qué cambia · N opciones")
 */
export function PortadaReel({ resuelto, tema: temaBase, serie, variante = 'pila', pastilla = null }) {
  let tema = temaBase
  const n = (resuelto.portada ?? resuelto.pasos).length
  // Lo que cada variante necesita para tener sentido; si no, la más cercana.
  let v = PORTADAS_REEL.includes(variante) ? variante : 'pila'
  if (v === 'rejilla' && n < 4) v = n > 1 ? 'duelo' : 'pila'
  if (v === 'numero' && n < 2) v = 'pila'
  if (v === 'foto' && !resuelto.fondo) v = 'pila'
  if (v === 'titular' && !resuelto.texto) v = 'pila'
  // Sobre la foto real, el texto va en claro aunque el tema sea claro.
  if (v === 'foto') tema = { ...tema, oscuro: true, texto: '#fff', suave: 'rgba(255,255,255,0.75)', acento: ACENTO_CLARO }

  const Cuerpo = { pila: Pila, duelo: Duelo, rejilla: Rejilla, numero: Pila, foto: Foto, titular: Titular }[v]

  return (
    <AbsoluteFill
      style={{
        width: REEL.ancho,
        height: REEL.alto,
        background: fondoDe(tema, '50% 72%'),
        fontFamily: SANS,
        padding: `${Z.arriba}px ${MARGEN.x}px ${Z.abajo}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {v === 'foto' ? (
        <AbsoluteFill>
          <Img src={resuelto.fondo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(22,23,27,0.88) 0%, rgba(22,23,27,0.55) 38%, rgba(22,23,27,0.35) 70%, rgba(22,23,27,0.7) 100%)' }} />
        </AbsoluteFill>
      ) : null}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Marca tamano={38} tema={tema.oscuro ? 'oscuro' : 'claro'} />
        {serie ? <span style={antetitulo(24, tema.acento)}>{serie}</span> : null}
      </div>

      {v === 'numero' ? (
        // El número manda; el gancho, debajo y más pequeño.
        <>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 28, marginTop: Z.trasCabecera }}>
            <span style={{ fontFamily: SANS, fontSize: 300, fontWeight: 800, letterSpacing: '-0.07em', lineHeight: 0.8, color: tema.acento, marginLeft: -10 }}>
              {n}
            </span>
            <span style={{ ...titular(88, tema.texto), paddingBottom: 6 }}>{plural(resuelto)}</span>
          </div>
          <h1 style={{ ...titular(64, tema.suave), lineHeight: 1.08, marginTop: 40 }}>
            <ConAcento texto={resuelto.gancho} acento={tema.acento} />
          </h1>
        </>
      ) : (
        <h1 style={{ ...titular(TIPO_REEL.gancho, tema.texto), position: 'relative', lineHeight: 1.04, marginTop: Z.trasCabecera }}>
          <ConAcento texto={resuelto.gancho} acento={tema.acento} />
        </h1>
      )}

      {/* El cuerpo se estira hasta abajo: no quedan huecos tenga el gancho las líneas que tenga. */}
      <div style={{ position: 'relative', flex: 1, minHeight: 520, marginTop: Z.trasGancho, marginInline: -MARGEN.x }}>
        <Cuerpo resuelto={resuelto} tema={tema} pastilla={pastilla} />
      </div>
    </AbsoluteFill>
  )
}
