// ============================================================
// MODO ESTUDIO vs MODO CLIENTE
//
// Una sola instancia de la herramienta sirve a dos personas:
//   - TÚ, levantándola en local para entregar (`npm run dev` -> localhost).
//   - EL CLIENTE, en la versión desplegada, jugando con el diseño.
//
// En local (dev o localhost) el modo estudio es automático. En la versión
// desplegada hace falta `?studio=<REACT_STUDIO_KEY>` con la clave EXACTA. Si no
// hay `REACT_STUDIO_KEY` configurada, el modo estudio NO se puede activar por
// URL en el deploy — trabajas en local. Es ofuscación (la clave viaja en el
// bundle), no un candado, pero evita que un cliente lo active sin querer.
// ============================================================

const STUDIO_KEY = import.meta.env.REACT_STUDIO_KEY || ''

function studioFromUrl() {
  if (typeof window === 'undefined') return false
  const { hostname, search } = window.location
  if (['localhost', '127.0.0.1'].includes(hostname)) return true

  // Deploy: solo con la clave exacta. Sin clave, ni con `?studio` ni `?studio=`.
  if (!STUDIO_KEY) return false
  return new URLSearchParams(search).get('studio') === STUDIO_KEY
}

export const isStudio = import.meta.env.DEV || studioFromUrl()

// Query string que abre el modo estudio en otra pestaña (enlace "editar").
export const STUDIO_QUERY = STUDIO_KEY ? `?studio=${encodeURIComponent(STUDIO_KEY)}` : '?studio'
