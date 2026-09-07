// ============================================================
// MODO ESTUDIO vs MODO CLIENTE
//
// Una sola instancia de la herramienta sirve a dos personas:
//   - TÚ, levantándola en local para entregar (`npm run dev` -> localhost).
//   - EL CLIENTE, en la versión desplegada, jugando con el diseño.
//
// En local (dev o localhost) el modo estudio es automático. En la versión
// desplegada hace falta `?studio=<clave>`, donde la clave es REACT_STUDIO_KEY
// (variable de build). Sin esa clave configurada, `?studio` a secas todavía
// vale — pero conviene ponerla para que un cliente curioso no active el modo
// estudio (ni el botón de descargar el proyecto) solo por leerlo en algún
// sitio. Es ofuscación, no un candado: la clave viaja en el bundle.
// ============================================================

const STUDIO_KEY = import.meta.env.REACT_STUDIO_KEY || ''

function studioFromUrl() {
  if (typeof window === 'undefined') return false
  const { hostname, search } = window.location
  if (['localhost', '127.0.0.1'].includes(hostname)) return true

  const param = new URLSearchParams(search).get('studio')
  if (param === null) return false
  if (STUDIO_KEY) return param === STUDIO_KEY
  // Sin clave configurada: `?studio` a secas sigue valiendo (retrocompatible).
  if (import.meta.env.PROD) {
    console.warn('[modo] ?studio sin REACT_STUDIO_KEY: cualquiera puede activarlo. Configúrala.')
  }
  return true
}

export const isStudio = import.meta.env.DEV || studioFromUrl()

// Query string que abre el modo estudio en otra pestaña (enlace "editar").
// Incluye la clave si está configurada.
export const STUDIO_QUERY = STUDIO_KEY ? `?studio=${encodeURIComponent(STUDIO_KEY)}` : '?studio'
