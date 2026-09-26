import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { ACENTO, ACENTO_CLARO, TINTA } from '../marca'
import { Palabras } from './Palabras'

// Escena 1: el gancho. Fondo tinta con el halo del acento y una frase grande
// que entra palabra a palabra, igual que la apertura del intro.
export function EscenaGancho({ texto }) {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: TINTA, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${ACENTO}33 0%, transparent 55%)`,
          opacity: interpolate(frame, [0, 40], [0.4, 1], { extrapolateRight: 'clamp' }),
        }}
      />
      <Palabras texto={texto} color="#fff" acento={ACENTO_CLARO} tamano={104} ancho={880} />
    </AbsoluteFill>
  )
}
