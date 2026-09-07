// ============================================================
// MÓDULO 1.1 — TRADUCCIÓN COGNITIVA
//
// El usuario no elige `border-radius: 32px` ni `background-image: linear-gradient`.
// Elige "Redondeadas" y "Degradado". Esta es la única capa donde vive ese
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
    ],
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
      { id: 'subtle', label: 'Discreto', tone: 'Cada bloque sube un poco al entrar en pantalla' },
      { id: 'expressive', label: 'Expresivo', tone: 'Entra desenfocado y escalonado, con parallax en la portada' },
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
    affects: { selector: '.db-hero', label: 'Un resplandor de color detrás de la página, sobre todo en la portada' },
    kind: 'toggle',
    tone: 'Manchas de color desenfocadas que se mueven muy despacio',
  },
}

