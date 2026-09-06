import { describe, it, expect } from 'vitest'
import { normalizeConfigWithGuardrails, auditConfig } from './guardrails'
import { schemeOf } from '../theme/resolve'
import { PRESETS } from '../registry/presets'
import { DEFAULT_CONFIG } from './schema'

describe('normalizeConfigWithGuardrails', () => {
  it('los 11 presets pasan sin violación de accesibilidad', () => {
    for (const p of PRESETS) {
      const { config, violations } = normalizeConfigWithGuardrails(structuredClone(p.config))
      expect(config.palette.primary, p.id).toBeTruthy()
      expect(
        violations.filter((v) => v.a11y),
        `${p.id} tiene ajustes de a11y (la paleta del preset no cumple sola)`,
      ).toHaveLength(0)
      expect(auditConfig(config).every((c) => c.pass), `${p.id} falla el audit final`).toBe(true)
    }
  })

  it('sube una paleta de bajo contraste al suelo WCAG', () => {
    const bad = structuredClone(DEFAULT_CONFIG)
    bad.palette.neutralBg = '#ffffff'
    bad.palette.textPrimary = '#9a9a9a' // gris claro sobre blanco: no llega a 7:1
    const { config, violations } = normalizeConfigWithGuardrails(bad)
    expect(config.palette.textPrimary).not.toBe('#9a9a9a')
    expect(violations.some((v) => v.a11y)).toBe(true)
    expect(auditConfig(config).every((c) => c.pass)).toBe(true)
  })

  it('cyberpunk fuerza fondo oscuro', () => {
    const c = structuredClone(DEFAULT_CONFIG) // paleta clara por defecto
    c.aesthetic = 'cyberpunk'
    const { config } = normalizeConfigWithGuardrails(c)
    expect(schemeOf(config)).toBe('dark')
  })
})
