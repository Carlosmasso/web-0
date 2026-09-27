import { SANS } from './fuentes'

// ============================================================
// TEXTO — la escala de la marca y el resaltado con *asteriscos*
//
// Un solo estilo de titular y uno de texto corrido para todo: el gancho de un
// reel, el titular de una diapositiva y el de una portada son la misma letra
// (Inter 700 con el interletraje del intro); solo cambia el tamaño, y los
// tamaños salen de `formatos.js`.
// ============================================================

/** Titular: el del intro. */
export const titular = (tamano, color) => ({
  fontFamily: SANS,
  fontSize: tamano,
  fontWeight: 700,
  letterSpacing: '-0.04em',
  lineHeight: 1.06,
  color,
  textWrap: 'balance',
  margin: 0,
})

/** Texto corrido. */
export const cuerpo = (color, tamano) => ({
  fontFamily: SANS,
  fontSize: tamano,
  fontWeight: 500,
  letterSpacing: '-0.015em',
  lineHeight: 1.34,
  color,
  textWrap: 'pretty',
  margin: 0,
})

/** Antetítulo: mayúsculas pequeñas y espaciadas, como en la landing. */
export const antetitulo = (tamano, color) => ({
  fontFamily: SANS,
  fontSize: tamano,
  fontWeight: 700,
  letterSpacing: '0.12em',
  lineHeight: 1.2,
  textTransform: 'uppercase',
  color,
})

/**
 * "La web de *tu taller*, en seis estilos." → trozos con su marca de acento.
 * El mismo reparto para el texto animado de los reels y el estático de los
 * carruseles y las portadas.
 * @returns {{ texto: string, acento: boolean }[]}
 */
export const trozos = (texto) =>
  String(texto ?? '')
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((t) => (t.startsWith('*') && t.endsWith('*') ? { texto: t.slice(1, -1), acento: true } : { texto: t, acento: false }))

/** Los mismos trozos, palabra a palabra (para animarlas una a una). */
export function palabras(texto) {
  const salida = []
  for (const t of trozos(texto)) {
    for (const p of t.texto.split(/\s+/).filter(Boolean)) {
      // La puntuación que sigue a un resaltado ("*tu taller*,") va pegada a él.
      if (/^[.,;:!?…]+$/.test(p) && salida.length) salida.at(-1).p += p
      else salida.push({ p, acento: t.acento })
    }
  }
  return salida
}

/** Texto sin asteriscos (títulos de PDF, nombres de archivo, fichas). */
export const plano = (texto) => String(texto ?? '').replace(/\*/g, '')
