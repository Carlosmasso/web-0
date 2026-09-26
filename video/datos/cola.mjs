// ============================================================
// LA COLA — qué se publica y en qué orden
//
// El problema de producir contenido en serie no es fabricarlo, es que no se
// repita. Aquí la cola se construye con una regla aritmética en vez de a ojo:
//
//   pieza i  ->  formato[i % F]   y   negocio[(i * 3) % N]
//
// Con F=5 formatos y N=8 negocios, y como 3 es invertible módulo 8, la
// combinación (formato, negocio) NO se repite hasta la pieza 40. Entretanto:
// un formato no vuelve hasta 5 piezas después y un negocio hasta 8. A tres
// publicaciones por semana, eso son TRECE SEMANAS sin que salga dos veces el
// mismo vídeo.
//
// Pasada la pieza 40 la cola se agota, y conviene saberlo: la respuesta no es
// estirarla, es meter ejes nuevos (clientes reales, antes/después, consejos).
// Un generador no tiene ideas; solo evita que las tuyas se pisen.
// ============================================================

import { NEGOCIOS, listaNegocios } from './negocios.mjs'
import { FORMATOS, listaFormatos } from './formatos.mjs'

const NEG = listaNegocios()
const FOR = listaFormatos()
const SALTO = 3 // coprimo con el número de negocios: dispersa sin repetir

export const TOTAL = NEG.length * FOR.length

/** Tres publicaciones por semana: sostenible y suficiente para no desaparecer. */
export const POR_SEMANA = 3
export const SEMANAS = Math.ceil(TOTAL / POR_SEMANA)

/** Las piezas de una semana (la 1 es la primera). */
export const semana = (n) => cola((n - 1) * POR_SEMANA, POR_SEMANA)

/** La pieza número i de la cola (0 es la primera). */
export function pieza(i) {
  const formato = FOR[i % FOR.length]
  const negocio = NEG[(i * SALTO) % NEG.length]
  return { i, formato, negocio }
}

export const cola = (desde = 0, cuantas = TOTAL) =>
  Array.from({ length: Math.min(cuantas, TOTAL - desde) }, (_, k) => pieza(desde + k))

/** La semana de una pieza (la 1 es la primera) y su puesto dentro de ella. */
export const semanaDe = ({ i }) => ({ semana: Math.floor(i / POR_SEMANA) + 1, dentro: (i % POR_SEMANA) + 1 })

/** P01-rural-rafaga: número de pieza, negocio y formato. */
export const idDe = ({ i, negocio, formato }) => `P${String(i + 1).padStart(2, '0')}-${negocio}-${formato}`

/** semana-01/1-rural-rafaga: dónde se guarda al renderizar. */
export const carpetaDe = (p) => {
  const { semana, dentro } = semanaDe(p)
  return `semana-${String(semana).padStart(2, '0')}/${dentro}-${p.negocio}-${p.formato}`
}

/** La pieza como reel del motor: lo mismo que un JSON de video/reels/. */
export const reelDe = ({ negocio, formato }) => ({ ...FORMATOS[formato].reel(NEGOCIOS[negocio]), negocio })

/**
 * Comprueba que la cola no se pise: combinación repetida, o un formato o un
 * negocio que vuelven antes de tiempo. Si algún día se tocan a mano los
 * catálogos, esto avisa antes de grabar veinte vídeos iguales.
 */
export function revisar(piezas = cola()) {
  const problemas = []
  const vistas = new Map()
  const ultimoFormato = new Map()
  const ultimoNegocio = new Map()
  const MIN_FORMATO = Math.min(3, FOR.length - 1)
  const MIN_NEGOCIO = Math.min(4, NEG.length - 1)

  for (const p of piezas) {
    const clave = `${p.negocio}/${p.formato}`
    if (vistas.has(clave)) {
      problemas.push(`pieza ${p.i + 1}: repite ${clave} (ya salió en la ${vistas.get(clave) + 1})`)
    }
    vistas.set(clave, p.i)

    const df = p.i - (ultimoFormato.get(p.formato) ?? -Infinity)
    if (df <= MIN_FORMATO) {
      problemas.push(`pieza ${p.i + 1}: el formato "${p.formato}" vuelve a solo ${df} piezas de distancia`)
    }
    ultimoFormato.set(p.formato, p.i)

    const dn = p.i - (ultimoNegocio.get(p.negocio) ?? -Infinity)
    if (dn <= MIN_NEGOCIO) {
      problemas.push(`pieza ${p.i + 1}: el negocio "${p.negocio}" vuelve a solo ${dn} piezas de distancia`)
    }
    ultimoNegocio.set(p.negocio, p.i)
  }
  return problemas
}

/** Calendario legible, agrupado por semanas. */
export function calendario(desde = 0, cuantas = TOTAL) {
  const filas = []
  let actual = 0
  for (const p of cola(desde, cuantas)) {
    const s = Math.floor(p.i / POR_SEMANA) + 1
    if (s !== actual) {
      filas.push(`${actual ? '\n' : ''}Semana ${s}`)
      actual = s
    }
    const n = NEGOCIOS[p.negocio]
    filas.push(`  ${String(p.i + 1).padStart(2)}. ${n.sector.padEnd(24)} · ${p.formato.padEnd(10)} · ${FORMATOS[p.formato].voz}`)
  }
  return filas.join('\n')
}
