import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { springTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { BarraProgreso } from '../componentes/BarraProgreso'
import { Cierre } from '../componentes/Cierre'
import { Escenario } from '../componentes/Escenario'
import { Etiqueta, IconoPastilla, Valor } from '../componentes/Etiqueta'
import { Palabras } from '../componentes/Palabras'
import { Tarjeta } from '../componentes/Tarjeta'
import { barrido, clamp, entrar, progreso } from '../diseno/animaciones'
import { TIPO_REEL } from '../diseno/formatos'
import { SANS } from '../diseno/fuentes'
import { ACENTO_CLARO, MUELLE, TINTA } from '../diseno/marca'
import { ESCRIBE, PAR, TIEMPOS_HISTORIA as T, TOQUES } from './historia'
import { WebEnCambio } from './WebEnCambio'

// ============================================================
// LA HISTORIA — un negocio real, en tres formas (ver motor/historia.js)
//
// Mismo acabado que el resto del motor: Inter 700 palabra a palabra, la
// pastilla blanca, muelles suaves y fundidos. Lo nuevo es lo de fuera de la
// pantalla: vídeo real del oficio, y Maketa usada desde un móvil.
// ============================================================

const cruce = springTiming({ config: MUELLE.suave, durationInFrames: T.cruce })

// ---------- vídeo y foto reales ----------

/** Un clip de Pexels a sangre, con un acercamiento lento (nada salta). */
function Clip({ clip, duracion, zoom = [1, 1.08] }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const escala = interpolate(frame, [0, duracion], zoom, clamp)
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: TINTA }}>
      <OffthreadVideo
        src={clip.url}
        muted
        trimBefore={Math.round((clip.desde ?? 0) * fps)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${escala})` }}
      />
    </AbsoluteFill>
  )
}

/** La foto del negocio, desenfocada y oscurecida: el fondo del móvil. */
function FondoFoto({ src, duracion }) {
  const frame = useCurrentFrame()
  const escala = interpolate(frame, [0, duracion], [1.15, 1.22], clamp)
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: TINTA }}>
      <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${escala})`, filter: 'blur(26px)' }} />
      <AbsoluteFill style={{ background: 'rgba(22,23,27,0.55)' }} />
    </AbsoluteFill>
  )
}

/** Velo de abajo arriba, para que el texto se lea sobre cualquier plano. */
const Velo = () => (
  <AbsoluteFill
    style={{
      background:
        'linear-gradient(to top, rgba(22,23,27,0.94) 0%, rgba(22,23,27,0.7) 34%, rgba(22,23,27,0.15) 62%, rgba(22,23,27,0) 80%)',
    }}
  />
)

/** Frase grande sobre un plano real, en la franja segura de abajo. */
const FraseSobrePlano = ({ texto, desde = 6, hasta }) => (
  <div style={{ position: 'absolute', left: 90, right: 90, top: 1060 }}>
    <Palabras texto={texto} desde={desde} hasta={hasta} color="#fff" acento={ACENTO_CLARO} tamano={TIPO_REEL.gancho} ancho={900} />
  </div>
)

/** La pastilla de arriba: cambia de texto con un golpe en cada momento. */
function Pastilla({ k, desde, tipo, muestras = [], children }) {
  return (
    <Etiqueta desde={10} arriba={250}>
      <IconoPastilla tipo={tipo} muestras={muestras} />
      <Valor key={k} desde={desde}>
        <span style={{ fontFamily: SANS, fontSize: 38, fontWeight: 600, letterSpacing: '-0.02em', color: TINTA }}>{children}</span>
      </Valor>
    </Etiqueta>
  )
}

// ---------- el móvil y la hoja de Maketa ----------

const MOVIL = { ancho: 620, alto: 1120, arriba: 380, marco: 12 }
const PANTALLA = { ancho: MOVIL.ancho - MOVIL.marco * 2, alto: MOVIL.alto - MOVIL.marco * 2 }
const ALTO_WEB = 610 // lo que ocupa la web arriba; debajo, la hoja de Maketa
const ESCALA_WEB = PANTALLA.ancho / 390

function Movil({ children }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return (
    <div
      style={{
        position: 'absolute',
        top: MOVIL.arriba,
        left: (1080 - MOVIL.ancho) / 2,
        width: MOVIL.ancho,
        height: MOVIL.alto,
        padding: MOVIL.marco,
        boxSizing: 'border-box',
        borderRadius: 64,
        background: TINTA,
        boxShadow: '0 60px 120px -40px rgba(0,0,0,0.75), 0 0 0 2px rgba(255,255,255,0.08)',
        ...entrar(progreso(frame, fps, 4, MUELLE.vivo)),
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 52, overflow: 'hidden', background: '#fff' }}>
        {children}
      </div>
    </div>
  )
}

/** La web en la mitad de arriba del móvil (la de abajo es la hoja). */
const WebArriba = ({ pasos, contenido, movimiento = null }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: ALTO_WEB, overflow: 'hidden' }}>
    <WebEnCambio pasos={pasos} contenido={contenido} movimiento={movimiento} ancho={390} alto={ALTO_WEB / ESCALA_WEB} escala={ESCALA_WEB} />
  </div>
)

const PANEL = { fondo: '#17181c', tarjeta: '#23242a', campo: '#2e3038', linea: '#3b3d47', texto: '#eaebef', suave: '#989ca7', acento: '#829dff', acentoSuave: 'rgba(130,157,255,0.15)' }
const HOJA = { arriba: ALTO_WEB - 24, contenido: 112, fila: 112, alto: 100, margen: 24 }

/** El panel oscuro de abajo, con su tirador, como en el configurador en móvil. */
const Hoja = ({ children }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: HOJA.arriba,
      bottom: 0,
      background: PANEL.fondo,
      borderRadius: '28px 28px 0 0',
      boxShadow: '0 -20px 40px -20px rgba(0,0,0,0.5)',
      fontFamily: SANS,
    }}
  >
    <div style={{ position: 'absolute', top: 14, left: '50%', width: 60, height: 6, marginLeft: -30, borderRadius: 3, background: PANEL.linea }} />
    {children}
  </div>
)

/** Un bloque de la hoja que entra con un fundido corto desde `desde`. */
function Bloque({ desde = 0, titulo, children }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = desde === 0 ? 1 : progreso(frame, fps, desde, MUELLE.suave, 12)
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <div style={{ position: 'absolute', top: 44, left: 26, fontSize: 30, fontWeight: 650, color: PANEL.texto }}>{titulo}</div>
      <div style={{ position: 'absolute', top: HOJA.contenido, left: HOJA.margen, right: HOJA.margen }}>{children}</div>
    </div>
  )
}

function Opcion({ activo, children }) {
  return (
    <div
      style={{
        height: HOJA.alto,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        minWidth: 0,
        padding: '0 22px',
        borderRadius: 16,
        background: activo ? PANEL.acentoSuave : PANEL.tarjeta,
        border: `2px solid ${activo ? PANEL.acento : PANEL.linea}`,
      }}
    >
      {children}
    </div>
  )
}

const COLOR_X = (i) => 46 + 32 + i * 88

/** Dónde cae el toque de un grupo, en coordenadas de la pantalla. */
const objetivoDe = (g) =>
  g.grupo === 'muestras'
    ? [COLOR_X(g.objetivo), HOJA.arriba + HOJA.contenido + 76]
    : [PANTALLA.ancho / 2, HOJA.arriba + HOJA.contenido + g.objetivo * HOJA.fila + HOJA.alto / 2]

/** Un grupo de la hoja ("Antes y ahora"): tarjetas, lista o muestras de color. */
function GrupoToque({ g, elegido }) {
  const marcado = (i) => (elegido ? i === g.objetivo : i === g.inicial)
  if (g.grupo === 'muestras') {
    return (
      <>
        <div style={{ fontSize: 21, color: PANEL.suave }}>El resto de la paleta se ajusta solo</div>
        <div style={{ position: 'absolute', top: 44, left: 46 - HOJA.margen, display: 'flex', gap: 24 }}>
          {g.opciones.map((o, i) => (
            <div
              key={o.color + i}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                background: o.color,
                boxShadow: marcado(i) ? `0 0 0 4px ${PANEL.fondo}, 0 0 0 7px ${PANEL.acento}` : `0 0 0 2px ${PANEL.linea}`,
              }}
            />
          ))}
        </div>
      </>
    )
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: HOJA.fila - HOJA.alto }}>
      {g.opciones.map((o, i) => (
        <Opcion key={o.label} activo={marcado(i)}>
          {o.swatch ? (
            <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', display: 'grid', gridTemplateRows: '1fr 1fr 1fr', flex: 'none' }}>
              {o.swatch.map((c) => (
                <div key={c} style={{ background: c }} />
              ))}
            </div>
          ) : null}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 650, color: PANEL.texto }}>{o.label}</div>
            <div style={{ fontSize: 20, color: PANEL.suave, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.nota}</div>
          </div>
        </Opcion>
      ))}
    </div>
  )
}

/** El dedo: va de un objetivo al siguiente, se hunde al tocar y deja una onda. */
function Toque({ toques }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const primero = toques[0].frame
  const ultimo = toques.at(-1).frame
  const aparece = progreso(frame, fps, primero - 44, MUELLE.suave, 14)
  const vase = progreso(frame, fps, ultimo + 26, MUELLE.suave, 12)
  if (frame < primero - 44 || vase > 0.99) return null

  // Se desliza hacia cada objetivo en los fotogramas antes de tocarlo.
  let [x, y] = [toques[0].x + 120, toques[0].y + 160]
  for (const t of toques) {
    const p = progreso(frame, fps, t.frame - 30, MUELLE.suave, 22)
    x += (t.x - x) * p
    y += (t.y - y) * p
  }
  const actual = toques.findLast((t) => frame >= t.frame - 6)
  const presion = actual ? interpolate(frame, [actual.frame - 6, actual.frame, actual.frame + 8], [0, 1, 0], clamp) : 0
  const onda = actual ? interpolate(frame, [actual.frame, actual.frame + 18], [0, 1], clamp) : 0

  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: aparece * (1 - vase), pointerEvents: 'none' }}>
      {onda > 0 && onda < 1 ? (
        <div
          style={{
            position: 'absolute',
            width: 52,
            height: 52,
            left: -26,
            top: -26,
            borderRadius: 26,
            border: '2px solid rgba(255,255,255,0.8)',
            transform: `scale(${0.7 + onda * 1.1})`,
            opacity: (1 - onda) * 0.8,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          width: 40,
          height: 40,
          left: -20,
          top: -20,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.72)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.3), inset 0 0 0 1.5px rgba(22,23,27,0.1)',
          transform: `scale(${1 - presion * 0.15})`,
        }}
      />
    </div>
  )
}

// ---------- "Lo escribes tú": el campo, el teclado y la galería ----------

const FILAS_TECLADO = ['qwertyuiop', 'asdfghjklñ', 'zxcvbnm']
const plano = (c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Teclado({ tecla }) {
  const ancho = (PANTALLA.ancho - HOJA.margen * 2 - 9 * 6) / 10
  const fila = (letras, i) => (
    <div key={i} style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
      {[...letras].map((l) => {
        const pulsada = l === tecla
        return (
          <div
            key={l}
            style={{
              width: ancho,
              height: 50,
              borderRadius: 9,
              display: 'grid',
              placeItems: 'center',
              fontSize: 26,
              color: PANEL.texto,
              background: pulsada ? PANEL.acento : '#3a3b41',
              transform: pulsada ? 'translateY(-6px) scale(1.12)' : 'none',
              boxShadow: '0 2px 0 rgba(0,0,0,0.35)',
            }}
          >
            {l}
          </div>
        )
      })}
    </div>
  )
  return (
    <div style={{ position: 'absolute', left: HOJA.margen, right: HOJA.margen, bottom: 20, display: 'grid', gap: 8 }}>
      {FILAS_TECLADO.map(fila)}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '56%', height: 50, borderRadius: 9, background: tecla === ' ' ? PANEL.acento : '#3a3b41', boxShadow: '0 2px 0 rgba(0,0,0,0.35)' }} />
      </div>
    </div>
  )
}

function CampoTitular({ texto }) {
  const frame = useCurrentFrame()
  const letras = Math.round(interpolate(frame, [ESCRIBE.desde, ESCRIBE.hasta], [0, texto.length], clamp))
  const cursor = Math.floor(frame / 15) % 2 === 0 || (frame > ESCRIBE.desde && frame < ESCRIBE.hasta)
  const tecla = frame >= ESCRIBE.desde && frame <= ESCRIBE.hasta + 2 && letras > 0 ? plano(texto[letras - 1]) : null
  return (
    <>
      <Bloque titulo="Cabecera">
        <div style={{ fontSize: 22, fontWeight: 600, color: PANEL.suave, marginBottom: 10 }}>Titular</div>
        <div
          style={{
            minHeight: 96,
            boxSizing: 'border-box',
            padding: '14px 18px',
            borderRadius: 14,
            background: PANEL.campo,
            border: `2px solid ${PANEL.acento}`,
            fontSize: 28,
            lineHeight: 1.3,
            color: PANEL.texto,
          }}
        >
          {texto.slice(0, letras)}
          <span style={{ display: 'inline-block', width: 3, height: 32, marginLeft: 2, verticalAlign: -6, background: PANEL.acento, opacity: cursor ? 1 : 0 }} />
        </div>
      </Bloque>
      <Teclado tecla={tecla} />
    </>
  )
}

/** La galería del móvil: fotos y vídeos del propio negocio. */
function Galeria({ resuelto }) {
  const frame = useCurrentFrame()
  const elegida = frame >= ESCRIBE.foto
  const { clips } = resuelto
  const piezas = [
    { video: clips.planos[0] },
    { foto: resuelto.fondo, objetivo: true },
    { video: clips.gancho },
    { foto: resuelto.fotoApaisada },
    { video: clips.planos[1] },
    { foto: resuelto.fotoApaisada, encuadre: '80% 50%' },
  ]
  return (
    <Bloque desde={ESCRIBE.galeria} titulo="Foto de portada">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {piezas.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 12,
              overflow: 'hidden',
              background: PANEL.tarjeta,
              boxShadow: p.objetivo && elegida ? `0 0 0 4px ${PANEL.fondo}, 0 0 0 7px ${PANEL.acento}` : 'none',
            }}
          >
            {p.foto ? (
              <Img src={p.foto} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: p.encuadre ?? '50% 50%' }} />
            ) : (
              <OffthreadVideo src={p.video.url} muted trimBefore={Math.round((p.video.desde ?? 0) * 30)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        ))}
      </div>
    </Bloque>
  )
}

// Dónde está la foto que se elige: segunda celda de la primera fila.
const CELDA = (PANTALLA.ancho - HOJA.margen * 2 - 24) / 3
const OBJETIVO_FOTO = { x: HOJA.margen + CELDA * 1.5 + 12, y: HOJA.arriba + HOJA.contenido + CELDA / 2 }

// ---------- escenas ----------

function EscenaGancho({ resuelto }) {
  return (
    <AbsoluteFill>
      <Clip clip={resuelto.clips.gancho} duracion={T.gancho} zoom={[1.02, 1.1]} />
      <Velo />
      <FraseSobrePlano texto={resuelto.gancho} desde={8} />
    </AbsoluteFill>
  )
}

/** "Antes y ahora": la web de antes y tres toques en la hoja. */
function EscenaMovil({ resuelto }) {
  const frame = useCurrentFrame()
  const { pasos, grupos } = resuelto
  const k = pasos.findLastIndex((p) => p.frame <= frame)
  const paso = pasos[k]
  // Cada grupo se ve hasta poco después de su toque; luego entra el siguiente.
  const siguiente = TOQUES.findIndex((t) => frame < t + 16)
  const visible = siguiente === -1 ? grupos.length - 1 : siguiente
  const toques = grupos.map((gr, i) => {
    const [x, y] = objetivoDe(gr)
    return { frame: TOQUES[i], x, y }
  })
  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <FondoFoto src={resuelto.fondo} duracion={T.movil} />
      <Pastilla k={k} desde={k === 0 ? 10 : paso.frame} tipo={k === 0 ? 'estilo' : grupos[k - 1].tipo} muestras={paso.muestras}>
        {paso.titulo}
      </Pastilla>
      <Movil>
        <WebArriba pasos={pasos} contenido={resuelto.contenido} />
        <Hoja>
          <Bloque key={visible} desde={visible === 0 ? 0 : TOQUES[visible - 1] + 16} titulo={grupos[visible].titulo}>
            <GrupoToque g={grupos[visible]} elegido={frame >= TOQUES[visible]} />
          </Bloque>
        </Hoja>
        <Toque toques={toques} />
      </Movil>
    </AbsoluteFill>
  )
}

/** "Lo escribes tú": el titular tecleado y la foto de la galería. */
function EscenaEscribe({ resuelto }) {
  const frame = useCurrentFrame()
  const foto = frame >= ESCRIBE.foto
  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <FondoFoto src={resuelto.fondo} duracion={T.escribe} />
      <Pastilla k={foto ? 1 : 0} desde={foto ? ESCRIBE.foto : 10} tipo={foto ? 'portada' : 'titular'}>
        {foto ? 'Tu foto' : 'Tu titular'}
      </Pastilla>
      <Movil>
        <WebArriba pasos={resuelto.pasos} contenido={resuelto.contenido} movimiento={resuelto.movimiento} />
        <Hoja>{frame < ESCRIBE.galeria ? <CampoTitular texto={resuelto.texto} /> : <Galeria resuelto={resuelto} />}</Hoja>
        <Toque toques={[{ frame: ESCRIBE.foto, ...OBJETIVO_FOTO }]} />
      </Movil>
    </AbsoluteFill>
  )
}

function EscenaPlanos({ resuelto }) {
  const frame = useCurrentFrame()
  const mitad = Math.round(T.planos / 2)
  const segundo = interpolate(frame, [mitad - 8, mitad + 8], [0, 1], clamp)
  const [a, b] = resuelto.clips.planos
  const [fraseA, fraseB] = resuelto.frases
  return (
    <AbsoluteFill>
      <Clip clip={a} duracion={T.planos} zoom={[1, 1.06]} />
      <AbsoluteFill style={{ opacity: segundo }}>
        <Clip clip={b} duracion={T.planos} zoom={[1.06, 1]} />
      </AbsoluteFill>
      <Velo />
      <FraseSobrePlano texto={fraseA} desde={6} hasta={mitad} />
      <FraseSobrePlano texto={fraseB} desde={mitad + 2} />
    </AbsoluteFill>
  )
}

function EscenaResultado({ resuelto }) {
  const pasos = [{ frame: 0, config: resuelto.final, transicion: 'barrido', titulo: '', muestras: [] }]
  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <FondoFoto src={resuelto.fondo} duracion={T.resultado} />
      <Etiqueta desde={8} arriba={250}>
        <IconoPastilla tipo="recorrido" muestras={[resuelto.marca]} />
        Así quedaría la tuya
      </Etiqueta>
      <Movil>
        <WebEnCambio
          pasos={pasos}
          contenido={resuelto.contenido}
          movimiento={{ tipo: 'recorrido', desde: 24, hasta: T.resultado - 6 }}
          ancho={390}
          alto={PANTALLA.alto / ESCALA_WEB}
          escala={ESCALA_WEB}
        />
      </Movil>
    </AbsoluteFill>
  )
}

// La pantalla partida: el oficio arriba, la tarjeta con la web abajo, montada
// un poco sobre el vídeo para que se lean como una sola cosa.
const PARTIDA = { altoClip: 1010, tarjeta: { arriba: 880, ancho: 900, alto: 640 }, anchoWeb: 430 }

/** Pantalla partida: cada plano real con la sección de la web que lo cuenta. */
function EscenaPartida({ resuelto }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const { pares, final, contenido } = resuelto
  const k = Math.min(pares.length - 1, Math.floor(frame / PAR))
  const { tarjeta: C, anchoWeb } = PARTIDA
  const escala = C.ancho / anchoWeb
  const todos = { configs: [final], contenidos: [contenido] }
  return (
    <AbsoluteFill style={{ background: TINTA, fontFamily: SANS }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: PARTIDA.altoClip, overflow: 'hidden' }}>
        {pares.map((par, i) => {
          // Cada plano empieza un poco antes de su turno y entra con un fundido.
          const desde = Math.max(0, i * PAR - 12)
          const opacidad = i === 0 ? 1 : interpolate(frame, [i * PAR - 12, i * PAR + 4], [0, 1], clamp)
          return (
            <Sequence key={i} from={desde} durationInFrames={PAR + 24} layout="none">
              <AbsoluteFill style={{ opacity: opacidad }}>
                <Clip clip={par.clip} duracion={PAR + 24} zoom={[1.02, 1.08]} />
              </AbsoluteFill>
            </Sequence>
          )
        })}
        <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(22,23,27,0.55) 0%, rgba(22,23,27,0) 30%, rgba(22,23,27,0) 70%, rgba(22,23,27,0.85) 100%)' }} />
      </div>

      <Pastilla k={k} desde={k === 0 ? 10 : k * PAR} tipo="recorrido" muestras={[resuelto.marca]}>
        {pares[k].texto}
      </Pastilla>

      <Tarjeta arriba={C.arriba} ancho={C.ancho} alto={C.alto}>
        {pares.map((par, i) => {
          const p = i === 0 ? 1 : progreso(frame, fps, i * PAR, undefined, 18)
          return (
            <AbsoluteFill key={i} style={i === 0 ? undefined : barrido(p)}>
              <Escenario config={final} contenido={contenido} todos={todos} seccion={par.seccion} ancho={anchoWeb} alto={C.alto / escala} escala={escala} />
            </AbsoluteFill>
          )
        })}
      </Tarjeta>
    </AbsoluteFill>
  )
}

const ESCENA = {
  gancho: EscenaGancho,
  movil: EscenaMovil,
  escribe: EscenaEscribe,
  planos: EscenaPlanos,
  resultado: EscenaResultado,
  partida: EscenaPartida,
}

export function ReelHistoria({ resuelto }) {
  const piezas = resuelto.escenas.flatMap((e, i) => {
    const contenido =
      e === 'cierre' ? <Cierre linea1={resuelto.pregunta} linea2="Diséñala tú. Yo la construyo." /> : (() => {
        const Escena = ESCENA[e]
        return <Escena resuelto={resuelto} />
      })()
    const secuencia = (
      <TransitionSeries.Sequence key={e} durationInFrames={T[e]}>
        {contenido}
      </TransitionSeries.Sequence>
    )
    return i === 0 ? [secuencia] : [<TransitionSeries.Transition key={`${e}-cruce`} presentation={fade()} timing={cruce} />, secuencia]
  })
  return (
    <AbsoluteFill style={{ background: TINTA }}>
      <TransitionSeries>{piezas}</TransitionSeries>
      <BarraProgreso />
    </AbsoluteFill>
  )
}
