// ============================================================
// MÓDULO 1.2 — EL MOTOR DE RESTRICCIONES
//
// Filtro que corre SIEMPRE antes de inyectar la configuración en el lienzo.
// Su trabajo es que el usuario no pueda producir un resultado roto, feo o
// ilegible, sin quitarle la sensación de estar decidiendo.
//
// Tres tipos de restricción por estética:
//
//   lock   el valor es constitutivo de la estética. Neo-brutalismo con
//          esquinas redondeadas deja de ser neo-brutalismo, así que se fuerza.
//   clamp  el valor es libre dentro de un rango sano.
//   floor  mínimos de accesibilidad, no negociables por ninguna estética.
//
// Devuelve { config, violations } en vez de mutar en silencio: el panel puede
// decir "he ajustado 3 cosas" y por qué, que es lo que convierte una caja
// negra frustrante en una herramienta en la que se confía.
// ============================================================

import { normalizeConfig } from './schema'
import { setIn, getIn } from './patch'
import { safePalette, contrastRatio, ensureContrast, onColor, isDark } from '../theme/color'
import { describeValue } from '../registry/vocabulary'

/**
 * Reglas por estética. Lo que NO aparece aquí queda libre para el usuario:
 * ese hueco es deliberado, es donde vive la sensación de autoría.
 */
export const GUARDRAILS = {
  'neo-brutalism': {
    label: 'Neo-brutalismo',
    lock: {
      'borders.radius': 'none',
      'borders.width': 'thick',
      'borders.style': 'solid',
      'shadows.style': 'flat-hard',
      'effects.blur': 0,
      'components.button.shape': 'sharp',
    },
    clamp: { 'shadows.intensity': [1, 1.8] },
    reason: 'El brutalismo vive de la esquina recta y la sombra sólida.',
  },

  glassmorphism: {
    label: 'Glassmorfismo',
    lock: {
      'borders.width': 'thin',
      'borders.style': 'solid',
      'shadows.style': 'soft-elevation',
    },
    clamp: { 'effects.blur': [10, 30], 'shadows.intensity': [1, 2] },
    allow: { 'borders.radius': ['soft', 'round', 'pill'] },
    reason: 'Sin desenfoque y con bordes duros, el cristal deja de leerse como cristal.',
  },

  claymorphism: {
    label: 'Claymorfismo',
    lock: {
      'borders.width': 'thin',
      'borders.style': 'solid',
      'shadows.style': 'inset-3d',
      'effects.blur': 0,
    },
    allow: { 'borders.radius': ['round', 'pill'] },
    clamp: { 'shadows.intensity': [0.9, 1.6] },
    reason: 'La arcilla necesita esquinas muy redondeadas para leerse como volumen.',
  },

  cyberpunk: {
    label: 'Cyberpunk',
    lock: {
      'borders.width': 'thin',
      'shadows.style': 'glowing-neon',
      'effects.blur': 0,
      'components.button.fill': 'outline',
    },
    allow: { 'borders.radius': ['none', 'soft'] },
    clamp: { 'shadows.intensity': [1, 1.8] },
    requireScheme: 'dark',
    reason: 'El neón solo resplandece sobre fondo oscuro.',
  },

  'minimalist-flat': {
    label: 'Minimalista',
    lock: { 'shadows.style': 'none', 'effects.blur': 0, 'effects.aurora': false },
    allow: { 'borders.radius': ['none', 'soft'], 'borders.width': ['thin'] },
    reason: 'El minimalismo se sostiene en el espacio, no en el relieve.',
  },

  'material-clean': {
    label: 'Material limpio',
    lock: { 'borders.style': 'solid', 'effects.blur': 0 },
    allow: { 'borders.radius': ['none', 'soft', 'round'], 'shadows.style': ['none', 'soft-elevation'] },
    clamp: { 'shadows.intensity': [0.4, 1.4] },
    reason: 'La elevación suave es lo que hace legible la jerarquía.',
  },
}

/** Umbrales de accesibilidad. Ninguna estética puede saltárselos. */
const A11Y = {
  textPrimary: 7, // AAA cuerpo
  textMuted: 4.5, // AA cuerpo
  accent: 3, // AA no textual
  onPrimary: 4.5,
}

function record(violations, path, from, to, reason) {
  if (from === to) return
  violations.push({
    path,
    from,
    to,
    fromLabel: describeValue(path, from),
    toLabel: describeValue(path, to),
    reason,
  })
}

/**
 * @param {object} userConfig  configuración cruda (del panel, del hash, de la BD)
 * @param {{ unlockAdvanced?: boolean }} [opts]
 *        unlockAdvanced omite los `lock` estéticos — nunca los de accesibilidad.
 * @returns {{ config: object, violations: Array, audit: Array }}
 */
export function normalizeConfigWithGuardrails(userConfig, opts = {}) {
  const { unlockAdvanced = false } = opts
  let config = normalizeConfig(userConfig)
  const violations = []

  const rules = GUARDRAILS[config.aesthetic]

  if (rules) {
    // --- 1. locks: valores constitutivos de la estética ---
    if (!unlockAdvanced) {
      for (const [path, value] of Object.entries(rules.lock ?? {})) {
        const current = getIn(config, path)
        record(violations, path, current, value, rules.reason)
        config = setIn(config, path, value)
      }
    }

    // --- 2. allow: listas blancas (se cae al primer valor válido) ---
    for (const [path, allowed] of Object.entries(rules.allow ?? {})) {
      const current = getIn(config, path)
      if (!allowed.includes(current)) {
        record(violations, path, current, allowed[0], rules.reason)
        config = setIn(config, path, allowed[0])
      }
    }

    // --- 3. clamp: rangos numéricos sanos ---
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
          reason: rules.reason,
        })
        config = setIn(config, path, next)
      }
    }

    // --- 4. esquema forzado (cyberpunk necesita fondo oscuro) ---
    if (rules.requireScheme === 'dark' && !isDark(config.palette.neutralBg)) {
      const safe = safePalette(config.palette.primary, { scheme: 'dark' })
      violations.push({
        path: 'palette',
        from: config.palette.neutralBg,
        to: safe.neutralBg,
        fromLabel: 'Fondo claro',
        toLabel: 'Fondo oscuro',
        reason: rules.reason,
      })
      config = setIn(config, 'palette', { ...config.palette, ...safe })
      config = setIn(config, 'meta', { ...config.meta, mode: 'dark' })
    }
  }

  // --- 5. coherencia entre nodos (independiente de la estética) ---
  // Pedir "portada con aurora" y dejar las luces apagadas es una contradicción
  // que el usuario no puede ver: se resuelve sola.
  if (config.components.hero.background === 'aurora' && !config.effects.aurora) {
    config = setIn(config, 'effects.aurora', true)
  }
  // El cristal esmerilado sin desenfoque no es cristal.
  if (config.aesthetic === 'glassmorphism' && config.effects.blur < 10) {
    config = setIn(config, 'effects.blur', 18)
  }

  // --- 6. suelo de accesibilidad: SIEMPRE, incluso en modo avanzado ---
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

  // El texto que va ENCIMA del primario se calcula, no se elige.
  if (contrastRatio(onColor(p.primary), p.primary) < A11Y.onPrimary) {
    p.primary = ensureContrast(p.primary, onColor(p.primary), A11Y.onPrimary)
  }

  return setIn(config, 'palette', p)
}

/** Informe de accesibilidad de la configuración final, para mostrar en el panel. */
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

/** ¿Qué campos están bloqueados ahora mismo? Para atenuarlos en el panel. */
export function lockedPaths(aesthetic) {
  const rules = GUARDRAILS[aesthetic]
  if (!rules) return new Set()
  return new Set(Object.keys(rules.lock ?? {}))
}

/**
 * ¿A qué estética PERTENECE un valor que la actual no admite?
 *
 * Convierte un callejón sin salida en un camino: si el usuario pide
 * "Táctil / 3D" estando en material-clean, no se le niega, se le lleva al
 * claymorfismo, que es donde ese relieve existe de verdad.
 */
export function ownerOfValue(path, value) {
  for (const [id, rules] of Object.entries(GUARDRAILS)) {
    if (rules.lock?.[path] === value) return { id, label: rules.label }
  }
  for (const [id, rules] of Object.entries(GUARDRAILS)) {
    if (rules.allow?.[path]?.includes(value)) return { id, label: rules.label }
  }
  return null
}

/** Valores permitidos para un campo bajo la estética activa, o null si es libre. */
export function allowedValues(aesthetic, path) {
  const rules = GUARDRAILS[aesthetic]
  if (!rules) return null
  if (rules.lock && path in rules.lock) return [rules.lock[path]]
  if (rules.allow && path in rules.allow) return rules.allow[path]
  return null
}
