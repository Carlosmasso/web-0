// ============================================================
// REGISTRO DE TRABAJOS GUARDADOS
//
// Un mismo almacén para dos lecturas del mismo dato:
//   - ESTUDIO: tus proyectos, uno por cliente, sin límite.
//   - CLIENTE: las VERSIONES de su web ("Mi web", "Versión 2"), para poder
//     comparar dos rumbos antes de pedir presupuesto. Máximo tres.
//
// Cada entrada guarda su config y su contenido bajo su propia clave, y un
// índice aparte lista los nombres. Nunca se pisan entre sí.
//
// Todo vive en el `localStorage` de ESTE navegador: no hay cuentas ni nube.
// La interfaz tiene que decirlo y ofrecer el enlace como copia de seguridad —
// prometer "tus versiones" y perderlas al abrir el móvil sería mentir. Por lo
// mismo, `writeProject` devuelve si pudo guardar: con la cuota llena el aviso
// le llega al usuario en vez de quedarse en un `catch` mudo.
// ============================================================

import { DEFAULT_CONFIG } from '../config/schema'
import { DEFAULT_CONTENT } from '../content/defaults'

const INDEX_KEY = 'web0.projects.v1' //  { [id]: { name, updatedAt } }
const ACTIVE_KEY = 'web0.projects.active' //  id en texto plano
const dataKey = (id) => `web0.project.${id}`
const LEGACY_CONFIG = 'web0.config.v2'
const LEGACY_CONTENT = 'web0.content'

const read = (k, fallback) => {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
/** @returns {boolean} si se pudo guardar (cuota llena o bloqueado -> false). */
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
    return true
  } catch {
    return false
  }
}

const readIndex = () => read(INDEX_KEY, {})
const uid = () => Math.random().toString(36).slice(2, 9)

/** @returns {{ id: string, name: string, updatedAt: number }[]} más reciente primero */
export function listProjects() {
  const idx = readIndex()
  return Object.entries(idx)
    .map(([id, meta]) => ({ id, name: meta.name, updatedAt: meta.updatedAt ?? 0 }))
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function readProject(id) {
  const d = read(dataKey(id), null)
  return {
    config: d?.config ?? structuredClone(DEFAULT_CONFIG),
    content: d?.content ?? structuredClone(DEFAULT_CONTENT),
  }
}

/** @returns {boolean} si el guardado llegó al disco. */
export function writeProject(id, { config, content }) {
  const ok = write(dataKey(id), { config, content })
  const idx = readIndex()
  if (idx[id]) {
    idx[id].updatedAt = Date.now()
    write(INDEX_KEY, idx)
  }
  return ok
}

export function createProject(name, { config, content }) {
  const id = uid()
  const idx = readIndex()
  idx[id] = { name: name || 'Sin nombre', updatedAt: Date.now() }
  write(INDEX_KEY, idx)
  write(dataKey(id), { config, content })
  return id
}

export function renameProject(id, name) {
  const idx = readIndex()
  if (idx[id] && name) {
    idx[id].name = name
    write(INDEX_KEY, idx)
  }
}

export function deleteProject(id) {
  const idx = readIndex()
  delete idx[id]
  write(INDEX_KEY, idx)
  try {
    localStorage.removeItem(dataKey(id))
  } catch {
    /* ignore */
  }
}

export const getActiveId = () => {
  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}
export const setActiveId = (id) => {
  try {
    localStorage.setItem(ACTIVE_KEY, id)
  } catch {
    /* ignore */
  }
}

/** Tope de versiones de cara al cliente: tres bastan para comparar. */
export const MAX_VERSIONS = 3

/**
 * Primer nombre libre de la serie. Con `from`, numera desde ahí ("Versión 2",
 * "Versión 3"…); sin él, usa el nombre desnudo si está libre y le pone sufijo
 * si no ("Diseño recibido", "Diseño recibido 2").
 */
export function freeName(base, from) {
  const taken = new Set(listProjects().map((p) => p.name))
  if (from === undefined && !taken.has(base)) return base
  let n = from ?? 2
  while (taken.has(`${base} ${n}`)) n += 1
  return `${base} ${n}`
}

/**
 * Primer arranque: si ya hay trabajos guardados devuelve el activo; si no,
 * migra lo que hubiera en las claves antiguas al primero, o lo crea en blanco.
 * `name` es cómo se llama ese primero ("Proyecto 1" en estudio, "Mi web" de
 * cara al cliente). Idempotente: se puede llamar en cada arranque.
 */
export function ensureSeeded(name = 'Proyecto 1') {
  const idx = readIndex()
  if (Object.keys(idx).length) {
    const active = getActiveId()
    if (active && idx[active]) return active
    const first = listProjects()[0].id
    setActiveId(first)
    return first
  }

  const legacyConfig = read(LEGACY_CONFIG, null)
  const legacyContent = read(LEGACY_CONTENT, null)
  const id = createProject(name, {
    config: legacyConfig ?? structuredClone(DEFAULT_CONFIG),
    content: legacyContent
      ? { ...structuredClone(DEFAULT_CONTENT), ...legacyContent }
      : structuredClone(DEFAULT_CONTENT),
  })
  setActiveId(id)
  return id
}
