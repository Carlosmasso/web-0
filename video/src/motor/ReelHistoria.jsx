import { AbsoluteFill, OffthreadVideo, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { springTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { PRESETS } from '../../../src/registry/presets'
import { BarraProgreso } from '../componentes/BarraProgreso'
import { Cierre } from '../componentes/Cierre'
import { Etiqueta, IconoPastilla, Valor } from '../componentes/Etiqueta'
import { Palabras } from '../componentes/Palabras'
import { clamp, entrar, progreso } from '../diseno/animaciones'
import { TIPO_REEL } from '../diseno/formatos'
import { SANS } from '../diseno/fuentes'
import { ACENTO_CLARO, MUELLE, TINTA } from '../diseno/marca'
import { TIEMPOS_HISTORIA as T, TOQUES } from './historia'
import { WebEnCambio } from './WebEnCambio'

// ============================================================
// LA HISTORIA — un negocio real, antes y ahora (ver motor/historia.js)
//
// Mismo acabado que el resto del motor: Inter 700 palabra a palabra, la
// pastilla blanca, muelles suaves y fundidos. Lo nuevo es lo de fuera de la
// pantalla: vídeo real del oficio de fondo, y Maketa usada desde un móvil.
// ============================================================

const cruce = springTiming({ config: MUELLE.suave, durationInFrames: T.cruce })

// ---------- vídeo real ----------

/** Un clip de Pexels a sangre, con un acercamiento lento (nada salta). */
function Clip({ clip, duracion, zoom = [1, 1.08], oscurecer = 0, desenfoque = 0 }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const escala = interpolate(frame, [0, duracion], zoom, clamp)
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: TINTA }}>
      <OffthreadVideo
        src={clip.url}
        muted
        trimBefore={Math.round((clip.desde ?? 0) * fps)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${escala})`,
          filter: desenfoque ? `blur(${desenfoque}px)` : undefined,
        }}
      />
      {oscurecer ? <AbsoluteFill style={{ background: `rgba(22,23,27,${oscurecer})` }} /> : null}
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

// ---------- el móvil ----------

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

// ---------- la hoja de Maketa, como en el configurador en móvil ----------

const PANEL = { fondo: '#17181c', tarjeta: '#23242a', campo: '#2e3038', linea: '#3b3d47', texto: '#eaebef', suave: '#989ca7', acento: '#829dff', acentoSuave: 'rgba(130,157,255,0.15)' }
const HOJA = { arriba: ALTO_WEB - 24, contenido: 112, fila: 112, alto: 100 }

// Dónde cae cada toque, en coordenadas de la pantalla: [x, y].
const COLORES_X = (i) => 46 + 32 + i * 88
const OBJETIVO = [
  [PANTALLA.ancho / 2, HOJA.arriba + HOJA.contenido + 1 * HOJA.fila + HOJA.alto / 2],
  [COLORES_X(2), HOJA.arriba + HOJA.contenido + 76],
  [PANTALLA.ancho / 2, HOJA.arriba + HOJA.contenido + 2 * HOJA.fila + HOJA.alto / 2],
]

/** Qué grupo de la hoja se ve: el de cada toque, hasta poco después de darlo. */
function useGrupo() {
  const frame = useCurrentFrame()
  const g = TOQUES.findIndex((t) => frame < t + 16)
  return g === -1 ? TOQUES.length - 1 : g
}

function Opcion({ activo, children, style }) {
  return (
    <div
      style={{
        height: HOJA.alto,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 22px',
        borderRadius: 16,
        background: activo ? PANEL.acentoSuave : PANEL.tarjeta,
        border: `2px solid ${activo ? PANEL.acento : PANEL.linea}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Grupo({ indice, titulo, children }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const visible = useGrupo() === indice
  const desde = indice === 0 ? 0 : TOQUES[indice - 1] + 16
  const p = indice === 0 ? 1 : progreso(frame, fps, desde, MUELLE.suave, 12)
  if (!visible) return null
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <div style={{ position: 'absolute', top: 44, left: 26, fontSize: 30, fontWeight: 650, color: PANEL.texto }}>{titulo}</div>
      <div style={{ position: 'absolute', top: HOJA.contenido, left: 24, right: 24 }}>{children}</div>
    </div>
  )
}

function Hoja({ resuelto }) {
  const frame = useCurrentFrame()
  const elegido = (i) => frame >= TOQUES[i]
  const comerciales = PRESETS.filter((p) => p.category === 'commercial' && p.label !== resuelto.preset.label).slice(0, 2)
  const presets = [comerciales[0], resuelto.preset, comerciales[1]]
  const colores = ['#3d7a6a', '#3b53d6', resuelto.marca, '#7c3aed', '#1f2937', '#be185d']
  const portadas = [
    ['Dividida', 'Texto + panel visual'],
    ['Centrada', 'Manifiesto tipográfico'],
    ['Imagen de fondo', 'Tu foto a sangre'],
  ]

  return (
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

      <Grupo indice={0} titulo="Punto de partida">
        <div style={{ display: 'grid', gap: HOJA.fila - HOJA.alto }}>
          {presets.map((p, i) => (
            <Opcion key={p.label} activo={i === 1 && elegido(0)}>
              <div style={{ width: 52, height: 52, borderRadius: 12, overflow: 'hidden', display: 'grid', gridTemplateRows: '1fr 1fr 1fr', flex: 'none' }}>
                {p.swatch.map((c) => (
                  <div key={c} style={{ background: c }} />
                ))}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 650, color: PANEL.texto }}>{p.label}</div>
                <div style={{ fontSize: 20, color: PANEL.suave, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.audience}</div>
              </div>
            </Opcion>
          ))}
        </div>
      </Grupo>

      <Grupo indice={1} titulo="Tu color de marca">
        <div style={{ fontSize: 21, color: PANEL.suave }}>El resto de la paleta se ajusta solo</div>
        <div style={{ position: 'absolute', top: 44, left: 46 - 24, display: 'flex', gap: 24 }}>
          {colores.map((c, i) => {
            const activo = elegido(1) ? i === 2 : i === 0
            return (
              <div
                key={c}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: c,
                  boxShadow: activo ? `0 0 0 4px ${PANEL.fondo}, 0 0 0 7px ${PANEL.acento}` : `0 0 0 2px ${PANEL.linea}`,
                }}
              />
            )
          })}
        </div>
      </Grupo>

      <Grupo indice={2} titulo="Portada">
        <div style={{ display: 'grid', gap: HOJA.fila - HOJA.alto }}>
          {portadas.map(([nombre, nota], i) => (
            <Opcion key={nombre} activo={elegido(2) ? i === 2 : i === 1}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 650, color: PANEL.texto }}>{nombre}</div>
                <div style={{ fontSize: 20, color: PANEL.suave }}>{nota}</div>
              </div>
            </Opcion>
          ))}
        </div>
      </Grupo>
    </div>
  )
}

/** El dedo: va de un objetivo al siguiente, se hunde al tocar y deja una onda. */
function Toque() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const aparece = progreso(frame, fps, TOQUES[0] - 44, MUELLE.suave, 14)
  const vase = progreso(frame, fps, TOQUES.at(-1) + 26, MUELLE.suave, 12)
  if (frame < TOQUES[0] - 44 || vase > 0.99) return null

  // Posición: se desliza hacia cada objetivo en los 26 fotogramas antes del toque.
  let [x, y] = [OBJETIVO[0][0] + 120, OBJETIVO[0][1] + 160]
  TOQUES.forEach((t, i) => {
    const p = progreso(frame, fps, t - 30, MUELLE.suave, 22)
    x += (OBJETIVO[i][0] - x) * p
    y += (OBJETIVO[i][1] - y) * p
  })
  const actual = TOQUES.findLastIndex((t) => frame >= t - 6)
  const t = actual >= 0 ? TOQUES[actual] : null
  const presion = t == null ? 0 : interpolate(frame, [t - 6, t, t + 8], [0, 1, 0], clamp)
  const onda = t == null ? 0 : interpolate(frame, [t, t + 18], [0, 1], clamp)

  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: aparece * (1 - vase), pointerEvents: 'none' }}>
      {onda > 0 && onda < 1 ? (
        <div
          style={{
            position: 'absolute',
            width: 90,
            height: 90,
            left: -45,
            top: -45,
            borderRadius: 45,
            border: '4px solid rgba(255,255,255,0.9)',
            transform: `scale(${0.6 + onda * 1.4})`,
            opacity: 1 - onda,
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          width: 72,
          height: 72,
          left: -36,
          top: -36,
          borderRadius: 36,
          background: 'rgba(255,255,255,0.88)',
          boxShadow: '0 10px 26px rgba(0,0,0,0.35), inset 0 0 0 2px rgba(22,23,27,0.08)',
          transform: `scale(${1 - presion * 0.18})`,
        }}
      />
    </div>
  )
}

// ---------- escenas ----------

function EscenaGanchoReal({ resuelto }) {
  return (
    <AbsoluteFill>
      <Clip clip={resuelto.clips.gancho} duracion={T.gancho} zoom={[1.02, 1.1]} />
      <Velo />
      <FraseSobrePlano texto={resuelto.gancho} desde={8} />
    </AbsoluteFill>
  )
}

function EscenaMovil({ resuelto }) {
  const frame = useCurrentFrame()
  const { pasos } = resuelto
  const k = pasos.findLastIndex((p) => p.frame <= frame)
  const paso = pasos[k]
  return (
    <AbsoluteFill style={{ fontFamily: SANS }}>
      <Clip clip={{ ...resuelto.clips.gancho, desde: (resuelto.clips.gancho.desde ?? 0) + 3 }} duracion={T.movil} zoom={[1.15, 1.2]} desenfoque={26} oscurecer={0.55} />
      <Etiqueta desde={10} arriba={250}>
        <IconoPastilla tipo={k === 0 ? 'estilo' : 'preset'} muestras={paso.muestras} />
        <Valor key={k} desde={k === 0 ? 10 : paso.frame}>
          <span style={{ fontFamily: SANS, fontSize: 38, fontWeight: 600, letterSpacing: '-0.02em', color: TINTA }}>{paso.titulo}</span>
        </Valor>
      </Etiqueta>
      <Movil>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: ALTO_WEB, overflow: 'hidden' }}>
          <WebEnCambio
            pasos={pasos}
            contenido={resuelto.contenido}
            movimiento={null}
            ancho={390}
            alto={ALTO_WEB / ESCALA_WEB}
            escala={ESCALA_WEB}
          />
        </div>
        <Hoja resuelto={resuelto} />
        <Toque />
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
      <Clip clip={resuelto.clips.planos[1]} duracion={T.resultado} zoom={[1.15, 1.2]} desenfoque={26} oscurecer={0.55} />
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

export function ReelHistoria({ resuelto }) {
  return (
    <AbsoluteFill style={{ background: TINTA }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={T.gancho}>
          <EscenaGanchoReal resuelto={resuelto} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={T.movil}>
          <EscenaMovil resuelto={resuelto} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={T.planos}>
          <EscenaPlanos resuelto={resuelto} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={T.resultado}>
          <EscenaResultado resuelto={resuelto} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={T.cierre}>
          <Cierre linea1={resuelto.pregunta} linea2="Diséñala tú. Yo la construyo." />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BarraProgreso />
    </AbsoluteFill>
  )
}
