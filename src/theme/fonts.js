// Carga bajo demanda de familias de Google Fonts. La carga dinámica es
// intencional aquí: previsualizar tipografía en vivo es la funcionalidad.

const loaded = new Set()

/** '"Space Grotesk", system-ui, sans-serif' -> 'Space Grotesk' */
export function familyOf(stack) {
  const first = String(stack).split(',')[0]?.trim().replace(/^["']|["']$/g, '')
  if (!first) return null
  return /^(system-ui|ui-|sans-serif|serif|monospace|cursive|Georgia|Arial|Helvetica)/i.test(first)
    ? null
    : first
}

/**
 * Inyecta el <link> de cada familia una sola vez por documento. El preview
 * vive en un iframe, así que la clave incluye el documento destino.
 */
export function ensureFonts(stacks, doc = document) {
  for (const stack of stacks) {
    const family = familyOf(stack)
    if (!family) continue

    const key = `${doc === document ? 'top' : 'frame'}:${family}`
    if (loaded.has(key)) continue
    loaded.add(key)

    const link = doc.createElement('link')
    link.rel = 'stylesheet'
    link.dataset.googleFont = family
    link.href =
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}` +
      `:wght@400;500;600;700;800&display=swap`
    doc.head.appendChild(link)
  }
}
