import { AbsoluteFill } from 'remotion'
import { Cabe } from '../componentes/Cabe'
import { Escenario } from '../componentes/Escenario'
import { Cabecera, Progreso, contador } from '../componentes/Marco'
import { Antetitulo, ConAcento } from '../componentes/piezas'
import { ALTO, ANCHO, MARGEN, RETICULA, TIPO } from '../diseno/formatos'
import { SANS } from '../diseno/fuentes'
import { LINEA, TINTA } from '../diseno/marca'
import { fondoDe } from '../diseno/temas'
import { titular } from '../diseno/texto'
import { alLienzo, partida } from '../motor/web'

// ============================================================
// EL ESCAPARATE — la web real de un negocio, en maquetas de dispositivo
//
// Un carrusel de "así queda": la portada con la web en un ordenador y un
// móvil, y una diapositiva por sección con su nota de UX (por qué funciona).
// La web es la de verdad (los componentes del sitio, como en los reels), así
// que lo que se enseña es exactamente lo que Maketa entrega.
// ============================================================

const ANCHO_WEB = 1100

// La web de cada negocio se calcula una vez por render.
const cache = new Map()
function webDe(negocio) {
  if (!cache.has(negocio)) {
    const { raw, contenido } = partida(negocio)
    const config = alLienzo(raw)
    cache.set(negocio, { config, contenido, todos: { configs: [config], contenidos: [contenido] } })
  }
  return cache.get(negocio)
}

/**
 * Un navegador de escritorio con la web a 1100 px de ancho: sigue siendo la
 * versión de ordenador (el corte del sitio está en 860) y el texto se lee mejor.
 */
export function Navegador({ negocio, seccion, ancho, alto, dominio }) {
  const web = webDe(negocio)
  const barra = 40
  const escala = ancho / ANCHO_WEB
  return (
    <div
      style={{
        width: ancho,
        height: alto,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#fff',
        border: `2px solid ${LINEA}`,
        boxShadow: '0 40px 80px -40px rgba(22,23,27,0.45)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: barra, flexShrink: 0, background: '#f1f1ee', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
        ))}
        <span
          style={{
            margin: '0 auto',
            padding: '4px 18px',
            borderRadius: 999,
            background: '#fff',
            fontFamily: SANS,
            fontSize: 15,
            color: '#8b8d95',
          }}
        >
          {dominio}
        </span>
      </div>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <Escenario
          config={web.config}
          contenido={web.contenido}
          todos={web.todos}
          seccion={seccion}
          ancho={ANCHO_WEB}
          alto={(alto - barra) / escala}
          escala={escala}
        />
      </div>
    </div>
  )
}

/** Un móvil con la web a 390 px de ancho. */
export function Movil({ negocio, seccion, ancho, alto }) {
  const web = webDe(negocio)
  const marco = 9
  const escala = (ancho - marco * 2) / 390
  return (
    <div
      style={{
        width: ancho,
        height: alto,
        borderRadius: 42,
        background: TINTA,
        padding: marco,
        boxSizing: 'border-box',
        boxShadow: '0 40px 80px -40px rgba(22,23,27,0.55)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 34, overflow: 'hidden', background: '#fff' }}>
        <Escenario
          config={web.config}
          contenido={web.contenido}
          todos={web.todos}
          seccion={seccion}
          ancho={390}
          alto={(alto - marco * 2) / escala}
          escala={escala}
        />
      </div>
    </div>
  )
}

/** "estudiovera.es": un dominio verosímil a partir del nombre del negocio. */
export const dominioDe = (negocio) =>
  webDe(negocio)
    .contenido.brand.name.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '') + '.es'

/** La pareja de abajo en cada sección: el ordenador y, al lado, el móvil. */
export function Pareja({ negocio, seccion, alto = 530 }) {
  const hueco = 18
  const movil = 214
  return (
    <div style={{ display: 'flex', gap: hueco, alignItems: 'flex-end' }}>
      <Navegador negocio={negocio} seccion={seccion} ancho={ANCHO - MARGEN.x * 2 - movil - hueco} alto={alto} dominio={dominioDe(negocio)} />
      <Movil negocio={negocio} seccion={seccion} ancho={movil} alto={alto - 10} />
    </div>
  )
}

/** La portada del escaparate: el titular y la web en un ordenador con el móvil delante. */
export function PortadaEscaparate({ d, indice, total, tema, pie }) {
  return (
    <AbsoluteFill
      style={{
        width: ANCHO,
        height: ALTO,
        background: fondoDe(tema, '50% 70%'),
        padding: `${MARGEN.y}px ${MARGEN.x}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: SANS,
      }}
    >
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Cabecera tema={tema} derecha={contador(indice, total)} />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', margin: `${RETICULA.cabecera}px 0` }}>
          <Cabe nombre="la portada del escaparate">
            {d.antetitulo ? <Antetitulo color={tema.acento}>{d.antetitulo}</Antetitulo> : null}
            <h1 style={{ ...titular(TIPO.titular + 8, tema.texto), marginTop: RETICULA.trasEtiqueta }}>
              <ConAcento texto={d.titulo} acento={tema.acento} />
            </h1>
            {/* El ordenador de fondo y el móvil delante, a la derecha. */}
            <div style={{ position: 'relative', marginTop: RETICULA.bloque, height: 670 }}>
              <div style={{ position: 'absolute', left: 0, top: 0 }}>
                <Navegador negocio={d.negocio} seccion="hero" ancho={820} alto={590} dominio={dominioDe(d.negocio)} />
              </div>
              <div style={{ position: 'absolute', right: 0, top: 90 }}>
                <Movil negocio={d.negocio} seccion="hero" ancho={270} alto={570} />
              </div>
            </div>
          </Cabe>
        </div>
        {pie}
      </div>
    </AbsoluteFill>
  )
}
