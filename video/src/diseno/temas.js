import { ACENTO, ACENTO_CLARO, FONDO, FONDO_ALT, LINEA, TINTA, TINTA_SUAVE, TINTA_TENUE } from './marca'

// ============================================================
// LOS TRES TEMAS — el único sitio donde se decide el color de una pieza
//
// Reels, carruseles y portadas no eligen colores: eligen un tema. Todos salen
// de los tokens de la landing (`marca.js`), así que un reel oscuro y un
// carrusel claro siguen pareciendo de la misma marca.
//
//   dark     tinta con el halo azul: el gancho de siempre, el que más pesa
//   light    blanco: el cierre de siempre, limpio
//   accent   el azul de marca a sangre: la especia, con moderación
//
// Cada tema da los mismos huecos, así que un componente pinta cualquiera sin
// preguntar cuál es. (Hubo un cuarto, `neutral`, el gris de la landing: se
// quitó porque junto a `light` no se distinguía. Ese gris sigue siendo el
// fondo de las diapositivas interiores: `INTERIOR`.)
// ============================================================

/**
 * @typedef {'dark'|'light'|'accent'} NombreTema
 * @typedef {{
 *   nombre: NombreTema,
 *   oscuro: boolean,    fondo oscuro: el logo y los iconos van en claro
 *   fondo: string,      el color de fondo
 *   texto: string,      titulares
 *   suave: string,      texto corrido
 *   tenue: string,      contadores, notas
 *   acento: string,     lo que va *entre asteriscos*
 *   linea: string,      filetes y bordes
 *   halo: string|null,  el brillo radial de fondo (solo en los oscuros)
 * }} Tema
 */

/** @type {Record<NombreTema, Tema>} */
export const TEMAS = {
  dark: {
    nombre: 'dark',
    oscuro: true,
    fondo: TINTA,
    texto: '#ffffff',
    suave: 'rgba(255,255,255,0.68)',
    tenue: 'rgba(255,255,255,0.5)',
    acento: ACENTO_CLARO,
    linea: 'rgba(255,255,255,0.14)',
    halo: `${ACENTO}38`,
  },
  light: {
    nombre: 'light',
    oscuro: false,
    fondo: FONDO,
    texto: TINTA,
    suave: TINTA_SUAVE,
    tenue: TINTA_TENUE,
    acento: ACENTO,
    linea: LINEA,
    halo: null,
  },
  // Sobre el azul, el resaltado va en tinta: un color de reclamo (amarillo)
  // se descartó por barato, y el azul claro no se distingue del blanco.
  accent: {
    nombre: 'accent',
    oscuro: true,
    fondo: ACENTO,
    texto: '#ffffff',
    suave: 'rgba(255,255,255,0.8)',
    tenue: 'rgba(255,255,255,0.62)',
    acento: TINTA,
    linea: 'rgba(255,255,255,0.22)',
    halo: 'rgba(255,255,255,0.16)',
  },
}

export const NOMBRES_TEMA = Object.keys(TEMAS)

/** El fondo de las diapositivas interiores y de las demos: el gris cálido de la landing. */
export const INTERIOR = { ...TEMAS.light, nombre: 'interior', fondo: FONDO_ALT }

/** El tema por su nombre; si no existe, el error dice cuáles hay. */
export function tema(nombre = 'dark') {
  const t = TEMAS[nombre]
  if (!t) throw new Error(`tema desconocido "${nombre}". Hay: ${NOMBRES_TEMA.join(', ')}`)
  return t
}

/** El fondo con su halo, listo para `style.background`. */
export const fondoDe = (t, donde = '50% 42%') =>
  t.halo ? `radial-gradient(circle at ${donde}, ${t.halo} 0%, transparent 56%), ${t.fondo}` : t.fondo
