import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { SANS } from '../fuentes'
import { Marca } from '../Logo'
import { ACENTO, ACENTO_CLARO, MUELLE, TINTA } from '../marca'

// Escena 1 (0-4 s): el problema, tachado, y la presentación.

const FRASE = ['Crear', 'una', 'landing', 'page', 'no', 'debería', 'tomar', 'días.']
const TACHADO = 40 // "días." se tacha cuando la frase ya se ha leído
const SALIDA = 64
const PRESENTAMOS = 74

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

export const Problema = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const tachado = spring({ frame: frame - TACHADO, fps, config: MUELLE.suave, durationInFrames: 14 })
  const salida = spring({ frame: frame - SALIDA, fps, config: MUELLE.suave, durationInFrames: 16 })
  const intro = spring({ frame: frame - PRESENTAMOS, fps, config: MUELLE.suave, durationInFrames: 18 })
  const marca = spring({ frame: frame - PRESENTAMOS - 6, fps, config: MUELLE.vivo })
  const colocado = spring({ frame: frame - PRESENTAMOS - 18, fps, config: MUELLE.pop })

  return (
    <AbsoluteFill
      style={{ background: TINTA, fontFamily: SANS, justifyContent: 'center', alignItems: 'center' }}
    >
      {/* Un halo del acento, casi imperceptible, para que el negro no sea plano. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, ${ACENTO}33 0%, transparent 55%)`,
          opacity: interpolate(frame, [0, 40], [0.4, 1], clamp),
        }}
      />

      {salida < 0.999 && (
        <div
          style={{
            position: 'absolute',
            width: 880,
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 28,
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            color: '#fff',
            opacity: 1 - salida,
            transform: `translateY(${-140 * salida}px)`,
          }}
        >
          {FRASE.map((palabra, i) => {
            const e = spring({ frame: frame - 4 - i * 3, fps, config: MUELLE.vivo })
            const esDias = i === FRASE.length - 1
            return (
              <span
                key={i}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  color: esDias ? ACENTO_CLARO : undefined,
                  opacity: interpolate(e, [0, 0.6], [0, 1], clamp),
                  transform: `translateY(${(1 - e) * 70}px)`,
                  filter: `blur(${Math.max(0, 1 - e) * 10}px)`,
                }}
              >
                {palabra}
                {esDias && (
                  <span
                    style={{
                      position: 'absolute',
                      left: -8,
                      right: -8,
                      top: '52%',
                      height: 10,
                      borderRadius: 5,
                      background: '#fff',
                      transform: `scaleX(${tachado})`,
                      transformOrigin: 'left center',
                    }}
                  />
                )}
              </span>
            )
          })}
        </div>
      )}

      {frame >= PRESENTAMOS && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 44,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: 'rgba(255,255,255,0.62)',
              opacity: intro,
              transform: `translateY(${(1 - intro) * 30}px)`,
            }}
          >
            Presentamos
          </div>
          <div
            style={{
              opacity: interpolate(marca, [0, 0.5], [0, 1], clamp),
              transform: `translateY(${(1 - marca) * 60}px) scale(${interpolate(marca, [0, 1], [0.86, 1])})`,
            }}
          >
            <Marca tamano={132} tema="oscuro" colocado={colocado} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  )
}
