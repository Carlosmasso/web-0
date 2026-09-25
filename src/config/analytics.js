// ============================================================
// EMBUDO — eventos para Vercel Web Analytics
//
// El script vive en app.html (`/_vercel/insights/script.js`, sin cookies).
// Aquí solo se registran PASOS del embudo, nunca datos personales: como mucho
// un id de preset. Si Analytics no está activo o el script no cargó, no pasa
// nada — `track` traga cualquier error.
// ============================================================

/**
 * @param {string} name  p. ej. 'configurator_opened' | 'preset_applied'
 * @param {Record<string, string|number|boolean>} [data]
 */
export function track(name, data) {
  if (typeof window === 'undefined') return
  try {
    window.va?.('event', data ? { name, data } : { name })
  } catch {
    /* la analítica nunca rompe la app */
  }
}
