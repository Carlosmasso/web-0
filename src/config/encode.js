import { normalizeConfig } from './schema'
import { DEFAULT_CONTENT } from '../content/defaults'

// El hash de preview.html es `#<config>~<content>`. El `~` no aparece en el
// alfabeto base64 url-safe, así que separa sin ambigüedad. La parte de contenido
// es opcional: un enlace antiguo con solo `#<config>` sigue funcionando.

const toB64 = (obj) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const fromB64 = (str) =>
  JSON.parse(decodeURIComponent(escape(atob(str.replace(/-/g, '+').replace(/_/g, '/')))))

export function encodeConfig(cfg) {
  return toB64(cfg)
}

export function decodeConfig(str) {
  try {
    return normalizeConfig(fromB64(str))
  } catch {
    return null
  }
}

/**
 * Contenido para un enlace compartible. Las imágenes subidas son data URIs
 * enormes que no caben en una URL: se vacían (el marco queda como "pendiente").
 * Las imágenes por URL sí se conservan.
 */
export function encodeContent(content) {
  const lean = JSON.parse(
    JSON.stringify(content, (_k, v) =>
      typeof v === 'string' && v.startsWith('data:') ? '' : v,
    ),
  )
  return toB64(lean)
}

export function decodeContent(str) {
  try {
    return { ...DEFAULT_CONTENT, ...fromB64(str) }
  } catch {
    return null
  }
}
