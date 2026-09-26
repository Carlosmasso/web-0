import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { ACENTO } from '../marca'

/** Una línea fina arriba que se llena de forma lineal en todo el vídeo. */
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
