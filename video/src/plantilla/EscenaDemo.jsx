import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { Etiqueta, Valor } from '../escenas/Demo'
import { SANS } from '../fuentes'
import { ACENTO, FONDO_ALT, LINEA, TINTA } from '../marca'
import { Palabras } from './Palabras'
import { Pantalla } from './Pantallas'
import { Tarjeta } from './Tarjeta'
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
  const grupos = pantalla.tipo === 'web' ? gruposDe(pantalla.cambios ?? []) : []

  return (
    <AbsoluteFill style={{ background: FONDO_ALT, fontFamily: SANS }}>
      {grupos.map((g) => (
        <Pastilla key={g.desde} grupo={g} />
      ))}

      <Tarjeta arriba={TARJETA.arriba} ancho={TARJETA.ancho} alto={TARJETA.alto}>
        <Pantalla
          pantalla={pantalla}
          ancho={TARJETA.ancho / TARJETA.escala}
          alto={TARJETA.alto / TARJETA.escala}
          escala={TARJETA.escala}
        />
      </Tarjeta>

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
