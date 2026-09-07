// ============================================================
// EL RESOLUTOR
//
// Función pura: contrato JSON -> mapa plano de custom properties.
// Sin React, sin DOM, testeable de forma aislada. Toda la derivación de color
// se hace con color-mix() nativo, así que no entra ninguna librería de color
// en el bundle.
// ============================================================

/* Escalas: única fuente de verdad para traducir intención -> CSS. */
const RADIUS = { none: '0px', soft: '10px', round: '24px' }
const BORDER = { thin: '1px', thick: '3px' }

const round1 = (n) => Math.round(n * 10) / 10

/** @param {import('../config/schema').Gradient | null} g */
export function gradientToCss(g) {
  if (!g || !Array.isArray(g.stops) || g.stops.length === 0) return 'none'
  const stops = [...g.stops]
    .sort((a, b) => a.at - b.at)
    .map((s) => `${s.color} ${s.at}%`)
    .join(', ')

  switch (g.type) {
    case 'conic':
      return `conic-gradient(from ${g.angle}deg at ${g.position ?? '50% 50%'}, ${stops})`
    case 'radial':
      return `radial-gradient(${g.position ?? 'circle at 50% 0%'}, ${stops})`
    default:
      return `linear-gradient(${g.angle}deg, ${stops})`
  }
}

/* Cada receta recibe el color de sombra resuelto y la intensidad. */
const SHADOWS = {
  none: () => 'none',

  'flat-hard': (c, i) => `${round1(5 * i)}px ${round1(5 * i)}px 0 0 ${c}`,

  'soft-elevation': (c, i) =>
    `0 1px 2px color-mix(in srgb, ${c} ${round1(7 * i)}%, transparent), ` +
    `0 ${round1(14 * i)}px ${round1(34 * i)}px -${round1(12 * i)}px ` +
    `color-mix(in srgb, ${c} ${round1(22 * i)}%, transparent)`,

  'inset-3d': (c, i) =>
    `inset 0 3px 5px color-mix(in srgb, white 55%, transparent), ` +
    `inset 0 -${round1(7 * i)}px ${round1(12 * i)}px color-mix(in srgb, ${c} 16%, transparent), ` +
    `0 ${round1(12 * i)}px ${round1(24 * i)}px -${round1(9 * i)}px color-mix(in srgb, ${c} 26%, transparent)`,

  'glowing-neon': (c, i) =>
    `0 0 0 1px color-mix(in srgb, ${c} 55%, transparent), ` +
    `0 0 ${round1(10 * i)}px color-mix(in srgb, ${c} 55%, transparent), ` +
    `0 0 ${round1(32 * i)}px -4px ${c}`,
}

/**
 * Luminancia percibida de un hex. Se usa para decidir texto sobre color y
 * para saber si el tema es oscuro sin necesidad de una bandera en el contrato.
 */
export function luminance(hex) {
  const m = String(hex).trim().replace('#', '')
  const full = m.length === 3 ? m.split('').map((ch) => ch + ch).join('') : m
  if (full.length < 6) return 1
  const ch = (i) => parseInt(full.slice(i, i + 2), 16) / 255
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(ch(0)) + 0.7152 * lin(ch(2)) + 0.0722 * lin(ch(4))
}

const contrastFor = (hex) => (luminance(hex) > 0.42 ? '#0a0a0a' : '#ffffff')

/**
 * @param {typeof import('../config/schema').DEFAULT_CONFIG} c
 * @returns {Record<string, string>}
 */
export function resolveTheme(c) {
  const { palette: p, borders: b, shadows: s, typography: t } = c

  const borderColor =
    b.color === 'auto'
      ? `color-mix(in srgb, ${p.textPrimary} 16%, ${p.neutralSurface})`
      : b.color

  const shadowColor =
    s.color === 'auto' ? (s.style === 'glowing-neon' ? p.accent : p.textPrimary) : s.color

  const radius = RADIUS[b.radius] ?? RADIUS.soft

  return {
    /* paleta */
    '--theme-primary': p.primary,
    '--theme-secondary': p.secondary,
    '--theme-accent': p.accent,
    '--theme-bg': p.neutralBg,
    '--theme-surface': p.neutralSurface,
    '--theme-surface-2': `color-mix(in srgb, ${p.textPrimary} 8%, ${p.neutralBg})`,
    '--theme-text': p.textPrimary,
    '--theme-text-muted': p.textMuted,
    '--theme-on-primary': contrastFor(p.primary),
    '--theme-on-accent': contrastFor(p.accent),

    /* bordes */
    '--theme-radius': radius,
    '--theme-radius-sm': `calc(${radius} * 0.6)`,
    '--theme-border-w': BORDER[b.width] ?? BORDER.thin,
    '--theme-border-style': b.style,
    '--theme-border-color': borderColor,

    /* sombras */
    '--theme-shadow': (SHADOWS[s.style] ?? SHADOWS.none)(shadowColor, s.intensity),
    '--theme-shadow-color': shadowColor,

    /* degradados. `--theme-gradient` alimenta el relleno "Degradado" del botón
       principal; como primaryGradient casi siempre es null, sin un derivado
       ese relleno no pintaba nada. El derivado va de la marca a una mezcla
       marca+acento: siempre visible, siempre coherente con la paleta. */
    '--theme-gradient': c.gradients.primaryGradient
      ? gradientToCss(c.gradients.primaryGradient)
      : `linear-gradient(120deg, ${p.primary}, color-mix(in srgb, ${p.primary} 55%, ${p.accent}))`,
    '--theme-gradient-bg': gradientToCss(c.gradients.backgroundGradient),

    /* Degradado de portada: SIEMPRE existe (a diferencia de primaryGradient,
       que suele ser null). Un lavado diagonal suave de la paleta, ya calibrado
       para no comerse el contraste del titular. */
    '--theme-hero-grad':
      `linear-gradient(165deg, ` +
      `color-mix(in srgb, ${p.primary} 16%, ${p.neutralBg}) 0%, ` +
      `${p.neutralBg} 46%, ` +
      `color-mix(in srgb, ${p.secondary} 13%, ${p.neutralBg}) 100%)`,

    /* Malla de fondo: tres manchas radiales derivadas de la paleta, fijas en
       las esquinas. Sobre fondo claro son un lavado tenue; sobre oscuro, un
       resplandor. La usa `.pv-canvas[data-mesh='on']::before`. */
    '--theme-mesh':
      `radial-gradient(42% 38% at 12% 8%, color-mix(in srgb, ${p.primary} 20%, transparent), transparent 62%), ` +
      `radial-gradient(38% 34% at 88% 6%, color-mix(in srgb, ${p.secondary} 16%, transparent), transparent 58%), ` +
      `radial-gradient(48% 44% at 72% 92%, color-mix(in srgb, ${p.accent} 14%, transparent), transparent 66%)`,

    /* efectos */
    '--theme-blur': c.effects.blur > 0 ? `blur(${c.effects.blur}px) saturate(1.4)` : 'none',

    /* tipografía */
    '--theme-font-heading': t.headingFamily,
    '--theme-font-body': t.bodyFamily,
    '--theme-font-mono': t.monoFamily,
    '--theme-heading-weight': String(t.headingWeight),
    '--theme-heading-case': t.headingCase,
    '--theme-heading-track': t.headingTracking,
    '--theme-scale': String(t.scaleRatio),

    /* layout — la densidad es fija (normal); se mantiene el token por si
       algún día vuelve a ser una elección. */
    '--theme-space': '1',
    '--theme-container': `${c.layout.containerWidth}px`,
    '--theme-card-pad': '24px',
  }
}

/** El motor deduce si el tema es oscuro midiendo el fondo, no con una bandera. */
export const schemeOf = (config) => (luminance(config.palette.neutralBg) > 0.42 ? 'light' : 'dark')
