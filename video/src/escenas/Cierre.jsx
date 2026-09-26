import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { SANS } from '../fuentes'
import { Marca } from '../Logo'
import { ACENTO, FONDO, MUELLE, TINTA, TINTA_SUAVE } from '../marca'

// Escena 3 (11-15 s): la marca en grande y el modelo en una línea. El cliente
// diseña; la web la monta Carlos (PLAN.md: nada de autoservicio). Por eso el
// cierre no promete "lánzala en minutos".

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

// Las dos líneas se pueden cambiar por props. Por defecto, en primera persona,
// la misma voz que la landing ("Diseña tu web tú mismo. Yo la construyo."):
// detrás hay una persona, no una empresa.
export const Cierre = ({ linea1 = 'Diséñala tú.', linea2 = 'Yo la construyo.' }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const marca = spring({ frame: frame - 4, fps, config: MUELLE.vivo })
  const colocado = spring({ frame: frame - 20, fps, config: MUELLE.pop })
  const parte1 = spring({ frame: frame - 28, fps, config: MUELLE.vivo })
  const parte2 = spring({ frame: frame - 36, fps, config: MUELLE.vivo })
  const subrayado = spring({ frame: frame - 48, fps, config: MUELLE.suave, durationInFrames: 18 })

  const entrar = (e) => ({
    display: 'inline-block',
    opacity: interpolate(e, [0, 0.6], [0, 1], clamp),
    transform: `translateY(${(1 - e) * 36}px)`,
  })

  return (
    <AbsoluteFill
      style={{
        background: FONDO,
        fontFamily: SANS,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 64,
      }}
    >
      <div
        style={{
          opacity: interpolate(marca, [0, 0.5], [0, 1], clamp),
          transform: `scale(${interpolate(marca, [0, 1], [0.8, 1])})`,
        }}
      >
        <Marca tamano={140} colocado={colocado} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
        }}
      >
        <span style={{ ...entrar(parte1), color: TINTA_SUAVE }}>{linea1}</span>
        <span style={{ ...entrar(parte2), position: 'relative', color: TINTA }}>
          {linea2}
          <span
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -10,
              height: 8,
              borderRadius: 4,
              background: ACENTO,
              transform: `scaleX(${subrayado})`,
              transformOrigin: 'left center',
            }}
          />
        </span>
      </div>
    </AbsoluteFill>
  )
}
