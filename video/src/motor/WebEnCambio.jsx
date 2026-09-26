import { useMemo } from 'react'
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion'
import { setIn } from '../../../src/config/patch'
import { barrido, clamp, mezclarConfig, progreso } from '../animaciones'
import { Escenario } from '../componentes/Escenario'

// ============================================================
// LA WEB REAL, PASANDO DE UNA VARIANTE A OTRA
//
// Dos transiciones, según lo que cambie:
//
//   morph    el color: la paleta se interpola fotograma a fotograma y la web
//            entera (botones, fondos, sombras, contraste) se transforma en su
//            sitio. Una sola capa: no hay nada que fundir.
//   barrido  lo discreto (preset, estilo, tipografía): la variante nueva se
//            pinta de arriba abajo sobre la anterior, con una línea de luz en
//            el borde. Se ve que el contenido es el mismo y cambia el acabado.
//
// Y el movimiento, si la plantilla lo tiene: el titular se teclea letra a
// letra, o la página se desplaza de arriba abajo.
// ============================================================

const DURACION = { morph: 16, barrido: 18 }

/** El contenido y el desplazamiento de este fotograma, según el movimiento. */
function useMovimiento(movimiento, contenido) {
  const frame = useCurrentFrame()
  const tramo = movimiento ? [movimiento.desde, movimiento.hasta] : [0, 1]
  const letras =
    movimiento?.tipo === 'titular'
      ? Math.round(interpolate(frame, tramo, [0, movimiento.texto.length], clamp))
      : null
  const escrito = useMemo(
    () => (letras == null ? contenido : setIn(contenido, 'hero.title', movimiento.texto.slice(0, letras))),
    [contenido, letras, movimiento],
  )
  const scroll =
    movimiento?.tipo === 'recorrido'
      ? interpolate(frame, tramo, [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
      : 0
  return { contenido: escrito, scroll }
}

export function WebEnCambio({ pasos, contenido: base, movimiento, ancho, alto, escala }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const todos = { configs: pasos.map((p) => p.config), contenidos: [base] }
  const { contenido, scroll } = useMovimiento(movimiento, base)

  const k = pasos.findLastIndex((p) => p.frame <= frame)
  const actual = pasos[k]
  const previo = pasos[Math.max(0, k - 1)]
  const p = k === 0 ? 1 : progreso(frame, fps, actual.frame, undefined, DURACION[actual.transicion])
  const comun = { contenido, todos, scroll, ancho, alto, escala }

  if (actual.transicion === 'morph') {
    // La capa de abajo no se ve; se mantiene montada para no recargar el iframe.
    return (
      <>
        <AbsoluteFill style={{ opacity: 0 }}>
          <Escenario config={previo.config} {...comun} />
        </AbsoluteFill>
        <AbsoluteFill>
          <Escenario config={p >= 1 ? actual.config : mezclarConfig(previo.config, actual.config, p)} {...comun} />
        </AbsoluteFill>
      </>
    )
  }

  return (
    <>
      <AbsoluteFill>
        <Escenario config={previo.config} {...comun} />
      </AbsoluteFill>
      <AbsoluteFill style={barrido(p)}>
        <Escenario config={actual.config} {...comun} />
      </AbsoluteFill>
      {p > 0 && p < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${p * 100}%`,
            height: 4,
            marginTop: -2,
            background: '#fff',
            boxShadow: '0 0 24px 6px rgba(255,255,255,0.7)',
            opacity: interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0], clamp),
          }}
        />
      ) : null}
    </>
  )
}
