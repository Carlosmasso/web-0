import { normalizeConfig } from './schema'

// URL-safe base64 of the config, used for shareable links and the preview hash.
export function encodeConfig(cfg) {
  const json = JSON.stringify(cfg)
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function decodeConfig(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(b64)))
    return normalizeConfig(JSON.parse(json))
  } catch {
    return null
  }
}
