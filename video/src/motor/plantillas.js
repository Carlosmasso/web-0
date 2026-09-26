// ============================================================
// LAS PLANTILLAS DEL MOTOR DE REELS
//
// Una plantilla es la respuesta a una pregunta: "¿qué cambia si modifico X?".
// Solo declara qué ejes cambian y cómo se cuenta; la composición es siempre la
// misma (src/motor/Reel.jsx). Para un vídeo nuevo no se toca código: se
// escribe un JSON en video/reels/.
//
// El gancho se genera con el número de variantes (en letra: "cinco") y el
// negocio; se puede sobrescribir en el JSON. Lo que va *entre asteriscos*
// sale en azul.
//
// `base` son ajustes del configurador que se aplican ANTES de las variantes,
// para que el cambio se vea. El color, por ejemplo, pide la portada con fondo
// degradado (una opción real del panel): sin ella, el color de marca solo
// tiñe los botones. Se puede sobrescribir con "base" en el JSON.
// ============================================================

export const PLANTILLAS = {
  preset: {
    ejes: ['preset'],
    gancho: ({ n }) => `${n[0].toUpperCase() + n.slice(1)} presets. *Una misma web.*`,
    pregunta: '¿Con cuál te quedas?',
  },
  estilo: {
    ejes: ['estilo'],
    gancho: () => 'Mismo diseño. *Otro estilo.*',
    pregunta: '¿Cuál es el tuyo?',
  },
  color: {
    ejes: ['color'],
    base: { 'components.hero.background': 'gradient' },
    gancho: ({ n, quien }) => `La web de ${quien}, *en ${n} colores*.`,
    pregunta: '¿Qué color elegirías?',
  },
  tipografia: {
    ejes: ['tipografia'],
    gancho: ({ n }) => `Mismo texto, *${n} tipografías.*`,
    pregunta: '¿Con cuál te quedas?',
  },

  // ---------- combinaciones ----------
  // Solo las que producen un cambio que merece un reel. Quedan fuera
  // preset+estilo y preset+tipografía: el preset ya fija su estilo y su letra,
  // y pisarlos enturbia la pregunta ("¿esto es el preset o el estilo?").
  'preset+color': {
    ejes: ['preset', 'color'],
    base: { 'components.hero.background': 'gradient' },
    gancho: () => 'Cambia el preset *y el color*.',
    pregunta: '¿Cuál elegirías?',
  },
  'estilo+color': {
    ejes: ['estilo', 'color'],
    base: { 'components.hero.background': 'gradient' },
    gancho: () => 'Otro estilo, *otro color*. La misma web.',
    pregunta: '¿Cuál es el tuyo?',
  },
  'tipografia+estilo': {
    ejes: ['tipografia', 'estilo'],
    gancho: () => 'La letra y el acabado *lo cambian todo*.',
    pregunta: '¿Con cuál te quedas?',
  },
  'tipografia+color': {
    ejes: ['tipografia', 'color'],
    base: { 'components.hero.background': 'gradient' },
    gancho: () => 'Otra letra, *otro color*.',
    pregunta: '¿Cuál elegirías?',
  },
}
