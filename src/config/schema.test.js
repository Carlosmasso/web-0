import { describe, it, expect } from 'vitest'
import { DEFAULT_CONFIG, SECTION_ORDER, normalizeConfig } from './schema'

describe('normalizeConfig (endurece config de fuera)', () => {
  it('rellena las claves que faltan desde DEFAULT_CONFIG', () => {
    const c = normalizeConfig({ aesthetic: 'cyberpunk' })
    expect(c.aesthetic).toBe('cyberpunk')
    expect(c.palette.primary).toBe(DEFAULT_CONFIG.palette.primary)
    expect(c.sectionOrder).toEqual([...SECTION_ORDER])
    expect(c.effects.mesh).toBe(false)
  })

  it('no deja entrar claves de nivel superior desconocidas', () => {
    const c = normalizeConfig({ hackKey: 1, aesthetic: 'material-clean' })
    expect(c.hackKey).toBeUndefined()
  })

  it('sectionOrder: hero primero, sin duplicados, sin basura', () => {
    const c = normalizeConfig({ sectionOrder: ['faq', 'faq', 'pricing', 'bogus', 5, 'hero'] })
    expect(c.sectionOrder).toEqual(['hero', 'faq', 'pricing'])
  })

  it('sectionOrder vacío o inválido -> orden completo por defecto', () => {
    expect(normalizeConfig({ sectionOrder: [] }).sectionOrder).toEqual([...SECTION_ORDER])
    expect(normalizeConfig({ sectionOrder: 'nope' }).sectionOrder).toEqual([...SECTION_ORDER])
  })

  it("migra hero.background 'aurora' -> 'bare'", () => {
    const c = normalizeConfig({ components: { hero: { background: 'aurora' } } })
    expect(c.components.hero.background).toBe('bare')
  })

  it('entrada no-objeto -> copia de DEFAULT_CONFIG', () => {
    expect(normalizeConfig(null).aesthetic).toBe(DEFAULT_CONFIG.aesthetic)
    expect(normalizeConfig(42).palette).toEqual(DEFAULT_CONFIG.palette)
  })
})
