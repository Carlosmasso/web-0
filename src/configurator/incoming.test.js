import { describe, it, expect, beforeEach } from 'vitest'
import { openIncomingDesign } from './incoming'
import { createProject, listProjects, readProject, getActiveId } from './projects'
import { encodeConfig } from '../config/encode'
import { DEFAULT_CONFIG } from '../config/schema'
import { DEFAULT_CONTENT } from '../content/defaults'

// localStorage propio y en memoria (igual que en projects.test.js).
beforeEach(() => {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  }
})

const config = (patch) => ({ ...structuredClone(DEFAULT_CONFIG), ...patch })
const seed = (name, cfg, content = DEFAULT_CONTENT) =>
  createProject(name, { config: cfg ?? structuredClone(DEFAULT_CONFIG), content })

describe('regla del enlace entrante', () => {
  it('sin `?c=` no toca nada', () => {
    const mine = seed('Mi web')
    expect(openIncomingDesign(null, mine)).toBe(mine)
    expect(listProjects()).toHaveLength(1)
  })

  it('un enlace con un diseño ya guardado abre ESA versión, no crea otra', () => {
    const mine = seed('Mi web')
    const other = seed('Versión 2', config({ aesthetic: 'neo-brutalism' }))

    const opened = openIncomingDesign(encodeConfig(config({ aesthetic: 'neo-brutalism' })), mine)

    expect(opened).toBe(other)
    expect(getActiveId()).toBe(other)
    expect(listProjects()).toHaveLength(2)
  })

  it('un diseño desconocido entra como versión propia y no pisa nada', () => {
    const mine = seed('Mi web', config({ aesthetic: 'material-clean' }))

    const opened = openIncomingDesign(encodeConfig(config({ aesthetic: 'glassmorphism' })), mine)

    expect(opened).not.toBe(mine)
    expect(listProjects().map((p) => p.name).sort()).toEqual(['Diseño recibido', 'Mi web'])
    // lo que había sigue intacto
    expect(readProject(mine).config.aesthetic).toBe('material-clean')
    expect(readProject(opened).config.aesthetic).toBe('glassmorphism')
  })

  it('el mismo enlace dos veces no duplica', () => {
    const mine = seed('Mi web')
    const link = encodeConfig(config({ aesthetic: 'glassmorphism' }))

    const first = openIncomingDesign(link, mine)
    const second = openIncomingDesign(link, first)

    expect(second).toBe(first)
    expect(listProjects()).toHaveLength(2)
  })

  it('la versión recibida hereda los textos de la activa (el enlace no los lleva)', () => {
    const mine = seed('Mi web', undefined, {
      ...structuredClone(DEFAULT_CONTENT),
      brand: { ...DEFAULT_CONTENT.brand, name: 'Panadería Ruiz' },
    })

    const opened = openIncomingDesign(encodeConfig(config({ aesthetic: 'cyberpunk' })), mine)

    expect(readProject(opened).content.brand.name).toBe('Panadería Ruiz')
  })

  it('un `?c=` roto se ignora en vez de guardarse', () => {
    const mine = seed('Mi web')
    expect(openIncomingDesign('no-es-base64-valido!!', mine)).toBe(mine)
    expect(listProjects()).toHaveLength(1)
  })
})
