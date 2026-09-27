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
 * Todos llevan la pastilla que dice qué cambia: es la firma de los reels.
 *
 * @typedef {{
 *   pastilla: number,         y de la pastilla
 *   titular: number|null,     y de la frase fija arriba (layout C)
 *   tarjeta: { arriba: number, ancho: number, alto: number, escala: number },
 *   nombre: number,           y del nombre de la variante
 *   puntos: number,           y de los puntos de progreso
 * }} LayoutReel
 */

/** @type {Record<'A'|'B'|'C', LayoutReel>} */
export const LAYOUTS_REEL = {
  // La tarjeta del intro con la pastilla encima.
  A: { pastilla: 290, titular: null, tarjeta: { arriba: 390, ancho: 820, alto: 900, escala: 2 }, nombre: 1320, puntos: 1408 },
  // La web casi a pantalla completa: más producto, menos marco.
  B: { pastilla: 290, titular: null, tarjeta: { arriba: 400, ancho: 940, alto: 960, escala: 2 }, nombre: 1388, puntos: 1472 },
  // La frase del gancho se queda arriba mientras la web cambia.
  C: { pastilla: 420, titular: 262, tarjeta: { arriba: 520, ancho: 760, alto: 760, escala: 2 }, nombre: 1310, puntos: 1398 },
}

export const layoutReel = (l = 'A') => {
  const r = LAYOUTS_REEL[l]
  if (!r) throw new Error(`layout de reel desconocido "${l}". Hay: ${Object.keys(LAYOUTS_REEL).join(', ')}`)
  return r
}
