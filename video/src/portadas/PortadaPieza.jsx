import { AbsoluteFill } from 'remotion'
import { Escenario } from '../componentes/Escenario'
import { Diapositiva } from '../carrusel/Diapositiva'
import { resolverCarrusel } from '../carrusel/plantillas'
import { CARRUSEL, REEL } from '../diseno/formatos'
import { FONDO, LINEA } from '../diseno/marca'
import { tema as temaDe } from '../diseno/temas'
import { resolverReel } from '../motor/resolver'
import { Portada } from './Portada'

// ============================================================
// LA PORTADA DE UNA PIEZA
//
//   carrusel  su primera diapositiva: la portada ES el carrusel
//   reel      la Portada en 9:16 con el gancho del reel; en el layout A,
//             la web real del negocio en su tarjeta, en su primer estado
//
// Es lo que se sube como portada del reel y lo que pinta el feed.
// ============================================================

export const tamanoPortada = (formato) => (formato === 'reel' ? REEL : CARRUSEL)

/** La web del negocio, fija, en la tarjeta del intro. */
function WebFija({ resuelto }) {
  const T = { ancho: 760, alto: 600, escala: 1.9 } // cabe con un gancho de tres líneas
  const primero = resuelto.pasos[0].config
  const todos = { configs: [primero], contenidos: [resuelto.contenido] }
  return (
    <div
      style={{
        position: 'relative',
        width: T.ancho,
        height: T.alto,
        margin: '0 auto',
        overflow: 'hidden',
        background: FONDO,
        borderRadius: 40,
        border: `2px solid ${LINEA}`,
        boxShadow: '0 40px 90px -40px rgba(22,23,27,0.45)',
      }}
    >
      <Escenario config={primero} contenido={resuelto.contenido} todos={todos} ancho={T.ancho / T.escala} alto={T.alto / T.escala} escala={T.escala} />
    </div>
  )
}

const dos = (n) => String(n).padStart(2, '0')

export function PortadaPieza({ formato, props, visual, serie, numero, pilar }) {
  if (formato === 'carrusel') {
    const diapositivas = resolverCarrusel(props.carrusel, { visual, serie })
    return <Diapositiva d={diapositivas[0]} indice={0} total={diapositivas.length} />
  }
  const resuelto = resolverReel(props)
  return (
    <Portada
      formato="reel"
      tema={temaDe(visual.tema)}
      layout={visual.layout}
      antetitulo={serie ? `${serie.nombre} · ${dos(serie.numero)}` : pilar}
      titulo={resuelto.gancho}
      numero={numero}
      icono="diseno"
      visual={visual.layout === 'A' ? <WebFija resuelto={resuelto} /> : null}
      nombre="la portada del reel"
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
