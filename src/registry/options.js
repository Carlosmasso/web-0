// Human-facing labels for every choice the configurator exposes. Kept apart
// from the token data so the sidebar and the registries never drift.

export const RADIUS_OPTIONS = [
  { id: 'none', label: 'Recto' },
  { id: 'sm', label: 'Suave' },
  { id: 'md', label: 'Redondeado' },
  { id: 'pill', label: 'Pastilla' },
]

export const DENSITY_OPTIONS = [
  { id: 'compact', label: 'Compacta' },
  { id: 'normal', label: 'Normal' },
  { id: 'airy', label: 'Amplia' },
]

export const ICON_OPTIONS = [
  { id: 'phosphor', label: 'Phosphor', note: 'Trazo redondeado' },
  { id: 'tabler', label: 'Tabler', note: 'Trazo técnico' },
]

export const EFFECT_OPTIONS = [
  { id: 'none', label: 'Sin efectos', note: 'Todo estático' },
  { id: 'subtle', label: 'Sutil', note: 'Apariciones cortas, elevación al pasar' },
  { id: 'expressive', label: 'Expresivo', note: 'Entradas escalonadas, parallax, muelle' },
]

export const SECTION_META = {
  hero: {
    label: 'Cabecera',
    variants: [
      { id: 'split', label: 'Dividida', note: 'Texto + panel visual' },
      { id: 'centered', label: 'Centrada', note: 'Manifiesto tipográfico' },
      { id: 'image', label: 'Imagen de fondo', note: 'Foto a sangre con velo' },
    ],
  },
  features: {
    label: 'Características',
    variants: [
      { id: 'grid', label: 'Rejilla', note: 'Tres columnas con icono' },
      { id: 'rows', label: 'Filas alternas', note: 'Texto e imagen en zigzag' },
      { id: 'bento', label: 'Bento', note: 'Mosaico asimétrico' },
    ],
  },
  carousel: {
    label: 'Carrusel',
    variants: [
      { id: 'peek', label: 'Con adelanto', note: 'Se asoma la siguiente tarjeta' },
      { id: 'cards', label: 'Tarjetas', note: 'Tres visibles, scroll-snap' },
      { id: 'full', label: 'A sangre', note: 'Una diapositiva por vista' },
    ],
  },
  testimonial: {
    label: 'Testimonio',
    variants: [
      { id: 'quote', label: 'Cita grande', note: 'Una voz destacada' },
      { id: 'grid', label: 'Rejilla', note: 'Tres citas cortas' },
    ],
  },
  cta: {
    label: 'Llamada a la acción',
    variants: [
      { id: 'boxed', label: 'En tarjeta', note: 'Bloque contenido y centrado' },
      { id: 'banner', label: 'Banda', note: 'Franja de ancho completo' },
    ],
  },
}
