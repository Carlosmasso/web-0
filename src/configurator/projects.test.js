import { describe, it, expect, beforeEach } from 'vitest'
import {
  ensureSeeded,
  createProject,
  listProjects,
  readProject,
  renameProject,
  deleteProject,
  writeProject,
  getActiveId,
  setActiveId,
} from './projects'

// localStorage propio y en memoria: ni jsdom ni el localStorage nativo de Node
// (que aquí llega a medias).
beforeEach(() => {
  const store = new Map()
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  }
})

describe('projects (multi-proyecto en estudio)', () => {
  it('ensureSeeded crea "Proyecto 1" desde cero y es idempotente', () => {
    const id = ensureSeeded()
    expect(listProjects().map((p) => p.name)).toEqual(['Proyecto 1'])
    expect(getActiveId()).toBe(id)
    expect(ensureSeeded()).toBe(id)
  })

  it('ensureSeeded migra las claves antiguas', () => {
    localStorage.setItem('web0.config.v2', JSON.stringify({ aesthetic: 'cyberpunk' }))
    localStorage.setItem('web0.content', JSON.stringify({ brand: { name: 'X' } }))
    const id = ensureSeeded()
    const p = readProject(id)
    expect(p.config.aesthetic).toBe('cyberpunk')
    expect(p.content.brand.name).toBe('X')
  })

  it('crear / renombrar / borrar', () => {
    const a = createProject('Uno', { config: { x: 1 }, content: { y: 2 } })
    setActiveId(a)
    const b = createProject('Dos', { config: {}, content: {} })
    expect(listProjects()).toHaveLength(2)

    renameProject(a, 'Uno bis')
    expect(listProjects().find((p) => p.id === a).name).toBe('Uno bis')

    deleteProject(b)
    expect(listProjects().map((p) => p.id)).toEqual([a])
    expect(readProject(a).config).toEqual({ x: 1 })
  })

  it('writeProject sube al principio de la lista (más reciente)', async () => {
    const a = createProject('A', { config: {}, content: {} })
    await new Promise((r) => setTimeout(r, 5))
    const b = createProject('B', { config: {}, content: {} })
    expect(listProjects()[0].id).toBe(b)

    await new Promise((r) => setTimeout(r, 5))
    writeProject(a, { config: { z: 1 }, content: {} })
    expect(listProjects()[0].id).toBe(a)
  })
})
