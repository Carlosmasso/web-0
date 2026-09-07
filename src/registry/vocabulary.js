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

  'shadows.intensity': {
    label: 'Fuerza del relieve',
    affects: { selector: '.db-card, .db-frame, .db-slide', label: 'Tarjetas, imágenes y diapositivas' },
    kind: 'range',
    min: 0.4,
    max: 2,
    step: 0.1,
    format: (v) => (v < 0.8 ? 'Apenas perceptible' : v < 1.3 ? 'Natural' : v < 1.7 ? 'Marcado' : 'Dramático'),
  },

  'components.hero.background': {
    label: 'Fondo de la portada',
    affects: { selector: '.db-hero', label: 'La portada' },
    options: [
      { id: 'solid', label: 'Liso', tone: 'El color de fondo de la página, sin más' },
      { id: 'gradient', label: 'Degradado', tone: 'Un lavado diagonal con los colores de tu paleta' },
    ],
  },

  'components.button.fill': {
    label: 'Botones principales',
    affects: { selector: '.db-btn--primary', label: 'Los botones principales' },
    options: [
      { id: 'solid', label: 'Macizo', tone: 'Relleno de tu color. Máxima llamada de atención' },
      { id: 'outline', label: 'Contorno', tone: 'Solo el borde. Presente pero contenido' },
      { id: 'gradient', label: 'Degradado', tone: 'De tu color al acento. Tono producto digital' },
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

  'effects.mesh': {
    label: 'Fondo con color',
    affects: { selector: '.db-page', label: 'Un lavado de color detrás de toda la página' },
    kind: 'toggle',
    tone: 'Manchas de color muy tenues en las esquinas, tomadas de tu paleta. Da profundidad sin distraer',
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
