import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { Etiqueta, Valor } from '../componentes/Etiqueta'
import { MONO, SANS, SERIF } from '../fuentes'
import { FONDO, FONDO_ALT, LINEA, MUELLE, PALETAS, TINTA, TINTA_TENUE } from '../marca'

// ============================================================
// Escena 2 (4-11 s): una sola web simulada que se transforma delante de
// la cámara, en tres tiempos. Es la misma idea que vende el producto: tocas
// algo y la web cambia, sin cambiar de pantalla.
//
//   color      0-70   el color de marca salta de azul a naranja y a violeta
//   tipo      70-140  el titular cambia de familia de golpe (sans, serif, mono)
//   secciones 140-225 las tarjetas se recolocan: rejilla, filas, bento
//
// Los tiempos son fotogramas locales de la escena (30 fps). Los nombres de las
// variantes son los del configurador (`features`: grid / rows / bento).
// ============================================================

const FIN_COLOR = 70
const FIN_TIPO = 140

const PASOS_COLOR = [0, 20, 42] // un paso por entrada de PALETAS

const PASOS_TIPO = [
  { at: 70, nombre: 'Inter', fuente: SANS, peso: 700, tracking: '-0.04em' },
  { at: 92, nombre: 'Fraunces', fuente: SERIF, peso: 600, tracking: '-0.02em' },
  { at: 114, nombre: 'JetBrains Mono', fuente: MONO, peso: 700, tracking: '-0.05em' },
]

// Área de tarjetas: 732 x 400. Cada variante coloca las tres tarjetas.
const REJILLA = [
  { x: 0, y: 30, w: 232, h: 340 },
  { x: 250, y: 30, w: 232, h: 340 },
  { x: 500, y: 30, w: 232, h: 340 },
]
// En filas el orden cambia a propósito: las tarjetas se cruzan y se lee
// "reordenar", no solo "estirar".
const FILAS = [
  { x: 0, y: 138, w: 732, h: 124 },
  { x: 0, y: 276, w: 732, h: 124 },
  { x: 0, y: 0, w: 732, h: 124 },
]
const BENTO = [
  { x: 458, y: 0, w: 274, h: 191 },
  { x: 0, y: 0, w: 440, h: 400 },
  { x: 458, y: 209, w: 274, h: 191 },
]

const PASOS_VARIANTE = [
  { at: 140, nombre: 'Rejilla', cajas: REJILLA },
  { at: 160, nombre: 'Filas', cajas: FILAS },
  { at: 186, nombre: 'Bento', cajas: BENTO },
]

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

/** Índice del último paso que ya ha empezado. */
const pasoEn = (frame, inicios) => {
  let i = 0
  inicios.forEach((at, k) => {
    if (frame >= at) i = k
  })
  return i
}

/** Color en este fotograma: cada paso mezcla, con muelle, desde el anterior. */
function colorEn(frame, fps, campo) {
  let color = PALETAS[0][campo]
  for (let i = 1; i < PASOS_COLOR.length; i++) {
    const p = spring({ frame: frame - PASOS_COLOR[i], fps, config: MUELLE.suave, durationInFrames: 12 })
    color = interpolateColors(p, [0, 1], [color, PALETAS[i][campo]])
  }
  return color
}

/** Caja de la tarjeta `i`: se encadenan las recolocaciones, escalonadas. */
function cajaEn(i, frame, fps) {
  let caja = PASOS_VARIANTE[0].cajas[i]
  for (let k = 1; k < PASOS_VARIANTE.length; k++) {
    const destino = PASOS_VARIANTE[k].cajas[i]
    const p = spring({ frame: frame - PASOS_VARIANTE[k].at - i * 3, fps, config: MUELLE.vivo })
    caja = {
      x: caja.x + (destino.x - caja.x) * p,
      y: caja.y + (destino.y - caja.y) * p,
      w: caja.w + (destino.w - caja.w) * p,
      h: caja.h + (destino.h - caja.h) * p,
    }
  }
  return caja
}

// ------------------------------------------------------------

const Barra = ({ w, h = 14, color = '#dcdcd7', style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: color, ...style }} />
)

const Tarjeta = ({ caja, acento, tinte }) => (
  <div
    style={{
      position: 'absolute',
      left: caja.x,
      top: caja.y,
      width: caja.w,
      height: caja.h,
      overflow: 'hidden',
      background: FONDO,
      border: `2px solid ${LINEA}`,
      borderRadius: 24,
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 22,
        top: 22,
        width: 48,
        height: 48,
        borderRadius: 14,
        background: tinte,
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 9, background: acento }} />
    </div>
    <Barra w="62%" style={{ position: 'absolute', left: 22, top: 88 }} color="#cfcfca" />
    <Barra w="82%" h={10} style={{ position: 'absolute', left: 22, top: 110 }} color="#e6e6e2" />
  </div>
)

// ------------------------------------------------------------

export const Demo = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const acento = colorEn(frame, fps, 'hex')
  const tinte = colorEn(frame, fps, 'tinte')
  const iColor = pasoEn(frame, PASOS_COLOR)

  const iTipo = pasoEn(frame, PASOS_TIPO.map((p) => p.at))
  const tipo = PASOS_TIPO[iTipo]
  const enTipo = frame >= FIN_COLOR
  const golpeTitulo = spring({
    frame: frame - (enTipo ? tipo.at : PASOS_COLOR[iColor]),
    fps,
    config: MUELLE.pop,
  })

  const iVariante = pasoEn(frame, PASOS_VARIANTE.map((p) => p.at))

  // La web entra desde abajo mientras termina la transición de la escena 1.
  const entrada = spring({ frame: frame - 4, fps, config: MUELLE.vivo })

  return (
    <AbsoluteFill style={{ background: FONDO_ALT, fontFamily: SANS }}>
      {/* ---------- etiquetas ---------- */}
      <Etiqueta desde={8} hasta={FIN_COLOR}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            background: acento,
            boxShadow: `0 0 0 6px ${tinte}`,
          }}
        />
        Color principal
        <Valor key={iColor} desde={PASOS_COLOR[iColor]}>
          {PALETAS[iColor].hex}
        </Valor>
      </Etiqueta>

      <Etiqueta desde={FIN_COLOR} hasta={FIN_TIPO}>
        <span
          style={{
            width: 52,
            textAlign: 'center',
            fontFamily: tipo.fuente,
            fontWeight: tipo.peso,
            fontSize: 40,
          }}
        >
          Aa
        </span>
        Tipografía
        <Valor key={iTipo} desde={tipo.at}>
          {tipo.nombre}
        </Valor>
      </Etiqueta>

      <Etiqueta desde={FIN_TIPO}>
        <div
          style={{
            width: 52,
            height: 52,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
            padding: 6,
          }}
        >
          {[0, 1, 2, 3].map((k) => (
            <div key={k} style={{ borderRadius: 4, background: k === 0 ? acento : '#cfcfca' }} />
          ))}
        </div>
        Variantes preestablecidas
        <Valor key={iVariante} desde={PASOS_VARIANTE[iVariante].at}>
          {PASOS_VARIANTE[iVariante].nombre}
        </Valor>
      </Etiqueta>

      {/* ---------- la web ---------- */}
      <div
        style={{
          position: 'absolute',
          top: 420,
          left: 130,
          width: 820,
          height: 1064,
          padding: 44,
          boxSizing: 'border-box',
          background: FONDO,
          borderRadius: 44,
          border: `2px solid ${LINEA}`,
          boxShadow: '0 40px 90px -40px rgba(22,23,27,0.35)',
          opacity: interpolate(entrada, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${(1 - entrada) * 160}px) scale(${interpolate(entrada, [0, 1], [0.92, 1])})`,
        }}
      >
        {/* cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: 64 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: acento }} />
          <Barra w={120} h={16} color="#cfcfca" />
          <div style={{ flex: 1 }} />
          <Barra w={64} h={12} />
          <Barra w={64} h={12} />
          <div
            style={{
              width: 128,
              height: 48,
              borderRadius: 24,
              background: acento,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Barra w={64} h={10} color="rgba(255,255,255,0.85)" />
          </div>
        </div>

        {/* portada */}
        <div style={{ marginTop: 44 }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: 999,
              background: tinte,
              color: acento,
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Nuevo
          </div>

          <div
            style={{
              height: 176,
              marginTop: 18,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: enTipo ? tipo.fuente : SANS,
                fontWeight: enTipo ? tipo.peso : 700,
                letterSpacing: enTipo ? tipo.tracking : '-0.04em',
                fontSize: 76,
                lineHeight: 1.06,
                color: TINTA,
                transform: `scale(${interpolate(golpeTitulo, [0, 1], [0.95, 1])})`,
                transformOrigin: 'left center',
              }}
            >
              {enTipo ? 'Cambia la tipografía' : 'Tu web, a tu manera'}
            </div>
          </div>

          <Barra w="88%" style={{ marginTop: 18 }} />
          <Barra w="64%" style={{ marginTop: 14 }} />

          <div style={{ display: 'flex', gap: 18, marginTop: 36 }}>
            <div
              style={{
                padding: '0 40px',
                height: 76,
                borderRadius: 38,
                background: acento,
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 30,
                fontWeight: 600,
              }}
            >
              Empezar
            </div>
            <div
              style={{
                padding: '0 36px',
                height: 76,
                borderRadius: 38,
                border: `2px solid ${LINEA}`,
                color: TINTA,
                display: 'grid',
                placeItems: 'center',
                fontSize: 30,
                fontWeight: 600,
              }}
            >
              Saber más
            </div>
          </div>
        </div>

        {/* secciones */}
        <div style={{ position: 'relative', height: 400, marginTop: 40 }}>
          {[0, 1, 2].map((i) => (
            <Tarjeta key={i} caja={cajaEn(i, frame, fps)} acento={acento} tinte={tinte} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
