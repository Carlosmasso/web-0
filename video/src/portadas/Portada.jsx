import { AbsoluteFill } from 'remotion'
import { Cabe } from '../componentes/Cabe'
import { Cabecera } from '../componentes/Marco'
import { Antetitulo, CajaIcono, ConAcento } from '../componentes/piezas'
import { CARRUSEL, MARGEN, REEL, RETICULA, TIPO, TIPO_PORTADA } from '../diseno/formatos'
import { SANS } from '../diseno/fuentes'
import { fondoDe } from '../diseno/temas'
import { cuerpo, titular } from '../diseno/texto'

// ============================================================
// LA PORTADA — un sistema cerrado: 3 layouts × 4 temas
//
// La misma pieza hace la primera diapositiva de un carrusel, la portada de un
// reel y cada celda del feed. Todas comparten márgenes, marca arriba, letra y
// jerarquía; el layout cambia la composición y el tema, el color:
//
//   A  la pieza visual manda: el icono (carrusel) o la web en su tarjeta (reel)
//   B  tipográfica: el titular, grande y abajo; la serie arriba
//   C  el número: "5", "7", enorme en el acento, y el titular debajo
//
// En un reel, todo cae en la franja 3:4 del centro: es lo que Instagram enseña
// en la cuadrícula del perfil.
// ============================================================

const ZONA = {
  carrusel: { ...CARRUSEL, arriba: MARGEN.y, abajo: MARGEN.y },
  // 1920 de alto; la cuadrícula enseña los 1440 del centro (240 por arriba y abajo).
  reel: { ...REEL, arriba: 240 + 64, abajo: 240 + 64 },
}

function Numero({ n, tema }) {
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: TIPO_PORTADA.numero,
        fontWeight: 800,
        letterSpacing: '-0.07em',
        lineHeight: 0.82,
        color: tema.acento,
        marginLeft: -12, // el ojo del número, no su caja, alineado con el margen
      }}
    >
      {n}
    </div>
  )
}

/**
 * @param formato    'reel' | 'carrusel'
 * @param tema       objeto de diseno/temas.js
 * @param layout     'A' | 'B' | 'C'
 * @param antetitulo la serie ("ERRORES WEB · 03") o la categoría
 * @param titulo     el gancho; *así* va en el acento
 * @param texto      opcional, debajo del titular (A y C)
 * @param icono      concepto del icono (A en carrusel)
 * @param numero     el número del layout C
 * @param visual     nodo que sustituye al icono en A (la web en su tarjeta, en los reels)
 * @param derecha    lo que va arriba a la derecha (el contador del carrusel)
 * @param pie        nodo pegado abajo (en el carrusel: "Desliza" y el progreso)
 */
export function Portada({ formato, tema, layout = 'A', antetitulo, titulo, texto, icono, numero, visual, derecha, pie, nombre = 'la portada' }) {
  const zona = ZONA[formato]
  const colorTexto = tema.suave
  const tamano = TIPO_PORTADA[layout]

  const bloqueTitular = (
    <>
      {antetitulo ? (
        <Antetitulo color={tema.acento} style={{ marginTop: layout === 'B' ? 0 : RETICULA.trasIcono }}>
          {antetitulo}
        </Antetitulo>
      ) : null}
      <h1 style={{ ...titular(tamano, tema.texto), marginTop: antetitulo ? RETICULA.trasEtiqueta : 0 }}>
        <ConAcento texto={titulo} acento={tema.acento} />
      </h1>
      {texto && layout !== 'B' ? (
        <p style={{ ...cuerpo(colorTexto, TIPO.texto), marginTop: RETICULA.trasTitular }}>
          <ConAcento texto={texto} acento={tema.acento} />
        </p>
      ) : null}
    </>
  )

  let contenido
  if (layout === 'A') {
    contenido = (
      <>
        {visual ? null : <CajaIcono nombre={icono ?? 'idea'} oscuro={tema.oscuro} />}
        {bloqueTitular}
        {visual ? <div style={{ marginTop: RETICULA.bloque }}>{visual}</div> : null}
      </>
    )
  } else if (layout === 'B') {
    // La serie arriba y el titular abajo: la portada es la frase.
    contenido = (
      <>
        {antetitulo ? <Antetitulo color={tema.acento}>{antetitulo}</Antetitulo> : null}
        {/* Pegado abajo, la caja de la letra (más alta que su interlineado de
            1,06) sobresaldría; el margen interior la deja dentro. */}
        <div style={{ marginTop: 'auto', paddingBottom: Math.ceil(tamano * 0.1) }}>
          <h1 style={titular(tamano, tema.texto)}>
            <ConAcento texto={titulo} acento={tema.acento} />
          </h1>
          {texto ? (
            <p style={{ ...cuerpo(colorTexto, TIPO.texto), marginTop: RETICULA.trasTitular }}>
              <ConAcento texto={texto} acento={tema.acento} />
            </p>
          ) : null}
        </div>
      </>
    )
  } else {
    contenido = (
      <>
        <Numero n={numero ?? ''} tema={tema} />
        {bloqueTitular}
      </>
    )
  }

  return (
    <AbsoluteFill
      style={{
        // Tamaño explícito, como las diapositivas: Cabe mide antes de que el
        // contenedor de la composición tenga el suyo.
        width: zona.ancho,
        height: zona.alto,
        background: fondoDe(tema, '50% 40%'),
        padding: `${zona.arriba}px ${MARGEN.x}px ${zona.abajo}px`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: SANS,
        boxSizing: 'border-box',
      }}
    >
      {/* El mismo andamiaje que las diapositivas: sin este contenedor, la zona
          de contenido no tiene alto cuando Cabe la mide. */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Cabecera tema={tema} derecha={derecha} />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', margin: `${RETICULA.cabecera}px 0` }}>
          <Cabe nombre={nombre}>{contenido}</Cabe>
        </div>
        {pie}
      </div>
    </AbsoluteFill>
  )
}
