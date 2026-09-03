// ============================================================
// MÓDULO 4.1 — 🎲 "SORPRÉNDEME"
//
// Aleatorio CONTROLADO. La gracia no está en el azar sino en el espacio del
// que se muestrea: solo combinaciones que ya sabemos que funcionan.
//
// Tres decisiones acotadas:
//   1. Un preset del catálogo -> hereda estructura y acabado coherentes.
//   2. Un tono de marca dentro de rangos con carácter, y el resto de la
//      paleta DERIVADA por teoría del color + WCAG (nunca elegida al azar).
//   3. Una tipografía de la lista compatible con el tono de ese preset.
//
// Después pasa por los guardarraíles, así que el resultado es siempre válido.
// ============================================================

import { PRESETS } from '../registry/presets'
import { TYPE_PAIRINGS } from '../registry/fonts'
import { safePalette, hexToHsl, hslToHex } from './color'
import { deepMerge } from '../config/patch'

const pick = (arr, rng) => arr[Math.floor(rng() * arr.length)]
const between = (min, max, rng) => min + rng() * (max - min)

/**
 * Familias de tono en las que un hue funciona bien como color de marca.
 * Se evitan las franjas donde el ojo humano percibe suciedad (amarillo-verde
 * apagado, naranja-marrón desaturado) salvo que se vayan a saturar mucho.
 */
const HUE_FAMILIES = [
  { name: 'azul', range: [200, 245], sat: [55, 78], light: [38, 52] },
  { name: 'índigo', range: [245, 268], sat: [50, 72], light: [42, 56] },
  { name: 'verde', range: [140, 178], sat: [42, 68], light: [30, 42] },
  { name: 'teal', range: [172, 195], sat: [50, 75], light: [30, 44] },
  { name: 'ciruela', range: [285, 320], sat: [45, 65], light: [38, 50] },
  { name: 'terracota', range: [14, 30], sat: [55, 75], light: [40, 50] },
  { name: 'vino', range: [340, 358], sat: [48, 66], light: [36, 46] },
]

/** Tipografías que pegan con cada estética. Armonía, no capricho. */
const TYPE_AFFINITY = {
  'neo-brutalism': ['space-grotesk', 'archivo-black', 'bricolage-work'],
  glassmorphism: ['sora', 'inter-clean', 'outfit'],
  claymorphism: ['outfit', 'bricolage-work', 'inter-clean'],
  cyberpunk: ['chakra-mono', 'space-grotesk'],
  'minimalist-flat': ['inter-clean', 'playfair', 'sora'],
  'material-clean': ['inter-clean', 'sora', 'space-grotesk'],
}

const SECTION_POOL = {
  hero: ['split', 'centered', 'image'],
  features: ['grid', 'rows', 'bento'],
  carousel: ['peek', 'cards', 'full'],
  testimonial: ['quote', 'grid'],
  cta: ['boxed', 'banner'],
}

/**
 * @param {{ seed?: number, keepPalette?: boolean, category?: 'trend'|'commercial' }} [opts]
 * @returns {object} configuración completa, aún sin pasar por guardarraíles
 */
export function randomConfig(opts = {}) {
  const { seed, keepPalette = false, category } = opts
  const rng = seed == null ? Math.random : mulberry32(seed)

  const pool = category ? PRESETS.filter((p) => p.category === category) : PRESETS
  const preset = pick(pool, rng)
  const base = structuredClone(preset.config)

  // --- paleta derivada, no sorteada ---
  if (!keepPalette) {
    const family = pick(HUE_FAMILIES, rng)
    const primary = hslToHex({
      h: between(family.range[0], family.range[1], rng),
      s: between(family.sat[0], family.sat[1], rng),
      l: between(family.light[0], family.light[1], rng),
    })
    const scheme = base.meta?.mode === 'dark' ? 'dark' : 'light'
    // El neo-brutalismo depende de un fondo saturado y plano: se respeta.
    if (preset.config.aesthetic !== 'neo-brutalism') {
      base.palette = safePalette(primary, { scheme })
    } else {
      const { h } = hexToHsl(primary)
      base.palette = {
        ...base.palette,
        neutralBg: hslToHex({ h, s: 92, l: 62 }),
        accent: primary,
      }
    }
  }

  // --- tipografía con afinidad ---
  const affine = TYPE_AFFINITY[base.aesthetic] ?? TYPE_PAIRINGS.map((t) => t.id)
  const typeId = pick(affine, rng)
  const pairing = TYPE_PAIRINGS.find((t) => t.id === typeId)
  if (pairing) {
    base.typography = { ...pairing.values }
    base.meta = { ...base.meta, typeId }
  }

  // --- variación estructural: cambia la página, no el acabado ---
  for (const [key, options] of Object.entries(SECTION_POOL)) {
    base.sections[key] = pick(options, rng)
  }

  base.meta = { ...base.meta, presetId: preset.id, aestheticId: base.aesthetic }
  return base
}

/** Variación suave: conserva el preset y solo mueve color y tipografía. */
export function reshuffleIdentity(config) {
  const family = pick(HUE_FAMILIES, Math.random)
  const primary = hslToHex({
    h: between(family.range[0], family.range[1], Math.random),
    s: between(family.sat[0], family.sat[1], Math.random),
    l: between(family.light[0], family.light[1], Math.random),
  })
  const scheme = config.meta?.mode === 'dark' ? 'dark' : 'light'
  const affine = TYPE_AFFINITY[config.aesthetic] ?? TYPE_PAIRINGS.map((t) => t.id)
  const typeId = pick(affine, Math.random)
  const pairing = TYPE_PAIRINGS.find((t) => t.id === typeId)

  return deepMerge(config, {
    palette: safePalette(primary, { scheme }),
    typography: pairing ? { ...pairing.values } : {},
    meta: { typeId },
  })
}

/** PRNG determinista, para poder reproducir un resultado a partir de una semilla. */
function mulberry32(a) {
  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
