// ============================================================
// LO QUE COMPARTEN TODAS LAS IDEAS
//
// Los pilares (y su CTA por defecto), las series y las variantes visuales
// que se pueden pedir. Cuándo se publica cada pieza no está aquí: lo decides tú.
// ============================================================

// Qué aporta cada pieza. `cta` es la llamada a la acción si la idea no trae la suya.
// Fase 0 (PLAN.md): ninguna CTA habla de presupuesto ni de dinero.
export const PILARES = {
  inspiration: { nombre: 'Inspiración', cta: '¿Cuál elegirías?' },
  education: { nombre: 'Educación', cta: 'Guárdalo para cuando encargues tu web.' },
  trust: { nombre: 'Confianza', cta: 'Guárdalo para más adelante.' },
  decision: { nombre: 'Decisión', cta: 'Guárdalo para cuando tengas que decidir.' },
  problems: { nombre: 'Problemas', cta: 'Compártelo con alguien que esté haciendo su web.' },
  mistakes: { nombre: 'Errores', cta: 'Compártelo con alguien que esté haciendo su web.' },
  product: { nombre: 'Producto', cta: 'Descúbrelo en maketa.es' },
}

// Lo que la audiencia reconoce: va en el antetítulo de la portada
// ("ERRORES WEB · 03", numerado por el orden de ideas.json). Si la serie
// fija `layout`, todas sus portadas lo usan.
export const SERIES = {
  'antes-de-contratar': { nombre: 'Antes de contratar' },
  'errores-web': { nombre: 'Errores web', layout: 'C' },
  'mitos-web': { nombre: 'Mitos web', layout: 'B' },
  'cuanto-cuesta': { nombre: '¿Cuánto cuesta?' },
  'web-en-30-segundos': { nombre: 'Web en 30 segundos' },
  maketa: { nombre: 'Maketa' },
  'diseno-que-funciona': { nombre: 'Diseño que funciona' },
  'nadie-te-cuenta': { nombre: 'Cosas que nadie te cuenta', layout: 'B' },
}

// "visual": { "tema", "layout" } de una idea (src/diseno/temas.js y layouts.js).
//   tema    dark · light · accent
//   layout  A la pieza visual manda · B tipográfica · C el número grande
export const TEMAS = ['dark', 'light', 'accent']
export const LAYOUTS = ['A', 'B', 'C']

// "visual": { "portada" } de un reel (src/portadas/PortadaReel.jsx):
//   pila     la web con sus versiones siguientes asomando detrás (la de siempre)
//   duelo    la primera versión frente a la última: contraste
//   rejilla  cuatro versiones numeradas y "¿Cuál eliges?": pide comentarios
//   numero   "5 colores" en grande sobre la pila: se escanea de un vistazo
export const PORTADAS_REEL = ['pila', 'duelo', 'rejilla', 'numero']
