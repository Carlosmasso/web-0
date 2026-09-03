// ============================================================
// MÓDULO 1.2 — EL MOTOR DE RESTRICCIONES
//
// Corre SIEMPRE justo antes de inyectar la configuración en el lienzo, venga
// del panel, de un enlace o de la base de datos.
//
// FILOSOFÍA (revisada): en las capas de cara al cliente, cada control hace
// EXACTAMENTE lo que dice. Si eliges "Suaves" en Esquinas, sales con esquinas
// suaves — nunca te teletransporta a otra estética ni te salta a la opción
// siguiente. El guardarraíl guía, no encierra:
//
//   recommend   marca el valor que mejor encaja con la estética. No bloquea.
//   clamp       acota rangos numéricos (los sliders no pueden pasarse).
//   scheme      cyberpunk necesita fondo oscuro (el neón sobre blanco no se ve).
//   coherence   arregla contradicciones que el usuario no puede ver.
//   a11y floor  contraste mínimo WCAG. Innegociable, para cualquier estética.
//
// Cambiar de mundo entero se hace en la capa 1 (presets y estética base), que
// aplica un juego de valores coherente de una vez. Los knobs sueltos de las
// capas 2 y 3 solo mueven su propia propiedad.
// ============================================================

import { normalizeConfig } from './schema'
import { setIn, getIn } from './patch'
import { safePalette, contrastRatio, ensureContrast, onColor, isDark } from '../theme/color'

/**
 * Reglas por estética.
 *   recommend  { path: valor }  — el valor que el panel marca como "recomendado".
 *   clamp      { path: [min, max] }  — rango numérico sano.
 *   requireScheme  'dark'  — fuerza fondo oscuro (accesibilidad del neón).
 *   note       una línea que explica la recomendación.
 */
export const GUARDRAILS = {
  'neo-brutalism': {
    label: 'Neo-brutalismo',
    recommend: {
      'borders.radius': 'none',
      'borders.width': 'thick',
      'borders.style': 'solid',
      'shadows.style': 'flat-hard',
      'components.button.shape': 'sharp',
    },
    clamp: { 'shadows.intensity': [1, 1.8] },
    note: 'Encaja con esquinas rectas, trazo grueso y sombra sólida.',
  },

  glassmorphism: {
    label: 'Glassmorfismo',
    recommend: {
      'borders.radius': 'round',
      'borders.width': 'thin',
      'shadows.style': 'soft-elevation',
      'components.button.shape': 'pill',
    },
    clamp: { 'effects.blur': [8, 30], 'shadows.intensity': [1, 2] },
    minBlur: 10,
    note: 'Necesita algo de desenfoque para leerse como cristal.',
  },

  claymorphism: {
    label: 'Claymorfismo',
    recommend: {
      'borders.radius': 'round',
      'borders.width': 'thin',
      'shadows.style': 'inset-3d',
      'components.button.shape': 'pill',
    },
    clamp: { 'shadows.intensity': [0.9, 1.6] },
    note: 'La arcilla pide esquinas redondeadas y volumen interior.',
  },

  cyberpunk: {
    label: 'Cyberpunk',
    recommend: {
      'borders.radius': 'none',
      'borders.width': 'thin',
      'shadows.style': 'glowing-neon',
      'components.button.fill': 'outline',
    },
    clamp: { 'shadows.intensity': [1, 1.8] },
    requireScheme: 'dark',
    note: 'El neón solo resplandece sobre fondo oscuro.',
  },

  'minimalist-flat': {
    label: 'Minimalista',
    recommend: {
      'borders.radius': 'soft',
      'borders.width': 'thin',
      'shadows.style': 'none',
    },
    note: 'El minimalismo se sostiene en el espacio, no en el relieve.',
  },

  'material-clean': {
    label: 'Material limpio',
    recommend: {
      'borders.radius': 'soft',
      'shadows.style': 'soft-elevation',
    },
    clamp: { 'shadows.intensity': [0.4, 1.4] },
    note: 'La elevación suave es lo que hace legible la jerarquía.',
  },
}

/** Umbrales de accesibilidad. Ninguna estética se los salta. */
const A11Y = {
  textPrimary: 7,
  textMuted: 4.5,
  accent: 3,
  onPrimary: 4.5,
}

/**
 * @param {object} userConfig  configuración cruda
 * @returns {{ config: object, violations: Array, audit: Array }}
 */
export function normalizeConfigWithGuardrails(userConfig) {
  let config = normalizeConfig(userConfig)
  const violations = []
  const rules = GUARDRAILS[config.aesthetic]

  if (rules) {
    // --- clamp: rangos numéricos ---
    for (const [path, [min, max]] of Object.entries(rules.clamp ?? {})) {
      const current = Number(getIn(config, path))
      const next = Math.min(max, Math.max(min, Number.isFinite(current) ? current : min))
      if (next !== current) {
        violations.push({
          path,
          from: current,
          to: next,
          fromLabel: String(current),
          toLabel: String(next),
          reason: rules.note,
        })
        config = setIn(config, path, next)
      }
    }

    // --- cristal sin desenfoque no es cristal ---
    if (rules.minBlur && Number(getIn(config, 'effects.blur')) < rules.minBlur) {
      violations.push({
        path: 'effects.blur',
        from: getIn(config, 'effects.blur'),
        to: rules.minBlur,
        fromLabel: 'sin desenfoque',
        toLabel: `${rules.minBlur} px`,
        reason: rules.note,
      })
      config = setIn(config, 'effects.blur', rules.minBlur)
    }

    // --- cyberpunk necesita fondo oscuro (accesibilidad del neón) ---
    if (rules.requireScheme === 'dark' && !isDark(config.palette.neutralBg)) {
      const safe = safePalette(config.palette.primary, { scheme: 'dark' })
      violations.push({
        path: 'palette',
        from: config.palette.neutralBg,
        to: safe.neutralBg,
        fromLabel: 'Fondo claro',
        toLabel: 'Fondo oscuro',
        reason: rules.note,
        a11y: true,
      })
      config = setIn(config, 'palette', { ...config.palette, ...safe })
      config = setIn(config, 'meta', { ...config.meta, mode: 'dark' })
    }
  }

  // --- coherencia entre nodos (contradicciones invisibles) ---
  if (config.components.hero.background === 'aurora' && !config.effects.aurora) {
    config = setIn(config, 'effects.aurora', true)
  }

  // --- suelo de accesibilidad: SIEMPRE ---
  config = enforceContrast(config, violations)

  return { config, violations, audit: auditConfig(config) }
}

/**
 * Corrige la paleta hasta que todos los pares de lectura cumplen WCAG,
 * moviendo solo la luminosidad para que el color siga siendo reconocible.
 */
function enforceContrast(config, violations = []) {
  const p = { ...config.palette }
  const fix = (key, bg, target, label) => {
    const before = p[key]
    const after = ensureContrast(before, bg, target)
    if (after !== before) {
      violations.push({
        path: `palette.${key}`,
        from: before,
        to: after,
        fromLabel: before,
        toLabel: after,
        reason: `Contraste insuficiente: ${label} necesita ${target}:1.`,
        a11y: true,
      })
      p[key] = after
    }
  }

  fix('textPrimary', p.neutralBg, A11Y.textPrimary, 'el texto sobre el fondo')
  fix('textMuted', p.neutralBg, A11Y.textMuted, 'el texto atenuado')
  fix('accent', p.neutralBg, A11Y.accent, 'el color de acento')

  if (contrastRatio(onColor(p.primary), p.primary) < A11Y.onPrimary) {
    p.primary = ensureContrast(p.primary, onColor(p.primary), A11Y.onPrimary)
  }

  return setIn(config, 'palette', p)
}

/** Informe de accesibilidad de la configuración final. */
export function auditConfig(config) {
  const p = config.palette
  const checks = [
    ['Texto sobre fondo', p.textPrimary, p.neutralBg, A11Y.textPrimary],
    ['Texto atenuado', p.textMuted, p.neutralBg, A11Y.textMuted],
    ['Texto sobre tarjeta', p.textPrimary, p.neutralSurface, A11Y.textPrimary],
    ['Acento sobre fondo', p.accent, p.neutralBg, A11Y.accent],
    ['Texto sobre botón', onColor(p.primary), p.primary, A11Y.onPrimary],
  ]
  return checks.map(([label, fg, bg, target]) => {
    const ratio = Math.round(contrastRatio(fg, bg) * 100) / 100
    return { label, ratio, target, pass: ratio >= target }
  })
}

/** El valor recomendado para un campo bajo la estética activa, o null. */
export function recommendedValue(aesthetic, path) {
  return GUARDRAILS[aesthetic]?.recommend?.[path] ?? null
}
