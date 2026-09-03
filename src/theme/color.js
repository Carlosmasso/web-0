// ============================================================
// COLOR: conversión, contraste WCAG y derivación segura de paleta.
// Sin dependencias. Todo opera sobre hex de 6 dígitos.
// ============================================================

export function hexToRgb(hex) {
  const m = String(hex).trim().replace('#', '')
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  if (full.length < 6) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
const hex2 = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')

export const rgbToHex = ({ r, g, b }) => `#${hex2(r)}${hex2(g)}${hex2(b)}`

export function rgbToHsl({ r, g, b }) {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const d = max - min
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === R) h = ((G - B) / d + (G < B ? 6 : 0)) / 6
    else if (max === G) h = ((B - R) / d + 2) / 6
    else h = ((R - G) / d + 4) / 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToRgb({ h, s, l }) {
  const H = ((h % 360) + 360) % 360 / 360
  const S = clamp(s, 0, 100) / 100
  const L = clamp(l, 0, 100) / 100
  if (S === 0) return { r: L * 255, g: L * 255, b: L * 255 }
  const q = L < 0.5 ? L * (1 + S) : L + S - L * S
  const p = 2 * L - q
  const channel = (t) => {
    let T = t
    if (T < 0) T += 1
    if (T > 1) T -= 1
    if (T < 1 / 6) return p + (q - p) * 6 * T
    if (T < 1 / 2) return q
    if (T < 2 / 3) return p + (q - p) * (2 / 3 - T) * 6
    return p
  }
  return { r: channel(H + 1 / 3) * 255, g: channel(H) * 255, b: channel(H - 1 / 3) * 255 }
}

export const hexToHsl = (hex) => rgbToHsl(hexToRgb(hex))
export const hslToHex = (hsl) => rgbToHex(hslToRgb(hsl))

/** Ajusta canales HSL de un hex conservando el resto. */
export function adjust(hex, patch) {
  return hslToHex({ ...hexToHsl(hex), ...patch })
}

export function mix(a, b, t) {
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  return rgbToHex({
    r: A.r + (B.r - A.r) * t,
    g: A.g + (B.g - A.g) * t,
    b: A.b + (B.b - A.b) * t,
  })
}

// ---------- WCAG ----------

/** Luminancia relativa según WCAG 2.1. */
export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex)
  const lin = (v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** Ratio de contraste 1:1 – 21:1. */
export function contrastRatio(a, b) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export const isDark = (hex) => relativeLuminance(hex) < 0.42

/**
 * Empuja la luminosidad de `fg` (alejándola del fondo) hasta alcanzar el ratio
 * pedido. Conserva tono y saturación, así que el color sigue siendo "el mismo".
 */
export function ensureContrast(fg, bg, target = 4.5) {
  if (contrastRatio(fg, bg) >= target) return fg
  const towardsWhite = isDark(bg)
  const hsl = hexToHsl(fg)
  let best = fg
  let bestRatio = contrastRatio(fg, bg)

  for (let i = 1; i <= 100; i++) {
    const l = clamp(hsl.l + (towardsWhite ? i : -i), 0, 100)
    const candidate = hslToHex({ ...hsl, l })
    const ratio = contrastRatio(candidate, bg)
    if (ratio > bestRatio) {
      bestRatio = ratio
      best = candidate
    }
    if (ratio >= target) return candidate
    if (l === 0 || l === 100) break
  }
  // Último recurso: blanco o negro puros, lo que más contraste dé.
  return bestRatio >= contrastRatio(towardsWhite ? '#ffffff' : '#000000', bg)
    ? best
    : towardsWhite
      ? '#ffffff'
      : '#000000'
}

/** Blanco o negro, el que lea mejor sobre `bg`. */
export const onColor = (bg) =>
  contrastRatio('#ffffff', bg) >= contrastRatio('#0a0a0a', bg) ? '#ffffff' : '#0a0a0a'

// ---------- derivación segura ----------

/**
 * MÓDULO 4.2 — Validador automático de contraste.
 *
 * Recibe el color de marca elegido por el usuario y devuelve un bloque
 * `palette` completo en el que ninguna combinación de lectura baja de los
 * umbrales WCAG, independientemente de lo salvaje que sea el color de entrada.
 *
 *   texto principal  >= 7.0 : 1   (AAA cuerpo)
 *   texto atenuado   >= 4.5 : 1   (AA cuerpo)
 *   acento sobre fondo >= 3.0 : 1 (AA no textual / texto grande)
 *
 * @param {string} primary  hex de marca
 * @param {{ scheme?: 'light'|'dark', tint?: number }} [opts]
 */
export function safePalette(primary, opts = {}) {
  const { scheme = 'light', tint = 1 } = opts
  const { h, s } = hexToHsl(primary)
  const dark = scheme === 'dark'

  // El neutro nunca es gris puro: lleva una pizca del tono de marca, que es
  // lo que separa una paleta "elegida" de una "heredada".
  const neutralBg = hslToHex({
    h,
    s: clamp(s * 0.14 * tint, 0, dark ? 26 : 20),
    l: dark ? 6.5 : 97.5,
  })
  const neutralSurface = hslToHex({
    h,
    s: clamp(s * 0.12 * tint, 0, dark ? 22 : 14),
    l: dark ? 11 : 100,
  })

  const textPrimary = ensureContrast(
    hslToHex({ h, s: clamp(s * 0.2, 0, dark ? 16 : 22), l: dark ? 95 : 13 }),
    neutralBg,
    7,
  )
  const textMuted = ensureContrast(
    hslToHex({ h, s: clamp(s * 0.16, 0, dark ? 14 : 18), l: dark ? 66 : 42 }),
    neutralBg,
    4.5,
  )

  // El acento se corrige contra el FONDO, que es donde se lee.
  const accent = ensureContrast(primary, neutralBg, 3)
  // Y el primario contra la superficie, que es donde se apoyan las tarjetas.
  const safePrimary = ensureContrast(primary, neutralSurface, 3)

  return {
    primary: safePrimary,
    secondary: hslToHex({ h: h + 32, s: clamp(s, 25, 85), l: dark ? 62 : 46 }),
    accent,
    neutralBg,
    neutralSurface,
    textPrimary,
    textMuted,
  }
}

/** Informe legible para la interfaz: qué pares cumplen y cuáles no. */
export function auditPalette(palette) {
  const pairs = [
    ['Texto sobre fondo', palette.textPrimary, palette.neutralBg, 7],
    ['Texto atenuado sobre fondo', palette.textMuted, palette.neutralBg, 4.5],
    ['Texto sobre superficie', palette.textPrimary, palette.neutralSurface, 7],
    ['Acento sobre fondo', palette.accent, palette.neutralBg, 3],
    ['Texto sobre color primario', onColor(palette.primary), palette.primary, 4.5],
  ]
  return pairs.map(([label, fg, bg, target]) => {
    const ratio = contrastRatio(fg, bg)
    return { label, ratio: Math.round(ratio * 100) / 100, target, pass: ratio >= target }
  })
}
