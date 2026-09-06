// ============================================================
// REGISTRO DE PROYECTOS — SOLO MODO ESTUDIO
//
// El cliente configura una única web y no ve nada de esto: su trabajo se
// autoguarda en las claves planas de App.jsx (web0.config.v2 / web0.content).
//
// En estudio, tú llevas varios clientes en local. Cada proyecto guarda su
// config y su contenido bajo su propia clave, y un índice aparte lista los
// nombres. Nunca se pisan entre sí.
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
const write = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* cuota llena o almacenamiento bloqueado: se ignora */
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

export function writeProject(id, { config, content }) {
  write(dataKey(id), { config, content })
  const idx = readIndex()
  if (idx[id]) {
    idx[id].updatedAt = Date.now()
    write(INDEX_KEY, idx)
  }
}

export function createProject(name, { config, content }) {
  const id = uid()
  const idx = readIndex()
  idx[id] = { name: name || 'Proyecto', updatedAt: Date.now() }
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

/**
 * Primera vez en estudio: si ya hay proyectos devuelve el activo; si no, migra
 * lo que hubiera en las claves antiguas a "Proyecto 1", o crea uno en blanco.
 * Idempotente: se puede llamar en cada arranque.
 */
export function ensureSeeded() {
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
  const id = createProject('Proyecto 1', {
    config: legacyConfig ?? structuredClone(DEFAULT_CONFIG),
    content: legacyContent
      ? { ...structuredClone(DEFAULT_CONTENT), ...legacyContent }
      : structuredClone(DEFAULT_CONTENT),
  })
  setActiveId(id)
  return id
}
