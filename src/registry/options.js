// Metadatos de cara al usuario para el panel. Los controles cosméticos tiran
// del VOCABULARIO (`vocabulary.js`); aquí solo queda lo que el vocabulario no
// cubre: las variantes de sección y las anclas de los controles de identidad.

export const SECTION_META = {
  hero: {
    label: 'Cabecera',
    affects: { selector: '[data-section="hero"]', label: 'La portada' },
    variants: [
      { id: 'split', label: 'Dividida', note: 'Texto + panel visual' },
      { id: 'centered', label: 'Centrada', note: 'Manifiesto tipográfico' },
      { id: 'image', label: 'Imagen de fondo', note: 'Foto a sangre con velo' },
    ],
  },
  logos: {
    label: 'Confían en nosotros',
    affects: { selector: '[data-section="logos"]', label: 'La franja de marcas' },
    variants: [
      { id: 'plain', label: 'Solo logos', note: 'Una fila discreta bajo la portada' },
      { id: 'headline', label: 'Con titular', note: 'Una frase de cifra o autoridad encima' },
    ],
  },
  features: {
    label: 'Características',
    affects: { selector: '[data-section="features"]', label: 'El bloque de características' },
    variants: [
      { id: 'grid', label: 'Rejilla', note: 'Tres columnas con icono' },
      { id: 'rows', label: 'Filas alternas', note: 'Texto e imagen en zigzag' },
      { id: 'bento', label: 'Bento', note: 'Mosaico asimétrico' },
    ],
  },
  carousel: {
    label: 'Carrusel',
    affects: { selector: '[data-section="carousel"]', label: 'El carrusel entero' },
    variants: [
      { id: 'peek', label: 'Con adelanto', note: 'Se asoma la siguiente tarjeta' },
      { id: 'cards', label: 'Tarjetas', note: 'Varias visibles, scroll-snap' },
      { id: 'full', label: 'A sangre', note: 'Una diapositiva por vista' },
    ],
  },
  pricing: {
    label: 'Precios',
    affects: { selector: '[data-section="pricing"]', label: 'La sección de precios' },
    variants: [
      { id: 'cards', label: 'Tarjetas', note: 'Planes uno junto a otro, el recomendado destacado' },
      { id: 'rows', label: 'Lista', note: 'Planes apilados, más sobria y fácil de leer de un vistazo' },
    ],
  },
  testimonial: {
    label: 'Testimonio',
    affects: { selector: '[data-section="testimonial"]', label: 'La franja de testimonios' },
    variants: [
      { id: 'quote', label: 'Cita grande', note: 'Una voz destacada' },
      { id: 'grid', label: 'Rejilla', note: 'Tres citas cortas' },
    ],
  },
  faq: {
    label: 'Preguntas frecuentes',
    affects: { selector: '[data-section="faq"]', label: 'Las preguntas frecuentes' },
    variants: [
      { id: 'accordion', label: 'Acordeón', note: 'Cada pregunta se expande al tocarla' },
      { id: 'grid', label: 'Rejilla', note: 'Todas las respuestas visibles, en dos columnas' },
    ],
  },
  cta: {
    label: 'Llamada a la acción',
    affects: { selector: '[data-section="cta"]', label: 'La llamada a la acción' },
    variants: [
      { id: 'boxed', label: 'En tarjeta', note: 'Bloque contenido y centrado' },
      { id: 'banner', label: 'Banda', note: 'Franja de ancho completo' },
    ],
  },
}

/** Anclas de los controles de identidad, que no pasan por el vocabulario. */
export const IDENTITY_AFFECTS = {
  typography: {
    selector: '.db-hero h1, .db-section__head h2, .db-carousel__head h2, .db-wordmark',
    label: 'Todos los titulares',
  },
  brand: {
    selector: '.db-btn--primary, .db-eyebrow, .db-feature__icon',
    label: 'Botones, antetítulos e iconos',
  },
}
