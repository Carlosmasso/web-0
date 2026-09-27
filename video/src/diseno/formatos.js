import { ACENTO, PALETAS } from './marca'

// ============================================================
// LOS FORMATOS — reel, carrusel y la cuadrícula del perfil
//
// Lo propio de cada lienzo: tamaño, zonas seguras, escala tipográfica y
// márgenes. Los colores no están aquí (`temas.js`), ni la letra (`texto.js`).
// ============================================================

/** Reel: 9:16. Instagram tapa arriba el nombre de la cuenta y abajo el pie y los botones. */
export const REEL = { ancho: 1080, alto: 1920, seguro: { arriba: 250, abajo: 430 } }

/** Los tamaños de letra de los reels. No hay más. */
export const TIPO_REEL = {
  gancho: 104, // la frase de la escena 1
  nombre: 62, // el nombre de la variante bajo la tarjeta
  frase: 54, // el titular que acompaña a la demo (layout "titular")
  pastilla: 38, // la pastilla de arriba
}

/**
 * La celda del perfil: Instagram enseña cada publicación en la cuadrícula
 * recortada a 3:4 (1080x1440), centrada. Una portada tiene que funcionar ahí.
 */
export const CELDA = { ancho: 1080, alto: 1440 }

// ------------------------------------------------------------
// CARRUSELES — una sola retícula para todos
//
// 1080 x 1350 (4:5), el vertical que Instagram y LinkedIn enseñan sin
// recortar. Los colores, la letra y los muelles son los de `marca.js`: aquí
// vive lo propio de una imagen fija, el tamaño, la escala y los espacios.
//
// La escala es FIJA. Ningún tamaño depende de lo largo que sea el texto ni de
// la plantilla: al pasar diapositivas, y de un carrusel a otro, el titular
// mide lo mismo y está en el mismo sitio. Si un texto no cabe, se acorta el
// texto (ver `Cabe.jsx`).
// ============================================================

export const ANCHO = 1080
export const ALTO = 1350
export const CARRUSEL = { ancho: ANCHO, alto: ALTO }

/** Margen lateral y de arriba/abajo de todas las diapositivas. */
export const MARGEN = { x: 88, y: 76 }

/** El tinte casi blanco del azul de marca (el mismo de la demo del intro). */
export const TINTE = PALETAS.find((p) => p.hex.toLowerCase() === ACENTO.toLowerCase()).tinte

/** Los cinco tamaños de letra que existen, en px. No hay más. */
export const TIPO = {
  portada: 96, // el titular de la portada
  titular: 72, // el titular de cualquier otra diapositiva
  texto: 40, // el texto bajo el titular
  detalle: 36, // lo que va en tarjetas: resaltes, listas, llamada a la acción
  etiqueta: 26, // antetítulo en mayúsculas, cabecera
}

/** Los tamaños de las portadas (reel y carrusel), por layout. */
export const TIPO_PORTADA = {
  A: 96, // el titular junto a la pieza visual
  B: 116, // tipográfica: el titular es la portada
  C: 84, // bajo el número grande
  numero: 340, // el número del layout C
}

/** El esqueleto de todas las diapositivas, de arriba abajo. */
export const RETICULA = {
  icono: 120, // el cuadrado del icono, siempre arriba a la izquierda
  trasIcono: 56,
  trasEtiqueta: 20,
  trasTitular: 28,
  bloque: 48, // separación mínima entre el texto y el bloque de abajo
  cabecera: 48, // entre la cabecera y el contenido, y entre el contenido y el progreso
}
