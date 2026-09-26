import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { clamp, progreso } from '../animaciones'
import { Etiqueta, Valor } from '../escenas/Demo'
import { SANS } from '../fuentes'
import { ACENTO, FONDO_ALT, LINEA, MUELLE, TINTA } from '../marca'
import { Palabras } from '../plantilla/Palabras'
import { Tarjeta } from '../plantilla/Tarjeta'
import { WebEnCambio } from './WebEnCambio'

// ============================================================
// Escena 2 del motor: las variantes, una tras otra
//
//   pastilla   arriba: qué variable cambia ("Color principal") y su valor
//   tarjeta    la web real del negocio, transformándose
//   nombre     debajo, grande: cómo se llama la variante que está en pantalla
//   puntos     en qué variante vamos, de cuántas
//
// El protagonista es el cambio: todo lo demás se queda quieto.
// ============================================================

const TARJETA = { arriba: 390, ancho: 820, alto: 900, escala: 2 }

// El nombre de la variante va siempre en UNA línea: con dos ejes ("Glassmorfismo
// · Space Grotesk") a 62 px no cabe y la segunda línea pisaría los puntos.
const ANCHO_NOMBRE = 960
const tamanoNombre = (titulo) => Math.min(62, Math.floor(ANCHO_NOMBRE / (titulo.length * 0.56)))

function Muestras({ colores }) {
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

function Puntos({ pasos, k }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = progreso(frame, fps, pasos[k].frame, MUELLE.vivo)
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
      {pasos.map((paso, i) => {
        const activo = i === k
        const ancho = activo ? interpolate(p, [0, 1], [14, 44], clamp) : 14
        return (
          <div
            key={i}
            style={{
              width: ancho,
              height: 14,
              borderRadius: 7,
              background: i <= k ? (paso.muestras[0] && paso.valor ? paso.muestras[0] : ACENTO) : '#d6d6d1',
              opacity: i < k ? 0.45 : 1,
            }}
          />
        )
      })}
    </div>
  )
}

export function EscenaVariantes({ resuelto }) {
  const frame = useCurrentFrame()
  const { pasos, contenido, nombreEje, demo } = resuelto
  const k = pasos.findLastIndex((p) => p.frame <= frame)
  const paso = pasos[k]

  return (
    <AbsoluteFill style={{ background: FONDO_ALT, fontFamily: SANS }}>
      <Etiqueta desde={6}>
        {paso.muestras.length ? <Muestras colores={paso.muestras} /> : null}
        {nombreEje}
        <Valor key={k} desde={paso.frame}>
          {paso.valor ?? `${String(k + 1).padStart(2, '0')} / ${String(pasos.length).padStart(2, '0')}`}
        </Valor>
      </Etiqueta>

      <Tarjeta arriba={TARJETA.arriba} ancho={TARJETA.ancho} alto={TARJETA.alto}>
        <WebEnCambio
          pasos={pasos}
          contenido={contenido}
          ancho={TARJETA.ancho / TARJETA.escala}
          alto={TARJETA.alto / TARJETA.escala}
          escala={TARJETA.escala}
        />
      </Tarjeta>

      {/* El nombre de la variante: entra con cada cambio y se va antes del siguiente. */}
      <div style={{ position: 'absolute', top: TARJETA.arriba + TARJETA.alto + 30, left: 0, right: 0 }}>
        {pasos.map((pa, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <Palabras
              texto={`*${pa.titulo}*`}
              desde={Math.max(8, pa.frame)}
              hasta={pasos[i + 1]?.frame ?? demo + 20}
              color={TINTA}
              acento={TINTA}
              tamano={tamanoNombre(pa.titulo)}
              ancho={ANCHO_NOMBRE}
              alinear="center"
            />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: TARJETA.arriba + TARJETA.alto + 118, left: 0, right: 0 }}>
        <Puntos pasos={pasos} k={k} />
      </div>
    </AbsoluteFill>
  )
}
