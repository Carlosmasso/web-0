// ============================================================
// EMBUDO — eventos para Vercel Web Analytics
//
// El script vive en app.html (`/_vercel/insights/script.js`, sin cookies).
// Aquí solo se registran PASOS del embudo, nunca datos personales: como mucho
// un id de preset. Si Analytics no está activo o el script no cargó, no pasa
// nada — `track` traga cualquier error.
//
// DE DÓNDE VIENE LA VISITA
// El panel de Vercel tiene su propia pestaña de parámetros UTM, pero cuenta
// cada página por separado: una visita que entra en `/?utm_source=instagram` y
// pulsa "Diseñar mi web" llega a `/app.html` sin parámetro, y ahí se pierde el
// rastro justo cuando empieza lo interesante. Por eso la fuente se guarda al
// entrar y viaja con cada evento del embudo. Así se puede responder a lo único
// que importa: de los que vienen de Instagram, ¿cuántos abren el configurador
// y cuántos escriben?
// ============================================================

const CLAVE = 'web0.fuente'

/**
 * De dónde viene esta visita: 'instagram', 'tiktok', 'linkedin'… o 'directo'.
 *
 * Se guarda en `sessionStorage` y no en `localStorage` a propósito: vale para
 * esta visita, no para siempre. Quien vuelva dentro de un mes escribiendo la
 * dirección a mano es tráfico directo, y así debe contarse.
 */
export function fuente() {
  if (typeof window === 'undefined') return 'directo'
  try {
    const url = new URLSearchParams(window.location.search).get('utm_source')
    if (url) sessionStorage.setItem(CLAVE, url.slice(0, 40))
    return sessionStorage.getItem(CLAVE) || 'directo'
  } catch {
    return 'directo' // sin almacenamiento (incógnito, cookies bloqueadas)
  }
}

/**
 * @param {string} name  p. ej. 'configurator_opened' | 'preset_applied'
 * @param {Record<string, string|number|boolean>} [data]
 */
export function track(name, data) {
  if (typeof window === 'undefined') return
  try {
    window.va?.('event', { name, data: { ...data, fuente: fuente() } })
  } catch {
    /* la analítica nunca rompe la app */
  }
}
