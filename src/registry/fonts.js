// Font pairings offered in the marketplace. `google` is the query string for
// fonts.googleapis.com/css2. Dynamic loading is intentional here: previewing
// type live is the feature.

export const FONTS = [
  {
    id: 'space-grotesk',
    name: 'Space Grotesk + Inter',
    note: 'Geométrica, tono producto',
    heading: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    google: 'family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600',
  },
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque + Inter',
    note: 'Carácter, titulares con personalidad',
    heading: '"Bricolage Grotesque", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    google: 'family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Inter:wght@400;500;600',
  },
  {
    id: 'newsreader',
    name: 'Newsreader + Inter',
    note: 'Editorial, serif de titular',
    heading: '"Newsreader", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    google: 'family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Inter:wght@400;500;600',
  },
  {
    id: 'sora',
    name: 'Sora + IBM Plex Sans',
    note: 'Tecnológica, limpia',
    heading: '"Sora", system-ui, sans-serif',
    body: '"IBM Plex Sans", system-ui, sans-serif',
    google: 'family=Sora:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600',
  },
  {
    id: 'outfit',
    name: 'Outfit + Work Sans',
    note: 'Amable, redondeada',
    heading: '"Outfit", system-ui, sans-serif',
    body: '"Work Sans", system-ui, sans-serif',
    google: 'family=Outfit:wght@400;500;600;700&family=Work+Sans:wght@400;500;600',
  },
]

export function getFont(id) {
  return FONTS.find((f) => f.id === id) ?? FONTS[0]
}

const loaded = new Set()

// Injects the stylesheet <link> once per family into the given document.
export function loadGoogleFont(font, doc = document) {
  const key = doc === document ? font.id : `frame:${font.id}`
  if (loaded.has(key)) return
  loaded.add(key)
  const link = doc.createElement('link')
  link.rel = 'stylesheet'
  link.dataset.googleFont = font.id
  link.href = `https://fonts.googleapis.com/css2?${font.google}&display=swap`
  doc.head.appendChild(link)
}
