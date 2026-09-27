// ============================================================
// LOS TRES LAYOUTS — A, B y C, con el mismo sentido en todos los formatos
//
//   A  la pieza visual manda: la web en su tarjeta (reel) o el icono (carrusel)
//   B  tipográfica: el titular grande, la web a pantalla casi completa
//   C  el titular se queda: la frase del gancho acompaña a la demo, o el
//      número grande en la portada ("5 errores")
//
// Solo geometría, en px del lienzo de 1080 de ancho. Colores: `temas.js`.
// Todo cae entre las zonas seguras del reel (arriba 250, abajo 430).
// ============================================================

/**
 * @typedef {{
 *   tarjeta: { arriba: number, ancho: number, alto: number, escala: number },
 *   pastilla: boolean,        la pastilla que dice qué cambia
 *   antetitulo: number|null,  y del antetítulo (nombre de la variable), si no hay pastilla
 *   titular: number|null,     y de la frase fija arriba (layout C)
 *   nombre: number,           y del nombre de la variante
 *   puntos: number,           y de los puntos de progreso
 * }} LayoutReel
 */

/** @type {Record<'A'|'B'|'C', LayoutReel>} */
export const LAYOUTS_REEL = {
  // La tarjeta del intro con la pastilla encima.
  A: {
    tarjeta: { arriba: 390, ancho: 820, alto: 900, escala: 2 },
    pastilla: true,
    antetitulo: null,
    titular: null,
    nombre: 1320,
    puntos: 1408,
  },
  // La web casi a pantalla completa: más producto, menos marco.
  B: {
    tarjeta: { arriba: 300, ancho: 940, alto: 1060, escala: 2 },
    pastilla: false,
    antetitulo: 262,
    titular: null,
    nombre: 1384,
    puntos: 1468,
  },
  // La frase del gancho se queda arriba mientras la web cambia.
  C: {
    tarjeta: { arriba: 500, ancho: 760, alto: 780, escala: 2 },
    pastilla: false,
    antetitulo: 262,
    titular: 306,
    nombre: 1312,
    puntos: 1400,
  },
}

export const layoutReel = (l = 'A') => {
  const r = LAYOUTS_REEL[l]
  if (!r) throw new Error(`layout de reel desconocido "${l}". Hay: ${Object.keys(LAYOUTS_REEL).join(', ')}`)
  return r
}
