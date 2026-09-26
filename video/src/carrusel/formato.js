import { ACENTO, PALETAS } from '../marca'

// ============================================================
// FORMATO DE LOS CARRUSELES
//
// 1080 x 1350 (4:5), el vertical que Instagram y LinkedIn enseñan sin
// recortar. Los colores, la letra y los muelles son los de `marca.js`: aquí
// solo vive lo que es propio de una imagen fija, el tamaño y la escala.
// ============================================================

export const ANCHO = 1080
export const ALTO = 1350

/** Margen lateral y de arriba/abajo de todas las diapositivas. */
export const MARGEN = { x: 88, y: 76 }

/** El tinte casi blanco del azul de marca (el mismo de la demo del intro). */
export const TINTE = PALETAS.find((p) => p.hex.toLowerCase() === ACENTO.toLowerCase()).tinte

/**
 * Escala tipográfica, en px a 1080 de ancho. Todo se escribe con `px()`, que
 * multiplica por `--k`: si el contenido de una diapositiva no cabe,
 * `Ajustar` baja `--k` y encoge el bloque entero en proporción, sin romper la
 * jerarquía entre titular y texto.
 */
export const TIPO = {
  portada: 104,
  titulo: 76,
  subtitulo: 44,
  texto: 40,
  numero: 210,
  etiqueta: 26,
  cta: 36,
}

/** Tamaño que se encoge con el ajuste de la diapositiva. */
export const px = (n) => `calc(${n}px * var(--k, 1))`

/**
 * Titulares largos empiezan más pequeños: así el ajuste solo interviene en
 * los casos raros, y un titular de tres palabras no se queda en 60 px porque
 * el texto de debajo sea largo.
 */
export const tamanoTitular = (texto, base) => {
  const n = String(texto ?? '').replace(/\*/g, '').length
  if (n <= 28) return base
  if (n <= 48) return base * 0.9
  if (n <= 70) return base * 0.8
  if (n <= 100) return base * 0.7
  return base * 0.62
}
