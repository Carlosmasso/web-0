import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Palabras } from '../componentes/Palabras'
import { TIPO_REEL } from '../diseno/formatos'
import { fondoDe } from '../diseno/temas'

// Escena 1: el gancho. El fondo del tema con su halo y una frase grande que
// entra palabra a palabra, igual que la apertura del intro.
export function EscenaGancho({ texto, tema }) {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: tema.fondo, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill
        style={{
          background: fondoDe(tema),
          opacity: interpolate(frame, [0, 40], [0.4, 1], { extrapolateRight: 'clamp' }),
        }}
      />
      <Palabras texto={texto} color={tema.texto} acento={tema.acento} tamano={TIPO_REEL.gancho} ancho={880} />
    </AbsoluteFill>
  )
}
