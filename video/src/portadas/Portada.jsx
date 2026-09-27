import { AbsoluteFill } from 'remotion'
import { Aparece, ENTRADA } from '../componentes/Aparece'
import { Cabe } from '../componentes/Cabe'
import { Cabecera } from '../componentes/Marco'
import { Antetitulo, CajaIcono, ConAcento } from '../componentes/piezas'
import { CARRUSEL, MARGEN, RETICULA, TIPO, TIPO_PORTADA } from '../diseno/formatos'
import { SANS } from '../diseno/fuentes'
import { fondoDe } from '../diseno/temas'
import { cuerpo, titular } from '../diseno/texto'

// ============================================================
// LA PORTADA DE UN CARRUSEL — un sistema cerrado: 3 layouts × 3 temas
//
// Es la primera diapositiva y su celda en el feed. Todas comparten márgenes,
// marca arriba, letra y jerarquía; el layout cambia la composición y el tema,
// el color:
//
//   A  el icono y, debajo, el titular
//   B  tipográfica: el titular, grande y abajo; la serie arriba
//   C  el número: "5", "7", enorme en el acento, y el titular debajo
//
// Las portadas de los reels son otra pieza: PortadaReel.jsx.
// ============================================================

const ZONA = { ...CARRUSEL, arriba: MARGEN.y, abajo: MARGEN.y }

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
 * @param tema       objeto de diseno/temas.js
 * @param layout     'A' | 'B' | 'C'
 * @param antetitulo la serie ("ERRORES WEB · 03") o la categoría
 * @param titulo     el gancho; *así* va en el acento
 * @param texto      opcional, debajo del titular (A y C)
 * @param icono      concepto del icono (A en carrusel)
 * @param numero     el número del layout C
 * @param derecha    lo que va arriba a la derecha (el contador del carrusel)
 * @param pie        nodo pegado abajo (en el carrusel: "Desliza" y el progreso)
 */
export function Portada({ tema, layout = 'A', antetitulo, titulo, texto, icono, numero, derecha, pie, nombre = 'la portada' }) {
  const zona = ZONA
  const colorTexto = tema.suave
  const tamano = TIPO_PORTADA[layout]

  const bloqueTitular = (
    <>
      {antetitulo ? (
        <Aparece desde={ENTRADA.antetitulo}>
          {/* Tras el icono o el número, su separación; si no hay nada encima, ninguna. */}
          <Antetitulo color={tema.acento} style={{ marginTop: layout === 'B' ? 0 : RETICULA.trasIcono }}>
            {antetitulo}
          </Antetitulo>
        </Aparece>
      ) : null}
      <Aparece desde={ENTRADA.titular} dy={110}>
        <h1 style={{ ...titular(tamano, tema.texto), marginTop: antetitulo ? RETICULA.trasEtiqueta : 0 }}>
          <ConAcento texto={titulo} acento={tema.acento} />
        </h1>
      </Aparece>
      {texto && layout !== 'B' ? (
        <Aparece desde={ENTRADA.texto}>
          <p style={{ ...cuerpo(colorTexto, TIPO.texto), marginTop: RETICULA.trasTitular }}>
            <ConAcento texto={texto} acento={tema.acento} />
          </p>
        </Aparece>
      ) : null}
    </>
  )

  let contenido
  if (layout === 'A') {
    contenido = (
      <>
        <Aparece desde={ENTRADA.icono} flotar={5}>
          <CajaIcono nombre={icono ?? 'idea'} oscuro={tema.oscuro} />
        </Aparece>
        {bloqueTitular}
      </>
    )
  } else if (layout === 'B') {
    // La serie arriba y el titular abajo: la portada es la frase.
    contenido = (
      <>
        {antetitulo ? (
          <Aparece desde={ENTRADA.antetitulo}>
            <Antetitulo color={tema.acento}>{antetitulo}</Antetitulo>
          </Aparece>
        ) : null}
        {/* Pegado abajo, la caja de la letra (más alta que su interlineado de
            1,06) sobresaldría; el margen interior la deja dentro. */}
        <div style={{ marginTop: 'auto', paddingBottom: Math.ceil(tamano * 0.1) }}>
          <Aparece desde={ENTRADA.titular} dy={110}>
            <h1 style={titular(tamano, tema.texto)}>
              <ConAcento texto={titulo} acento={tema.acento} />
            </h1>
          </Aparece>
          {texto ? (
            <Aparece desde={ENTRADA.texto}>
              <p style={{ ...cuerpo(colorTexto, TIPO.texto), marginTop: RETICULA.trasTitular }}>
                <ConAcento texto={texto} acento={tema.acento} />
              </p>
            </Aparece>
          ) : null}
        </div>
      </>
    )
  } else {
    contenido = (
      <>
        <Aparece desde={ENTRADA.icono} dy={140}>
          <Numero n={numero ?? ''} tema={tema} />
        </Aparece>
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
