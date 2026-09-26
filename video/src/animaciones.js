import { interpolate, spring } from 'remotion'
import { MUELLE } from './marca'

// ============================================================
// ANIMACIONES COMPARTIDAS
//
// Los gestos que se repiten en todos los vídeos, en un solo sitio. Son
// funciones puras que devuelven un progreso o un estilo: el componente decide
// dónde aplicarlo. Si un gesto cambia aquí, cambia en todos los reels.
// ============================================================

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }

/** Progreso 0 → 1 con muelle desde el fotograma `desde`. */
export const progreso = (frame, fps, desde, config = MUELLE.suave, durationInFrames) =>
  spring({ frame: frame - desde, fps, config, durationInFrames })

/** Entrada de un bloque: sube, crece un poco y aparece. */
export const entrar = (p, { dy = 160, desdeEscala = 0.92 } = {}) => ({
  opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
  transform: `translateY(${(1 - p) * dy}px) scale(${interpolate(p, [0, 1], [desdeEscala, 1])})`,
})

/** Salida de un bloque: sube y se desvanece. */
export const salir = (p, { dy = 60 } = {}) => ({
  opacity: 1 - p,
  transform: `translateY(${-dy * p}px)`,
})

/** Una palabra que sube y se enfoca (el gesto del intro). `tamano` en px. */
export const revelarPalabra = (p, tamano) => ({
  display: 'inline-block',
  opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
  transform: `translateY(${(1 - p) * tamano * 0.65}px)`,
  filter: `blur(${Math.max(0, 1 - p) * 10}px)`,
})

/**
 * Barrido: la capa nueva se pinta de arriba abajo sobre la anterior. Deja ver
 * que el CONTENIDO es el mismo y lo que cambia es el acabado, cosa que un
 * fundido no deja claro.
 */
export const barrido = (p) => ({ clipPath: `inset(0 0 ${(1 - p) * 100}% 0)` })

// ------------------------------------------------------------
// COLOR

const HEX = /^#([0-9a-f]{6})$/i

const aRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const aHex = (rgb) => '#' + rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')

/** Mezcla dos colores hex en el punto `t` (0 = a, 1 = b). */
export const mezclarHex = (a, b, t) => {
  const [x, y] = [aRgb(a), aRgb(b)]
  return aHex(x.map((c, i) => c + (y[i] - c) * t))
}

/**
 * Mezcla dos configs del contrato en `t`: los colores hex se interpolan, los
 * números también, y lo demás (fuentes, tokens) salta a la mitad. Como el
 * contrato guarda la paleta en hex y todo lo demás (sombras, degradados, texto
 * sobre botón) se deriva de ella, interpolar la paleta transforma la web
 * entera de forma continua, no un fundido entre dos capturas.
 */
export function mezclarConfig(a, b, t) {
  if (typeof a === 'string' && typeof b === 'string' && HEX.test(a) && HEX.test(b)) return mezclarHex(a, b, t)
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const salida = {}
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) salida[k] = mezclarConfig(a[k], b[k], t)
    return salida
  }
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) return a.map((x, i) => mezclarConfig(x, b[i], t))
  return t < 0.5 ? a : b
}
