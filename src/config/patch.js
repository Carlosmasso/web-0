// Utilidades inmutables para editar el contrato. El panel nunca muta la
// configuración en sitio: siempre produce un objeto nuevo, para que el memo
// del resolutor sepa cuándo volver a calcular.

const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/** Fusión profunda. Los arrays y los degradados se reemplazan enteros. */
export function deepMerge(base, patch) {
  if (!isPlain(patch)) return patch
  const out = Array.isArray(base) ? base.slice() : { ...base }
  for (const [key, value] of Object.entries(patch)) {
    out[key] = isPlain(value) && isPlain(out[key]) ? deepMerge(out[key], value) : value
  }
  return out
}

/** setIn(config, 'borders.radius', 'none') */
export function setIn(root, path, value) {
  const keys = String(path).split('.')
  const clone = Array.isArray(root) ? root.slice() : { ...root }
  let cur = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    cur[k] = Array.isArray(cur[k]) ? cur[k].slice() : { ...cur[k] }
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
  return clone
}

export function getIn(root, path) {
  return String(path)
    .split('.')
    .reduce((o, k) => (o == null ? o : o[k]), root)
}
