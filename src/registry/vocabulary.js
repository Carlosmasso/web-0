// ============================================================
// MÓDULO 1.1 — TRADUCCIÓN COGNITIVA
//
// El usuario no elige `box-shadow: inset` ni `border-radius: 32px`. Elige
// "Táctil / 3D" y "Redondeadas". Esta es la única capa donde vive ese
// vocabulario: los controles del panel se generan a partir de aquí, así que
// jamás aparece jerga de CSS en pantalla.
//
// `tone` describe lo que la opción COMUNICA, no lo que hace técnicamente.
// Es lo que permite al usuario decidir sin saber CSS.
// ============================================================

export const VOCABULARY = {
  'borders.radius': {
    label: 'Esquinas',
    affects: { selector: '.db-card, .db-btn, .db-frame, .db-field__control', label: 'Tarjetas, botones, imágenes y campos' },
    question: '¿Cómo quieres que se sientan los bordes?',
    options: [
      { id: 'none', label: 'Rectas', tone: 'Firme, técnico, sin concesiones' },
      { id: 'soft', label: 'Suaves', tone: 'Equilibrado, el estándar de producto' },
      { id: 'round', label: 'Redondeadas', tone: 'Moderno y amable' },
      { id: 'pill', label: 'Cápsula', tone: 'Cercano, casi de juguete' },
    ],
  },

  'borders.width': {
    label: 'Grosor del trazo',
    affects: { selector: '.db-card, .db-frame, .db-btn, .db-nav', label: 'El trazo de tarjetas, botones y cabecera' },
    options: [
      { id: 'thin', label: 'Fino', tone: 'Discreto, deja hablar al contenido' },
      { id: 'thick', label: 'Marcado', tone: 'Contundente, dibuja cada bloque' },
    ],
  },

  'borders.style': {
    label: 'Tipo de línea',
    affects: { selector: '.db-card, .db-frame', label: 'El trazo de tarjetas e imágenes' },
    options: [
      { id: 'solid', label: 'Continua', tone: 'Formal' },
      { id: 'dashed', label: 'Discontinua', tone: 'Informal, de boceto' },
    ],
  },

  'shadows.style': {
    label: 'Personalidad visual',
    affects: { selector: '.db-card, .db-frame, .db-slide', label: 'Tarjetas, imágenes y diapositivas' },
    question: '¿Qué relieve tienen los elementos?',
    options: [
      { id: 'none', label: 'Plana', tone: 'Todo al mismo nivel. Sobrio y rápido de leer' },
      { id: 'soft-elevation', label: 'Elevada', tone: 'Las tarjetas flotan sobre la página' },
      { id: 'flat-hard', label: 'Recortada', tone: 'Sombra sólida, como papel sobre papel' },
      { id: 'inset-3d', label: 'Táctil / 3D', tone: 'Volumen inflado que invita a tocar' },
      { id: 'glowing-neon', label: 'Luminosa', tone: 'Resplandor de neón, pantalla encendida' },
    ],
  },

  'shadows.intensity': {
    label: 'Fuerza del relieve',
    affects: { selector: '.db-card, .db-frame, .db-slide', label: 'Tarjetas, imágenes y diapositivas' },
    kind: 'range',
    min: 0.4,
    max: 2,
    step: 0.1,
    format: (v) => (v < 0.8 ? 'Apenas perceptible' : v < 1.3 ? 'Natural' : v < 1.7 ? 'Marcado' : 'Dramático'),
  },

  'layout.density': {
    label: 'Respiración',
    affects: { selector: '.db-section', label: 'El aire entre secciones y dentro de las tarjetas' },
    question: '¿Cuánto aire hay entre las cosas?',
    options: [
      { id: 'compact', label: 'Compacta', tone: 'Cabe más en pantalla. Para catálogos y paneles' },
      { id: 'normal', label: 'Normal', tone: 'El equilibrio habitual' },
      { id: 'spacious', label: 'Amplia', tone: 'Aire y calma. Transmite precio alto' },
    ],
  },

  'components.hero.background': {
    label: 'Fondo de la portada',
    affects: { selector: '.db-hero', label: 'La portada' },
    options: [
      { id: 'solid', label: 'Color liso', tone: 'Limpio y directo' },
      { id: 'gradient', label: 'Degradado', tone: 'Atmósfera de color' },
      { id: 'aurora', label: 'Aurora', tone: 'Manchas de luz en movimiento lento' },
    ],
  },

  'components.button.shape': {
    label: 'Forma de los botones',
    affects: { selector: '.db-btn', label: 'Todos los botones' },
    options: [
      { id: 'inherit', label: 'Como el resto', tone: 'Coherente con las esquinas' },
      { id: 'pill', label: 'Cápsula', tone: 'Amable, muy usado en apps' },
      { id: 'sharp', label: 'Recta', tone: 'Seria y editorial' },
    ],
  },

  'components.button.fill': {
    label: 'Relleno de los botones',
    affects: { selector: '.db-btn--primary', label: 'Los botones principales' },
    options: [
      { id: 'solid', label: 'Macizo', tone: 'Máxima llamada de atención' },
      { id: 'outline', label: 'Contorno', tone: 'Presente pero contenido' },
      { id: 'gradient', label: 'Degradado', tone: 'Vistoso, tono producto digital' },
    ],
  },

  'components.input.variant': {
    label: 'Campos de formulario',
    affects: { selector: '.db-field', label: 'El campo de correo de la llamada a la acción' },
    options: [
      { id: 'outline', label: 'Con marco', tone: 'Se ve dónde escribir' },
      { id: 'filled', label: 'Rellenos', tone: 'Integrados en el fondo' },
      { id: 'underline', label: 'Solo línea', tone: 'Mínimo, muy tipográfico' },
    ],
  },

  'components.carousel.controls': {
    label: 'Navegación del carrusel',
    affects: { selector: '.db-carousel__arrows, .db-carousel__dots', label: 'La navegación del carrusel' },
    options: [
      { id: 'arrows', label: 'Flechas' },
      { id: 'dots', label: 'Puntos' },
      { id: 'both', label: 'Ambos' },
      { id: 'none', label: 'Solo arrastrar' },
    ],
  },

  motion: {
    label: 'Movimiento',
    affects: { selector: '.db-section__head, .db-card', label: 'Cómo entra cada bloque al desplazarte' },
    question: '¿Cuánta vida tiene la página al desplazarse?',
    options: [
      { id: 'none', label: 'Ninguno', tone: 'Todo aparece ya colocado' },
      { id: 'subtle', label: 'Discreto', tone: 'Entradas cortas al llegar a cada bloque' },
      { id: 'expressive', label: 'Expresivo', tone: 'Escalonado y con profundidad' },
    ],
  },

  iconSet: {
    label: 'Iconos',
    affects: { selector: '.db-feature__icon', label: 'Los iconos de las características' },
    options: [
      { id: 'phosphor', label: 'Redondeados', tone: 'Trazo amable' },
      { id: 'tabler', label: 'Técnicos', tone: 'Trazo recto y uniforme' },
    ],
  },

  'effects.noise': {
    label: 'Textura de grano',
    affects: { selector: '.db-page', label: 'Una capa sobre toda la página' },
    kind: 'toggle',
    tone: 'Una capa mate muy sutil. Quita el aspecto "plástico" de las pantallas',
  },

  'effects.aurora': {
    label: 'Luces de fondo',
    affects: { selector: '.db-hero', label: 'Las luces detrás de toda la página' },
    kind: 'toggle',
    tone: 'Manchas de color desenfocadas que se mueven muy despacio',
  },

  'effects.blur': {
    label: 'Cristal esmerilado',
    affects: { selector: '.db-card, .db-slide', label: 'El desenfoque tras las tarjetas' },
    kind: 'range',
    min: 0,
    max: 30,
    step: 2,
    format: (v) => (v === 0 ? 'Desactivado' : v < 12 ? 'Ligero' : v < 22 ? 'Marcado' : 'Intenso'),
  },
}

/** Devuelve la definición legible de un campo, o null si no está traducido. */
export const describe = (path) => VOCABULARY[path] ?? null

/** Etiqueta humana de un valor concreto: describeValue('borders.radius','pill') -> 'Cápsula'. */
export function describeValue(path, value) {
  const entry = VOCABULARY[path]
  if (!entry?.options) return String(value)
  return entry.options.find((o) => o.id === value)?.label ?? String(value)
}
