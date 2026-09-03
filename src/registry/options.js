// Etiquetas de cara al usuario para cada control del configurador. Separadas
// de los datos de token para que el panel y los registros no se descuadren.

export const RADIUS_OPTIONS = [
  { id: 'none', label: 'Recto' },
  { id: 'soft', label: 'Suave' },
  { id: 'round', label: 'Amplio' },
  { id: 'pill', label: 'Pastilla' },
]

export const WIDTH_OPTIONS = [
  { id: 'thin', label: 'Fino' },
  { id: 'thick', label: 'Grueso' },
]

export const BORDER_STYLE_OPTIONS = [
  { id: 'solid', label: 'Continuo' },
  { id: 'dashed', label: 'Discontinuo' },
]

export const SHADOW_OPTIONS = [
  { id: 'none', label: 'Ninguna', note: 'Superficies planas' },
  { id: 'soft-elevation', label: 'Elevación suave', note: 'Difuminado amplio' },
  { id: 'flat-hard', label: 'Plana y dura', note: 'Desplazada, sin difuminar' },
  { id: 'inset-3d', label: 'Volumen interior', note: 'Luz arriba, sombra dentro' },
  { id: 'glowing-neon', label: 'Neón', note: 'Resplandor exterior' },
]

export const DENSITY_OPTIONS = [
  { id: 'compact', label: 'Compacta' },
  { id: 'normal', label: 'Normal' },
  { id: 'spacious', label: 'Amplia' },
]

export const ICON_OPTIONS = [
  { id: 'phosphor', label: 'Phosphor', note: 'Trazo redondeado' },
  { id: 'tabler', label: 'Tabler', note: 'Trazo técnico' },
]

export const MOTION_OPTIONS = [
  { id: 'none', label: 'Sin movimiento', note: 'Todo estático' },
  { id: 'subtle', label: 'Sutil', note: 'Apariciones cortas' },
  { id: 'expressive', label: 'Expresivo', note: 'Escalonado y parallax' },
]

export const HERO_BG_OPTIONS = [
  { id: 'solid', label: 'Color plano' },
  { id: 'gradient', label: 'Degradado' },
  { id: 'aurora', label: 'Aurora' },
]

export const BUTTON_SHAPE_OPTIONS = [
  { id: 'inherit', label: 'Heredado' },
  { id: 'pill', label: 'Pastilla' },
  { id: 'sharp', label: 'Recto' },
]

export const BUTTON_FILL_OPTIONS = [
  { id: 'solid', label: 'Sólido' },
  { id: 'outline', label: 'Contorno' },
  { id: 'gradient', label: 'Degradado' },
]

export const INPUT_VARIANT_OPTIONS = [
  { id: 'outline', label: 'Contorno' },
  { id: 'filled', label: 'Relleno' },
  { id: 'underline', label: 'Subrayado' },
]

export const CAROUSEL_CONTROL_OPTIONS = [
  { id: 'arrows', label: 'Flechas' },
  { id: 'dots', label: 'Puntos' },
  { id: 'both', label: 'Ambos' },
  { id: 'none', label: 'Ninguno' },
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
      { id: 'cards', label: 'Tarjetas', note: 'Varias visibles, scroll-snap' },
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
