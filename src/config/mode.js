// ============================================================
// MODO ESTUDIO vs MODO CLIENTE
//
// Una sola instancia de la herramienta sirve a dos personas:
//   - TÚ, levantándola en local para entregar (`npm run dev` -> localhost).
//   - EL CLIENTE, en la versión desplegada, jugando con el diseño.
//
// La distinción es automática: nada que el cliente pueda adivinar en la URL.
// El `?studio` es solo un escape para cuando trabajas desde otro ordenador.
// ============================================================

export const isStudio =
  import.meta.env.DEV ||
  (typeof window !== 'undefined' &&
    (['localhost', '127.0.0.1'].includes(window.location.hostname) ||
      new URLSearchParams(window.location.search).has('studio')))
