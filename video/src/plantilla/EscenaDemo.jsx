import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { Etiqueta, Valor } from '../escenas/Demo'
import { SANS } from '../fuentes'
import { ACENTO, FONDO, FONDO_ALT, LINEA, MUELLE, TINTA } from '../marca'
import { Palabras } from './Palabras'
import { Pantalla } from './Pantallas'
import { gruposDe } from './web'

// ============================================================
// Escena 2: la demostración, con la misma composición que la del intro
//
//   pastilla   arriba: qué se está cambiando y su valor
//   tarjeta    la web real, que se transforma en su sitio
//   frase      debajo, una línea que cuenta lo que se ve
//
// Los fotogramas de `cambios` y `frases` son LOCALES de esta escena (0 = el
// momento en que empieza a entrar).
// ============================================================

// La tarjeta: 820 x 960, la web dentro a 410 px de ancho (un teléfono) x2.
const TARJETA = { arriba: 400, ancho: 820, alto: 960, escala: 2 }
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

const Icono = ({ grupo, paso }) => {
  if (grupo.tipo === 'color') {
    return <div style={{ width: 52, height: 52, borderRadius: 26, background: paso?.color ?? LINEA }} />
  }
  const letra = { tipografia: 'Aa', titular: 'Tt', scroll: '↕' }[grupo.tipo]
  if (letra) {
    return <span style={{ width: 52, textAlign: 'center', fontSize: 38, fontWeight: 700 }}>{letra}</span>
  }
  // estilo y portada: la rejilla del intro
  return (
    <div style={{ width: 52, height: 52, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: 6 }}>
      {[0, 1, 2, 3].map((k) => (
        <div key={k} style={{ borderRadius: 4, background: k === 0 ? ACENTO : '#cfcfca' }} />
      ))}
    </div>
  )
}

function Pastilla({ grupo }) {
  const frame = useCurrentFrame()
  const paso = grupo.pasos.filter((p) => p.frame <= frame).at(-1)
  return (
    <Etiqueta desde={Math.max(6, grupo.desde - 10)} hasta={grupo.hasta}>
      <Icono grupo={grupo} paso={paso} />
      {grupo.pasos[0].etiqueta}
      {paso?.valor ? (
        <Valor key={paso.frame} desde={paso.frame}>
          {paso.valor}
        </Valor>
      ) : null}
    </Etiqueta>
  )
}

export function EscenaDemo({ pantalla, frases = [] }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const entrada = spring({ frame: frame - 4, fps, config: MUELLE.vivo })
  const grupos = pantalla.tipo === 'web' ? gruposDe(pantalla.cambios ?? []) : []

  return (
    <AbsoluteFill style={{ background: FONDO_ALT, fontFamily: SANS }}>
      {grupos.map((g) => (
        <Pastilla key={g.desde} grupo={g} />
      ))}

      <div
        style={{
          position: 'absolute',
          top: TARJETA.arriba,
          left: (1080 - TARJETA.ancho) / 2,
          width: TARJETA.ancho,
          height: TARJETA.alto,
          overflow: 'hidden',
          background: FONDO,
          borderRadius: 44,
          border: `2px solid ${LINEA}`,
          boxShadow: '0 40px 90px -40px rgba(22,23,27,0.35)',
          opacity: interpolate(entrada, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${(1 - entrada) * 160}px) scale(${interpolate(entrada, [0, 1], [0.92, 1])})`,
        }}
      >
        <Pantalla
          pantalla={pantalla}
          ancho={TARJETA.ancho / TARJETA.escala}
          alto={TARJETA.alto / TARJETA.escala}
          escala={TARJETA.escala}
        />
      </div>

      {/* La frase va entre la tarjeta y la franja que tapa la interfaz de Instagram. */}
      <div
        style={{
          position: 'absolute',
          top: TARJETA.arriba + TARJETA.alto + 34,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {frases.map(([desde, hasta, texto]) => (
          <div key={desde} style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <Palabras
              texto={texto}
              desde={desde}
              hasta={hasta}
              color={TINTA}
              acento={ACENTO}
              tamano={54}
              ancho={900}
              alinear="center"
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
