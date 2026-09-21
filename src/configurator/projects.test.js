import { describe, it, expect, beforeEach } from 'vitest'
import {
  ensureSeeded,
  freeName,
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

describe('registro de trabajos guardados', () => {
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

  it('ensureSeeded nombra el primero según quién mire', () => {
    ensureSeeded('Mi web')
    expect(listProjects().map((p) => p.name)).toEqual(['Mi web'])
  })

  it('freeName da el primer hueco de la serie', () => {
    createProject('Mi web', { config: {}, content: {} })
    expect(freeName('Versión', 2)).toBe('Versión 2')

    createProject('Versión 2', { config: {}, content: {} })
    expect(freeName('Versión', 2)).toBe('Versión 3')

    // sin número de partida: el nombre desnudo si está libre, con sufijo si no
    expect(freeName('Diseño recibido')).toBe('Diseño recibido')
    createProject('Diseño recibido', { config: {}, content: {} })
    expect(freeName('Diseño recibido')).toBe('Diseño recibido 2')
  })

  it('writeProject dice si pudo guardar (la cuota se avisa, no se traga)', () => {
    const id = createProject('A', { config: {}, content: {} })
    expect(writeProject(id, { config: { x: 1 }, content: {} })).toBe(true)

    const ok = localStorage.setItem
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError')
    }
    expect(writeProject(id, { config: { x: 2 }, content: {} })).toBe(false)
    localStorage.setItem = ok
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
