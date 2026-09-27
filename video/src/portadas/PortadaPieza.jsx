import { AbsoluteFill } from 'remotion'
import { Diapositiva } from '../carrusel/Diapositiva'
import { resolverCarrusel } from '../carrusel/plantillas'
import { CARRUSEL, REEL } from '../diseno/formatos'
import { tema as temaDe } from '../diseno/temas'
import { resolverReel } from '../motor/resolver'
import { PortadaReel } from './PortadaReel'

// ============================================================
// LA PORTADA DE UNA PIEZA
//
//   carrusel  su primera diapositiva: la portada ES el carrusel
//   reel      PortadaReel: siempre la misma disposición (gancho, la web en
//             una pila de versiones y la pastilla); solo cambia el tema
//
// Es lo que se sube como portada del reel y lo que pinta el feed.
// ============================================================

export const tamanoPortada = (formato) => (formato === 'reel' ? REEL : CARRUSEL)

const dos = (n) => String(n).padStart(2, '0')

export function PortadaPieza({ formato, props, visual, serie, pilar, pastilla }) {
  if (formato === 'carrusel') {
    const diapositivas = resolverCarrusel(props.carrusel, { visual, serie })
    return <Diapositiva d={diapositivas[0]} indice={0} total={diapositivas.length} />
  }
  const resuelto = resolverReel(props)
  return (
    <PortadaReel
      resuelto={resuelto}
      tema={temaDe(visual.tema)}
      serie={serie ? `${serie.nombre} · ${dos(serie.numero)}` : pilar}
      variante={visual.portada}
      pastilla={pastilla}
    />
  )
}

/** Como composición suelta (Portada-<id>): ocupa todo el lienzo. */
export function PortadaComposicion(p) {
  return (
    <AbsoluteFill>
      <PortadaPieza {...p} />
    </AbsoluteFill>
  )
}
