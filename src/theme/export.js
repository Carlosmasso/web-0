// ============================================================
// MÓDULO 4.3 — EXPORTADOR DE CÓDIGO
//
// Portabilidad = argumento de venta. El cliente paga porque se lleva algo
// que funciona fuera de la herramienta, no un lock-in.
//
// Tres salidas desde el mismo contrato:
//   tailwind.config.js   proyectos con Tailwind
//   theme.css            :root en CSS puro, sin dependencias
//   design-tokens.json   formato W3C, para Figma / Style Dictionary
// ============================================================

import { resolveTheme } from './resolve'
import { hexToHsl } from './color'

const RADIUS_PX = { none: '0px', soft: '10px', round: '24px', pill: '9999px' }
const BORDER_PX = { thin: '1px', thick: '3px' }

/** Escala tipográfica desplegada a partir de la razón modular. */
function typeScale(ratio) {
  const steps = { sm: -1, base: 0, lg: 1, xl: 2, '2xl': 3, '3xl': 4, '4xl': 5 }
  return Object.fromEntries(
    Object.entries(steps).map(([k, n]) => [k, `${(1 * ratio ** n).toFixed(3)}rem`]),
  )
}

const familyList = (stack) =>
  stack
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)

/**
 * MÓDULO 4.3.a — tailwind.config.js
 * Mapea la configuración a `theme.extend` con nombres semánticos, de forma
 * que el usuario escriba `bg-surface text-muted rounded-brand shadow-brand`.
 */
export function exportTailwindConfig(config) {
  const { palette: p, typography: t, layout } = config
  const vars = resolveTheme(config)

  const colors = {
    primary: p.primary,
    secondary: p.secondary,
    accent: p.accent,
    bg: p.neutralBg,
    surface: p.neutralSurface,
    ink: p.textPrimary,
    muted: p.textMuted,
    'on-primary': vars['--theme-on-primary'],
  }

  return `/** Generado por Estudio — no editar a mano.
 *  Preset: ${config.meta?.presetId ?? 'personalizado'} · Estética: ${config.aesthetic}
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: ${json(colors, 6)},
      fontFamily: {
        heading: ${JSON.stringify(familyList(t.headingFamily))},
        body: ${JSON.stringify(familyList(t.bodyFamily))},
        mono: ${JSON.stringify(familyList(t.monoFamily))},
      },
      fontSize: ${json(typeScale(t.scaleRatio), 6)},
      letterSpacing: { brand: '${t.headingTracking}' },
      borderRadius: {
        brand: '${RADIUS_PX[config.borders.radius] ?? '10px'}',
        'brand-sm': 'calc(${RADIUS_PX[config.borders.radius] ?? '10px'} * 0.6)',
      },
      borderWidth: { brand: '${BORDER_PX[config.borders.width] ?? '1px'}' },
      boxShadow: {
        brand: '${vars['--theme-shadow'].replace(/'/g, "\\'")}',
      },
      backgroundImage: {
        'brand-gradient': '${vars['--theme-gradient']}',
        'brand-backdrop': '${vars['--theme-gradient-bg']}',
      },
      maxWidth: { container: '${layout.containerWidth}px' },
      backdropBlur: { brand: '${config.effects.blur}px' },
    },
  },
  plugins: [],
}
`
}

/**
 * MÓDULO 4.3.b — theme.css
 * Las mismas decisiones como custom properties nativas. Cero dependencias:
 * se pega en cualquier proyecto y funciona.
 */
export function exportCssVariables(config) {
  const vars = resolveTheme(config)
  const lines = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')

  const { h, s, l } = hexToHsl(config.palette.primary)

  return `/* Generado por Estudio — preset: ${config.meta?.presetId ?? 'personalizado'} */

:root {
${lines}

  /* Canales sueltos del color de marca, para componer opacidades:
     background: hsl(var(--brand-h) var(--brand-s) var(--brand-l) / 12%); */
  --brand-h: ${h.toFixed(1)}deg;
  --brand-s: ${s.toFixed(1)}%;
  --brand-l: ${l.toFixed(1)}%;
}

[data-aesthetic='${config.aesthetic}'] {
  /* El comportamiento por estética (gestos al pulsar, foco, superficies)
     se importa aparte desde el runtime de Estudio. */
}
`
}

/** MÓDULO 4.3.c — design tokens en formato W3C, para Figma o Style Dictionary. */
export function exportDesignTokens(config) {
  const { palette: p, typography: t } = config
  const color = (v) => ({ $type: 'color', $value: v })

  return JSON.stringify(
    {
      $description: `Estudio · ${config.meta?.presetId ?? 'personalizado'}`,
      color: {
        primary: color(p.primary),
        secondary: color(p.secondary),
        accent: color(p.accent),
        background: color(p.neutralBg),
        surface: color(p.neutralSurface),
        text: color(p.textPrimary),
        'text-muted': color(p.textMuted),
      },
      typography: {
        heading: { $type: 'fontFamily', $value: familyList(t.headingFamily) },
        body: { $type: 'fontFamily', $value: familyList(t.bodyFamily) },
        scale: { $type: 'number', $value: t.scaleRatio },
      },
      radius: { brand: { $type: 'dimension', $value: RADIUS_PX[config.borders.radius] } },
      border: { brand: { $type: 'dimension', $value: BORDER_PX[config.borders.width] } },
    },
    null,
    2,
  )
}

/** Los tres artefactos a la vez, listos para un .zip o para pestañas en un modal. */
export function exportBundle(config) {
  return [
    { filename: 'tailwind.config.js', language: 'javascript', content: exportTailwindConfig(config) },
    { filename: 'theme.css', language: 'css', content: exportCssVariables(config) },
    { filename: 'design-tokens.json', language: 'json', content: exportDesignTokens(config) },
  ]
}

/** Dispara la descarga de un artefacto en el navegador. */
export function downloadArtifact({ filename, content }) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function json(obj, indent) {
  return JSON.stringify(obj, null, 2).split('\n').join('\n' + ' '.repeat(indent))
}
