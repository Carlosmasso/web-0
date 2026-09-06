import { describe, it, expect } from 'vitest'
import { resolveTheme, gradientToCss, luminance, schemeOf } from './resolve'
import { DEFAULT_CONFIG } from '../config/schema'

describe('resolveTheme', () => {
  const vars = resolveTheme(DEFAULT_CONFIG)

  it('emite las custom properties básicas', () => {
    for (const k of [
      '--theme-primary',
      '--theme-bg',
      '--theme-text',
      '--theme-radius',
      '--theme-font-heading',
      '--theme-hero-grad',
      '--theme-mesh',
      '--theme-on-primary',
    ]) {
      expect(vars[k], k).toBeTruthy()
    }
  })

  it('todo valor es string (seguro para setProperty)', () => {
    for (const [k, v] of Object.entries(vars)) expect(typeof v, k).toBe('string')
  })
})

describe('gradientToCss', () => {
  it('null / sin stops -> none', () => {
    expect(gradientToCss(null)).toBe('none')
    expect(gradientToCss({ type: 'linear', angle: 0, stops: [] })).toBe('none')
  })
  it('linear / conic', () => {
    expect(
      gradientToCss({ type: 'linear', angle: 90, stops: [{ color: '#000', at: 0 }, { color: '#fff', at: 100 }] }),
    ).toMatch(/^linear-gradient\(90deg/)
    expect(gradientToCss({ type: 'conic', angle: 0, stops: [{ color: '#000', at: 0 }] })).toMatch(/^conic-gradient/)
  })
})

describe('luminance / schemeOf', () => {
  it('claro vs oscuro', () => {
    expect(luminance('#ffffff')).toBeGreaterThan(0.9)
    expect(luminance('#000000')).toBeLessThan(0.05)
    expect(schemeOf({ palette: { neutralBg: '#0b0b0d' } })).toBe('dark')
    expect(schemeOf({ palette: { neutralBg: '#fafafa' } })).toBe('light')
  })
})
