import { springTiming, TransitionSeries } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { slide } from '@remotion/transitions/slide'
import { Cierre } from './escenas/Cierre'
import { Demo } from './escenas/Demo'
import { Problema } from './escenas/Problema'
import { MUELLE } from './marca'

// Las transiciones se solapan con las escenas que unen, así que las duraciones
// suman 480 y el vídeo dura 450 (dos cruces de 15). Cada cruce cae centrado en
// su corte: 4 s y 11 s.
export const DURACION = { problema: 127, demo: 225, cierre: 128, cruce: 15 }

const cruce = springTiming({ config: MUELLE.suave, durationInFrames: DURACION.cruce })

export const IntroMaketa = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={DURACION.problema}>
      <Problema />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={cruce} />
    <TransitionSeries.Sequence durationInFrames={DURACION.demo}>
      <Demo />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={cruce} />
    <TransitionSeries.Sequence durationInFrames={DURACION.cierre}>
      <Cierre />
    </TransitionSeries.Sequence>
  </TransitionSeries>
)
