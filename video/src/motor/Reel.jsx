import { AbsoluteFill } from 'remotion'
import { springTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { Cierre } from '../escenas/Cierre'
import { MUELLE } from '../marca'
import { BarraProgreso } from '../plantilla/PlantillaReel'
import { EscenaGancho } from '../plantilla/EscenaGancho'
import { EscenaVariantes } from './EscenaVariantes'
import { TIEMPOS, resolverReel } from './resolver'

// ============================================================
// LA COMPOSICIÓN DEL MOTOR DE REELS — una sola para todos
//
//   gancho → variantes (la web real transformándose) → cierre
//
// Con el mismo acabado que el vídeo de marca. Recibe el reel en datos por
// props (lo que hay en video/reels/*.json) y `calculateMetadata` lo resuelve
// antes de renderizar: elige variantes si son "auto", calcula los configs y
// fija la duración. Cambiar de negocio, de plantilla o de variantes no toca
// este archivo.
// ============================================================

const cruce = springTiming({ config: MUELLE.suave, durationInFrames: TIEMPOS.cruce })

export const calcularReel = ({ props }) => {
  const resuelto = resolverReel(props)
  return { durationInFrames: resuelto.duracion, props: { ...props, resuelto } }
}

export function Reel({ resuelto }) {
  if (!resuelto) return null
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={TIEMPOS.gancho}>
          <EscenaGancho texto={resuelto.gancho} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={resuelto.demo}>
          <EscenaVariantes resuelto={resuelto} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={cruce} />
        <TransitionSeries.Sequence durationInFrames={TIEMPOS.cierre}>
          <Cierre linea1={resuelto.pregunta} linea2="Diséñala tú. Yo la construyo." />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <BarraProgreso />
    </AbsoluteFill>
  )
}
