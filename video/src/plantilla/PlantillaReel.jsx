import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { springTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { Cierre } from '../escenas/Cierre'
import { ACENTO, MUELLE } from '../marca'
import { EscenaDemo } from './EscenaDemo'
import { EscenaGancho } from './EscenaGancho'

// ============================================================
// LA PLANTILLA DE LOS REELS — 1080x1920, 30 fps, 15 s (450 fotogramas)
//
// La misma estructura y el mismo acabado que el vídeo de marca (IntroMaketa):
//
//   gancho     fondo tinta, una frase grande palabra a palabra      100 f
//   demo       la web real en una tarjeta que se transforma,        290 f
//              con una pastilla que dice qué cambia y una frase
//   cierre     la marca y "Diséñala tú. Yo la construyo."       90 f
//
// Entre escenas, el mismo deslizamiento y el mismo fundido que el intro (15 f
// cada uno, solapados: 100 + 290 + 90 − 30 = 450).
//
// Para un reel nuevo no se toca este archivo: todo llega por props (ver
// ejemplo.js, o scripts/social/lib/formatos.mjs para los de la cola).
// ============================================================

export const DURACION = 450
const TIEMPOS = { gancho: 100, demo: 290, cierre: 90, cruce: 15 }
const cruce = springTiming({ config: MUELLE.suave, durationInFrames: TIEMPOS.cruce })

/** Barra de progreso: una línea fina arriba que se llena de forma lineal. */
export function BarraProgreso() {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const lleno = interpolate(frame, [0, durationInFrames - 1], [0, 100], { extrapolateRight: 'clamp' })
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'rgba(128,128,128,0.18)' }}>
      <div style={{ width: `${lleno}%`, height: '100%', background: ACENTO }} />
    </div>
  )
}

/**
 * @param gancho   frase de la escena 1; *así* va en el color de acento
 * @param pantalla lo que va en la tarjeta (ver Pantallas.jsx)
 * @param frases   [desde, hasta, 'texto'] bajo la tarjeta, en fotogramas de la demo
 * @param cierre   { linea1, linea2 } si se quieren otras que las del intro
 */
export function PlantillaReel({ gancho, pantalla, frases = [], cierre = {} }) {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={TIEMPOS.gancho}>
          <EscenaGancho texto={gancho} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={TIEMPOS.demo}>
          <EscenaDemo pantalla={pantalla} frases={frases} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={TIEMPOS.cierre}>
          <Cierre {...cierre} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BarraProgreso />
    </AbsoluteFill>
  )
}
