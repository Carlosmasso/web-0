// ============================================================
// EL CONTRATO DE DATOS
//
// Un objeto serializable que describe por completo un sitio. Se divide en dos
// canales que viajan por vías distintas (ver src/preview/PreviewCanvas.jsx):
//
//   COSMÉTICO   palette · typography · borders · shadows · gradients ·
//               effects · layout
//               -> custom properties escritas por referencia. Cero re-renders.
//
//   ESTRUCTURAL aesthetic · motion · iconSet · sections · components
//               -> contexto de React. Cambia el DOM que se monta.
//
// El contrato guarda VALORES resueltos (hex, familias) para ser portable y
// autodescriptivo. `meta` solo registra de qué preset salieron, para que la
// interfaz pueda marcar la opción activa; el motor de render lo ignora.
// ============================================================

/**
 * @typedef {'none'|'soft'|'round'|'pill'} RadiusToken
 * @typedef {'thin'|'thick'} WidthToken
 * @typedef {'solid'|'dashed'} BorderStyle
 * @typedef {'flat-hard'|'soft-elevation'|'inset-3d'|'glowing-neon'|'none'} ShadowToken
 * @typedef {'neo-brutalism'|'glassmorphism'|'claymorphism'|'cyberpunk'|'minimalist-flat'|'material-clean'} Aesthetic
 *
 * @typedef {{ color: string, at: number }} GradientStop
 * @typedef {{ type: 'linear'|'radial'|'conic', angle: number, position?: string, stops: GradientStop[] }} Gradient
 */

export const AESTHETICS = [
  'neo-brutalism',
  'glassmorphism',
  'claymorphism',
  'cyberpunk',
  'minimalist-flat',
  'material-clean',
]

export const SECTION_ORDER = ['hero', 'features', 'carousel', 'testimonial', 'cta']

export const DEFAULT_CONFIG = {
  version: 1,

  // ---------- estructural ----------
  aesthetic: 'material-clean',
  motion: 'subtle', // none | subtle | expressive
  iconSet: 'phosphor', // phosphor | tabler

  sections: {
    hero: 'split', // split | centered | image
    features: 'grid', // grid | rows | bento
    carousel: 'peek', // peek | cards | full
    testimonial: 'quote', // quote | grid
    cta: 'boxed', // boxed | banner
  },

  components: {
    hero: { background: 'solid' }, // solid | gradient | aurora | image
    card: { media: 'auto' }, // auto | none  (auto = la variante decide)
    button: { shape: 'inherit', fill: 'solid' }, // inherit|pill|sharp · solid|outline|gradient
    input: { variant: 'outline' }, // outline | filled | underline
    carousel: { controls: 'arrows', peek: true, slidesPerView: 3 },
  },

  // ---------- cosmético ----------
  palette: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#2563eb',
    neutralBg: '#fafafa',
    neutralSurface: '#ffffff',
    textPrimary: '#18181b',
    textMuted: '#52525b',
  },

  typography: {
    headingFamily: '"Space Grotesk", system-ui, sans-serif',
    bodyFamily: '"Inter", system-ui, sans-serif',
    monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
    headingWeight: 700,
    headingCase: 'none', // none | uppercase
    headingTracking: '-0.02em',
    scaleRatio: 1.25,
  },

  borders: {
    radius: 'soft', // none | soft | round | pill
    width: 'thin', // thin | thick
    style: 'solid', // solid | dashed
    color: 'auto', // 'auto' | hex
  },

  shadows: {
    style: 'soft-elevation',
    color: 'auto', // 'auto' | hex
    intensity: 1, // 0.5 – 2
  },

  gradients: {
    primaryGradient: null,
    backgroundGradient: null,
  },

  effects: {
    blur: 0, // px de backdrop-filter; 0 lo desactiva
    noise: false,
    aurora: false,
  },

  layout: {
    density: 'normal', // compact | normal | spacious
    containerWidth: 1180,
  },

  // ---------- provenance, solo para la interfaz ----------
  meta: {
    paletteId: 'grafito',
    mode: 'light',
    typeId: 'space-grotesk',
    aestheticId: 'material-clean',
  },
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/** Fusiona en profundidad `input` sobre `base`, sin dejar entrar claves nuevas. */
function mergeInto(base, input) {
  if (!isObj(input)) return base
  for (const key of Object.keys(base)) {
    const b = base[key]
    const i = input[key]
    if (i === undefined) continue
    if (isObj(b)) mergeInto(b, i)
    else if (b === null || typeof i === typeof b) base[key] = i
    else if (b === null) base[key] = i
  }
  return base
}

/**
 * Protege una configuración decodificada contra claves ausentes o extrañas.
 * Los degradados se aceptan tal cual (o `null`) porque su forma es libre.
 */
export function normalizeConfig(input) {
  const base = structuredClone(DEFAULT_CONFIG)
  if (!isObj(input)) return base

  const gradients = input.gradients
  mergeInto(base, input)

  if (isObj(gradients)) {
    base.gradients.primaryGradient = normalizeGradient(gradients.primaryGradient)
    base.gradients.backgroundGradient = normalizeGradient(gradients.backgroundGradient)
  }
  return base
}

function normalizeGradient(g) {
  if (!isObj(g) || !Array.isArray(g.stops) || g.stops.length === 0) return null
  return {
    type: ['linear', 'radial', 'conic'].includes(g.type) ? g.type : 'linear',
    angle: Number.isFinite(g.angle) ? g.angle : 0,
    position: typeof g.position === 'string' ? g.position : undefined,
    stops: g.stops
      .filter((s) => isObj(s) && typeof s.color === 'string')
      .map((s) => ({ color: s.color, at: Number.isFinite(s.at) ? s.at : 0 })),
  }
}
