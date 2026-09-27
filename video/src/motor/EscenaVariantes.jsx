import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { clamp, progreso } from '../diseno/animaciones'
import { Etiqueta, Valor } from '../componentes/Etiqueta'
import { SANS } from '../diseno/fuentes'
import { TIPO_REEL } from '../diseno/formatos'
import { layoutReel } from '../diseno/layouts'
import { ACENTO, LINEA, MUELLE } from '../diseno/marca'
import { antetitulo } from '../diseno/texto'
import { fondoDe } from '../diseno/temas'
import { Palabras } from '../componentes/Palabras'
import { Tarjeta } from '../componentes/Tarjeta'
import { WebEnCambio } from './WebEnCambio'

// ============================================================
// Escena 2 del motor: las variantes, una tras otra
//
//   pastilla   arriba: qué variable cambia ("Color principal") y su valor
//   tarjeta    la web real del negocio, transformándose
//   nombre     debajo, grande: cómo se llama la variante que está en pantalla
//   puntos     en qué variante vamos, de cuántas
//
// El protagonista es el cambio: todo lo demás se queda quieto. Dónde va cada
// cosa lo dice el layout (diseno/layouts.js); los colores, el tema.
// ============================================================

// El nombre de la variante va siempre en UNA línea: con dos ejes ("Glassmorfismo
// · Space Grotesk") a 62 px no cabe y la segunda línea pisaría los puntos.
const ANCHO_NOMBRE = 960
const tamanoNombre = (titulo) => Math.min(TIPO_REEL.nombre, Math.floor(ANCHO_NOMBRE / (titulo.length * 0.56)))

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

function Puntos({ pasos, k, tema }) {
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
              background: i <= k ? (paso.muestras[0] && paso.valor ? paso.muestras[0] : tema.oscuro ? tema.acento : ACENTO) : tema.linea,
              opacity: i < k ? 0.45 : 1,
            }}
          />
        )
      })}
    </div>
  )
}

export function EscenaVariantes({ resuelto, tema, layout }) {
  const frame = useCurrentFrame()
  const { pasos, contenido, movimiento, nombreEje, demo, gancho } = resuelto
  const L = layoutReel(layout)
  const T = L.tarjeta
  const k = pasos.findLastIndex((p) => p.frame <= frame)
  const paso = pasos[k]
  const contador = pasos.length > 1 ? `${String(k + 1).padStart(2, '0')} / ${String(pasos.length).padStart(2, '0')}` : null

  return (
    <AbsoluteFill style={{ background: fondoDe(tema, '50% 30%'), fontFamily: SANS }}>
      {L.pastilla ? (
        <Etiqueta desde={6}>
          {paso.muestras.length ? <Muestras colores={paso.muestras} /> : null}
          {nombreEje}
          <Valor key={k} desde={paso.frame}>
            {paso.valor ?? contador}
          </Valor>
        </Etiqueta>
      ) : (
        // Sin pastilla, la variable va como antetítulo: "COLOR PRINCIPAL · 02 / 05".
        <div style={{ position: 'absolute', top: L.antetitulo, left: 0, right: 0, textAlign: 'center' }}>
          <span style={antetitulo(28, tema.acento)}>
            {nombreEje}
            {paso.valor ?? contador ? ` · ${paso.valor ?? contador}` : ''}
          </span>
        </div>
      )}

      {L.titular != null ? (
        <div style={{ position: 'absolute', top: L.titular, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <Palabras texto={gancho} color={tema.texto} acento={tema.acento} tamano={TIPO_REEL.frase} ancho={900} alinear="center" />
        </div>
      ) : null}

      <Tarjeta arriba={T.arriba} ancho={T.ancho} alto={T.alto}>
        <WebEnCambio
          pasos={pasos}
          contenido={contenido}
          movimiento={movimiento}
          ancho={T.ancho / T.escala}
          alto={T.alto / T.escala}
          escala={T.escala}
        />
      </Tarjeta>

      {/* El nombre de la variante: entra con cada cambio y se va antes del siguiente. */}
      <div style={{ position: 'absolute', top: L.nombre, left: 0, right: 0 }}>
        {pasos.map((pa, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <Palabras
              texto={`*${pa.titulo}*`}
              desde={Math.max(8, pa.frame)}
              hasta={pasos[i + 1]?.frame ?? demo + 20}
              color={tema.texto}
              acento={tema.texto}
              tamano={tamanoNombre(pa.titulo)}
              ancho={ANCHO_NOMBRE}
              alinear="center"
            />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: L.puntos, left: 0, right: 0 }}>
        {pasos.length > 1 ? <Puntos pasos={pasos} k={k} tema={tema} /> : null}
      </div>
    </AbsoluteFill>
  )
}
