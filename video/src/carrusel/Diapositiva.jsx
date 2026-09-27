import { AbsoluteFill } from 'remotion'
import { SANS } from '../diseno/fuentes'
import { Marca } from '../componentes/Logo'
import { Cabecera, Progreso, contador } from '../componentes/Marco'
import { ACENTO, ACENTO_CLARO, LINEA, MUELLE, TINTA, TINTA_SUAVE } from '../diseno/marca'
import { Cabe } from '../componentes/Cabe'
import { Aparece, ENTRADA, useFlotar } from '../componentes/Aparece'
import { ALTO, ANCHO, MARGEN, RETICULA, TIPO } from '../diseno/formatos'
import { INTERIOR, TEMAS, fondoDe, tema as temaDe } from '../diseno/temas'
import { Portada } from '../portadas/Portada'
import { Antetitulo, CajaIcono, Casilla, ConAcento, Icono, Numero, Pastilla, Tarjeta, cuerpo, titular } from '../componentes/piezas'

// ============================================================
// UNA DIAPOSITIVA — todas con el mismo esqueleto
//
//   cabecera   la marca a la izquierda y el contador a la derecha
//   icono      el cuadrado de 120 px, arriba a la izquierda
//   etiqueta   el antetítulo en mayúsculas ("Error 02", "Caso 1 de 3")
//   titular    72 px (96 en la portada)
//   texto      40 px
//   abajo      pegado al pie: la tarjeta de la variante (resalte, lista…)
//   progreso   un tramo por diapositiva
//
// Las variantes NO cambian tamaños ni posiciones: solo dicen qué va en cada
// hueco y en qué fondo. Así el titular está a la misma altura y mide lo
// mismo en todas las diapositivas de todos los carruseles.
//
//   portada    la Portada compartida (portadas/), con su tema y su layout
//   respuesta  la respuesta corta y, abajo, de qué depende
//   punto      un error y, abajo, "mejor así"
//   caso       si pasa esto… y, abajo, "entonces"
//   item       una comprobación y, abajo, la pregunta que hay que hacer
//   lista      varias líneas con casilla o número, para guardar
//   comparativa dos columnas: A frente a B, antes frente a después
//   cierre     fondo blanco, la llamada a la acción y la marca, como el
//              cierre del intro
// ============================================================

// Los fondos de las diapositivas interiores son siempre claros (se leen mejor
// con texto); el tema de la pieza manda en la portada.
const FONDOS = { tinta: TEMAS.dark, claro: INTERIOR, blanco: TEMAS.light }

/**
 * El esqueleto. `abajo` se pega al pie de la zona de contenido; lo demás
 * empieza siempre en el mismo sitio.
 */
function Esqueleto({ d, indice, total, fondo, tamanoTitular = TIPO.titular, extra, abajo }) {
  const t = FONDOS[fondo]
  const { oscuro } = t
  const acento = t.acento
  return (
    <AbsoluteFill
      style={{
        width: ANCHO,
        height: ALTO,
        background: fondoDe(t, '50% 40%'),
        padding: `${MARGEN.y}px ${MARGEN.x}px`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: SANS,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Cabecera tema={t} derecha={contador(indice, total)} />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', margin: `${RETICULA.cabecera}px 0` }}>
          <Cabe nombre={`la diapositiva ${indice + 1}`}>
            {/* En vídeo, cada bloque entra a su tiempo (componentes/Aparece.jsx) y
                el icono se mece; en imagen fija, todo está quieto en su sitio. */}
            <Aparece desde={ENTRADA.icono} flotar={5}>
              <CajaIcono nombre={d.icono} oscuro={oscuro} />
            </Aparece>
            <Aparece desde={ENTRADA.antetitulo}>
              <Antetitulo oscuro={oscuro} style={{ marginTop: RETICULA.trasIcono }}>
                {d.antetitulo}
              </Antetitulo>
            </Aparece>
            <Aparece desde={ENTRADA.titular}>
              <h1 style={{ ...titular(tamanoTitular, t.texto), marginTop: RETICULA.trasEtiqueta }}>
                <ConAcento texto={d.titulo} acento={acento} />
              </h1>
            </Aparece>
            {d.texto ? (
              <Aparece desde={ENTRADA.texto}>
                <p style={{ ...cuerpo(t.suave), marginTop: RETICULA.trasTitular }}>
                  <ConAcento texto={d.texto} acento={acento} />
                </p>
              </Aparece>
            ) : null}
            {extra ? <Aparece desde={ENTRADA.extra}>{extra}</Aparece> : null}
            {abajo ? (
              <div style={{ marginTop: 'auto', paddingTop: RETICULA.bloque }}>
                {/* Lo de abajo (la pregunta, "mejor así") llega el último y más
                    suave: cuando ya se ha leído el titular. */}
                <Aparece desde={ENTRADA.abajo} dy={50} config={MUELLE.suave}>
                  {abajo}
                </Aparece>
              </div>
            ) : null}
          </Cabe>
        </div>
        <Progreso indice={indice} total={total} tema={t} />
      </div>
    </AbsoluteFill>
  )
}

// ------------------------------------------------------------
// BLOQUES DE ABAJO — todos en la misma tarjeta y con el mismo tamaño de letra

const detalle = (color = TINTA) => cuerpo(color, TIPO.detalle)

/**
 * Un icono, una etiqueta y una frase (y una nota opcional): "mejor así",
 * "pregunta", "entonces". Con `tono: 'acento'` va en el azul de marca con la
 * letra en blanco: lo que hay que hacer (la pregunta) destaca sobre todo lo demás.
 */
function Resalte({ resalte }) {
  const acento = resalte.tono === 'acento'
  return (
    <Tarjeta
      style={{
        display: 'flex',
        gap: 30,
        alignItems: 'flex-start',
        ...(acento ? { background: ACENTO, border: 'none', boxShadow: '0 24px 50px -30px rgba(59,83,214,0.7)' } : {}),
      }}
    >
      <CajaIcono nombre={resalte.icono} tamano={80} oscuro={acento} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
        <Antetitulo color={acento ? 'rgba(255,255,255,0.72)' : undefined}>{resalte.etiqueta}</Antetitulo>
        <p style={{ ...detalle(acento ? '#fff' : TINTA), fontWeight: 600 }}>
          <ConAcento texto={resalte.texto} acento={acento ? '#fff' : undefined} />
        </p>
        {resalte.nota ? (
          <p style={{ ...detalle(acento ? 'rgba(255,255,255,0.8)' : TINTA_SUAVE), marginTop: 6 }}>
            <ConAcento texto={resalte.nota} acento={acento ? '#fff' : undefined} />
          </p>
        ) : null}
      </div>
    </Tarjeta>
  )
}

/** Varias líneas separadas por un filete, con icono, número o casilla delante. */
function Filas({ lista, marcador }) {
  return (
    <Tarjeta style={{ padding: '8px 48px' }}>
      {lista.map((l, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '18px 0', borderTop: i ? `2px solid ${LINEA}` : 'none' }}
        >
          {marcador === 'casilla' ? (
            <Casilla estado={l.estado} />
          ) : marcador === 'icono' && l.icono ? (
            <Icono nombre={l.icono} tamano={44} color={ACENTO} />
          ) : (
            <Numero>{String(i + 1).padStart(2, '0')}</Numero>
          )}
          <p style={detalle()}>
            <ConAcento texto={l.texto} />
          </p>
        </div>
      ))}
    </Tarjeta>
  )
}

/** Dos columnas, cada una con su etiqueta: "Freelance / Agencia", "Antes / Después". */
function Columnas({ columnas }) {
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
      {columnas.map((c, i) => (
        <Tarjeta key={i} style={{ flex: 1, padding: '36px 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Antetitulo color={i === 0 ? TINTA_SUAVE : ACENTO}>{c.etiqueta}</Antetitulo>
          <p style={{ ...detalle(), fontWeight: i === 0 ? 500 : 600 }}>
            <ConAcento texto={c.texto} />
          </p>
        </Tarjeta>
      ))}
    </div>
  )
}

const Desliza = ({ tema }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 14,
      fontSize: TIPO.etiqueta + 4,
      fontWeight: 600,
      color: tema.suave,
    }}
  >
    Desliza
    <Icono nombre="flecha" tamano={34} color={tema.acento} />
  </div>
)

/**
 * La llamada a guardar: una tarjeta en el azul de marca con el marcador y una
 * flecha que apunta abajo a la derecha, donde Instagram pone el botón de
 * guardar. En vídeo, la flecha se mece hacia él.
 */
function Guardar({ texto }) {
  const vaiven = useFlotar(8)
  return (
    <Tarjeta
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        background: ACENTO,
        border: 'none',
        boxShadow: '0 24px 50px -30px rgba(59,83,214,0.7)',
      }}
    >
      <CajaIcono nombre="guardar" tamano={88} oscuro />
      <p style={{ ...detalle('#fff'), fontWeight: 600, flex: 1 }}>
        <ConAcento texto={texto} acento="#fff" />
      </p>
      <div style={{ transform: `translate(${vaiven}px, ${vaiven}px) rotate(45deg)` }}>
        <Icono nombre="flecha" tamano={52} color={ACENTO_CLARO} />
      </div>
    </Tarjeta>
  )
}

const FirmaMarca = () => (
  <div style={{ borderTop: `2px solid ${LINEA}`, padding: '40px 0 12px', display: 'flex', flexDirection: 'column', gap: 24 }}>
    <Marca tamano={56} />
    <span style={{ fontSize: TIPO.detalle, fontWeight: 600, letterSpacing: '-0.025em', color: TINTA_SUAVE }}>
      Diséñala tú.{' '}
      <span style={{ position: 'relative', color: TINTA }}>
        Yo la construyo.
        {/* El subrayado del cierre de los reels. */}
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: -8, height: 6, borderRadius: 3, background: ACENTO }} />
      </span>
    </span>
  </div>
)

// ------------------------------------------------------------
// VARIANTES — solo rellenan los huecos

const resalteDe = (d) => (d.resalte ? <Resalte resalte={d.resalte} /> : null)

const VARIANTES = {
  portada: ({ d, indice, total }) => {
    const tema = temaDe(d.tema ?? 'dark')
    return (
      <Portada
        tema={tema}
        layout={d.layout ?? 'A'}
        antetitulo={d.antetitulo}
        titulo={d.titulo}
        texto={d.texto}
        icono={d.icono}
        numero={d.numero}
        derecha={contador(indice, total)}
        nombre="la portada"
        pie={
          <div style={{ display: 'flex', flexDirection: 'column', gap: RETICULA.cabecera }}>
            {total > 1 ? <Desliza tema={tema} /> : null}
            <Progreso indice={indice} total={total} tema={tema} />
          </div>
        }
      />
    )
  },
  respuesta: (p) => (
    <Esqueleto {...p} fondo="claro" abajo={p.d.lista?.length ? <Filas lista={p.d.lista} marcador="icono" /> : null} />
  ),
  punto: (p) => <Esqueleto {...p} fondo="claro" abajo={resalteDe(p.d)} />,
  caso: (p) => <Esqueleto {...p} fondo="claro" abajo={resalteDe(p.d)} />,
  item: (p) => <Esqueleto {...p} fondo="claro" abajo={resalteDe(p.d)} />,
  lista: (p) => <Esqueleto {...p} fondo="claro" abajo={<Filas lista={p.d.lista} marcador={p.d.marcador} />} />,
  comparativa: (p) => <Esqueleto {...p} fondo="claro" abajo={<Columnas columnas={p.d.columnas} />} />,
  cierre: (p) => (
    <Esqueleto
      {...p}
      fondo="blanco"
      extra={
        p.d.guardar ? (
          <div style={{ marginTop: RETICULA.bloque }}>
            <Guardar texto={p.d.guardar} />
          </div>
        ) : p.d.cta ? (
          <div style={{ marginTop: RETICULA.bloque, display: 'flex' }}>
            <Pastilla icono={p.d.icono}>{p.d.cta}</Pastilla>
          </div>
        ) : null
      }
      abajo={<FirmaMarca />}
    />
  ),
}

export const VARIANTES_DISPONIBLES = Object.keys(VARIANTES)

export function Diapositiva({ d, indice, total }) {
  const Variante = VARIANTES[d.variante]
  if (!Variante) throw new Error(`Variante de diapositiva desconocida: "${d.variante}"`)
  return <Variante d={d} indice={indice} total={total} />
}
