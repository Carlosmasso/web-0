// Visual styles offered in the marketplace. Picking one applies a bundle of
// config changes at once (a starting point the client can still fine-tune with
// the individual controls below). The `surface` value drives a set of
// [data-surface="…"] rules in demo.css; the rest are ordinary config fields.

export const STYLES = [
  {
    id: 'elevated',
    label: 'Sombra suave',
    note: 'Tarjetas elevadas, bordes finos. El estándar SaaS.',
    patch: { surface: 'elevated', radius: 'md', effects: 'subtle' },
  },
  {
    id: 'minimal',
    label: 'Minimalista',
    note: 'Sin sombras, mucho aire, líneas finas.',
    patch: { surface: 'minimal', radius: 'sm', effects: 'subtle', font: 'sora' },
  },
  {
    id: 'brutal',
    label: 'Brutalismo',
    note: 'Bordes gruesos, sombra dura, titulares en mayúsculas.',
    patch: { surface: 'brutal', radius: 'none', effects: 'expressive', font: 'bricolage' },
  },
  {
    id: 'glass',
    label: 'Glassmorfismo',
    note: 'Superficies translúcidas con desenfoque sobre un fondo con color.',
    patch: { surface: 'glass', radius: 'md', effects: 'expressive', font: 'outfit' },
  },
]

export function getStyle(surface) {
  return STYLES.find((s) => s.id === surface) ?? STYLES[0]
}
