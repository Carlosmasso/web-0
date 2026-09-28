// ============================================================
// LAS PLANTILLAS DEL MOTOR DE REELS
//
// Una plantilla es la respuesta a una pregunta: "¿qué cambia si modifico X?".
// Solo declara qué ejes cambian y cómo se cuenta; la composición es siempre
// la misma (motor/Reel.jsx). Para un vídeo nuevo no se toca código: se escribe
// un JSON en video/reels/, o la cola semanal elige plantilla y negocio.
//
// Cada plantilla trae:
//   ejes         qué variables cambian (motor/ejes.js)
//   movimiento   opcional: 'titular' (se teclea) o 'recorrido' (se baja por
//                la web). Pasa antes de los cambios de los ejes
//   etiqueta     opcional: el texto de la pastilla, si no es el de los ejes
//   base         ajustes del configurador antes de las variantes, para que el
//                cambio se vea (el color pide la portada con fondo degradado,
//                una opción real del panel; sin ella solo tiñe los botones)
//   gancho       la frase de apertura; *entre asteriscos* va en azul
//   pregunta     la línea del cierre
//   queSeVe      para la ficha de publicación
//   dolor        la primera línea del pie: una pregunta con el problema del
//                dueño del negocio (Instagram solo enseña ~125 caracteres)
//   cuerpo       una o dos frases: qué enseña el reel. El pie entero lo
//                compone lib/textos.mjs (con la CTA y los hashtags)
//   comenta      la pregunta final del pie: ligada a lo que enseña el reel y
//                que se conteste en una palabra (genera comentarios)
//
// `n` es el número de variantes en letra ("cinco"); `quien`, "tu clínica"…
// Todo se puede sobrescribir en el JSON del reel.
// ============================================================

const EN_LETRA = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']
/** 5 → "cinco": los números del gancho y del pie, en letra. */
export const enLetra = (n) => EN_LETRA[n] ?? String(n)

/** "una clínica dental" / "un taller mecánico": el artículo según el sector. */
export function unA(sector) {
  const s = sector.toLowerCase()
  const femenino = /^(clínica|panadería|peluquería|fisioterapia|asesoría)/.test(s)
  return `${femenino ? 'una' : 'un'} ${s}`
}

const mayuscula = (t) => t[0].toUpperCase() + t.slice(1)
const COLOR_DE_BASE = { 'components.hero.background': 'gradient' }

export const PLANTILLAS = {
  preset: {
    ejes: ['preset'],
    gancho: ({ n }) => `${mayuscula(n)} presets. *Una misma web.*`,
    pregunta: '¿Con cuál te quedas?',
    comenta: '¿Con cuál te quedas para tu negocio? 👇',
    queSeVe: 'La misma web con varios presets: cada uno cambia colores, letra, acabado y composición de golpe.',
    dolor: () => '¿No sabes por dónde empezar con tu web?',
    cuerpo: ({ n, negocio }) => `${mayuscula(n)} puntos de partida para la web de ${unA(negocio.sector)}. El contenido es el mismo; todo lo demás, no.`,
  },

  estilo: {
    ejes: ['estilo'],
    gancho: () => 'Mismo diseño. *Otro estilo.*',
    pregunta: '¿Cuál es el tuyo?',
    comenta: '¿Qué estilo le pondrías a la web de tu negocio? Dímelo en una palabra 👇',
    queSeVe: 'La misma web cambiando solo de estilo: bordes, sombras y acabado. Se ve que el contenido no se mueve.',
    dolor: () => '¿Tu web parece la de cualquiera?',
    cuerpo: ({ n, negocio }) => `${mayuscula(n)} estilos para la misma web de ${unA(negocio.sector)}. Cambia el acabado y cambia cómo te ven.`,
  },

  color: {
    ejes: ['color'],
    base: COLOR_DE_BASE,
    gancho: ({ n, quien }) => `La web de ${quien}, *en ${n} colores*.`,
    pregunta: '¿Qué color elegirías?',
    comenta: '¿De qué color sería la web de tu negocio? Dímelo en una palabra 👇',
    queSeVe: 'El color de marca cambia varias veces y la web entera se transforma en su sitio: botones, fondo, sombras y contraste.',
    dolor: () => '¿Tu web no parece de tu negocio?',
    cuerpo: () => 'Cambias el color de marca y se recoloca la web entera: botones, fondos y hasta el contraste del texto.',
  },

  tipografia: {
    ejes: ['tipografia'],
    gancho: ({ n }) => `Mismo texto, *${n} tipografías.*`,
    pregunta: '¿Con cuál te quedas?',
    comenta: '¿Con qué letra te quedas? 👇',
    queSeVe: 'El mismo texto con varias tipografías: serif, sin serif, de peso. Cambia la voz de la web sin tocar una palabra.',
    dolor: () => '¿Qué dice de ti la letra de tu web?',
    cuerpo: ({ n }) => `El mismo texto con ${n} tipografías. Sin tocar una palabra, cambia cómo suena tu negocio.`,
  },

  portada: {
    ejes: ['portada'],
    gancho: ({ n, quien }) => `${mayuscula(n)} portadas para *${quien}*.`,
    pregunta: '¿Cuál pondrías tú?',
    comenta: '¿Qué portada pondrías en la tuya? 👇',
    queSeVe: 'La portada del negocio se rehace varias veces: dividida, centrada y con foto a sangre, con tiempo para leer cada una.',
    dolor: () => '¿Qué ve tu cliente nada más entrar en tu web?',
    cuerpo: ({ n, negocio }) => `${mayuscula(n)} portadas para ${unA(negocio.sector)}. Es lo primero que mira antes de decidir si te escribe.`,
  },

  titular: {
    ejes: ['tipografia'],
    movimiento: 'titular',
    etiqueta: 'Tu titular',
    gancho: () => 'Escribe tu frase. *Ya es tu web.*',
    pregunta: '¿Qué pondrías tú?',
    comenta: '¿Qué frase pondrías tú en la portada de tu web? 👇',
    queSeVe: 'El titular de la portada se teclea letra a letra y aparece en la web a la vez. Después cambia la tipografía con el texto ya puesto.',
    dolor: () => '¿Y si tu web dijera exactamente lo que tú dirías?',
    cuerpo: () => 'Escribes el titular y aparece en la web mientras lo tecleas. El texto lo pone quien conoce el negocio: tú.',
  },

  recorrido: {
    ejes: [],
    movimiento: 'recorrido',
    etiqueta: 'Tu web entera',
    gancho: ({ quien }) => `Así sería la web de *${quien}*.`,
    pregunta: '¿Te la imaginas con tu negocio?',
    comenta: '¿Qué sección no puede faltar en la web de tu negocio? 👇',
    queSeVe: 'La web entera del negocio, de arriba abajo, desplazándose despacio dentro de la tarjeta. El contrapunto tranquilo.',
    dolor: ({ negocio }) => `¿Cómo sería la web de ${unA(negocio.sector)}?`,
    cuerpo: () => 'Así, de arriba abajo: una sola página con lo que tu cliente necesita saber para escribirte.',
  },

  // ---------- combinaciones ----------
  // Solo las que producen un cambio que merece un reel. Quedan fuera
  // preset+estilo y preset+tipografía: el preset ya fija su estilo y su letra,
  // y pisarlos enturbia la pregunta ("¿esto es el preset o el estilo?").
  'preset+color': {
    ejes: ['preset', 'color'],
    base: COLOR_DE_BASE,
    gancho: () => 'Cambia el preset *y el color*.',
    pregunta: '¿Cuál elegirías?',
    comenta: '¿Con cuál te quedas? 👇',
    queSeVe: 'Presets distintos, cada uno con otro color de marca: la misma web, irreconocible de una variante a otra.',
    dolor: () => '¿Cuánto puede cambiar una web sin tocar el contenido?',
    cuerpo: () => 'Otro preset y otro color en cada versión: la misma web, irreconocible.',
  },
  'estilo+color': {
    ejes: ['estilo', 'color'],
    base: COLOR_DE_BASE,
    gancho: () => 'Otro estilo, *otro color*. La misma web.',
    pregunta: '¿Cuál es el tuyo?',
    comenta: '¿Cuál es la tuya? 👇',
    queSeVe: 'Cada variante cambia a la vez el estilo y el color de marca. El contenido no se mueve.',
    dolor: () => '¿Tu web se ha quedado anticuada?',
    cuerpo: () => 'Estilo y color: dos decisiones y la misma web parece otra.',
  },
  'tipografia+estilo': {
    ejes: ['tipografia', 'estilo'],
    gancho: () => 'La letra y el acabado *lo cambian todo*.',
    pregunta: '¿Con cuál te quedas?',
    comenta: '¿Con cuál te quedas? 👇',
    queSeVe: 'Cada variante cambia la tipografía y el estilo a la vez: la misma web con voces muy distintas.',
    dolor: () => '¿Tu web transmite cómo eres?',
    cuerpo: () => 'La letra y el acabado cambian la personalidad de un negocio, con el mismo texto.',
  },
  'tipografia+color': {
    ejes: ['tipografia', 'color'],
    base: COLOR_DE_BASE,
    gancho: () => 'Otra letra, *otro color*.',
    pregunta: '¿Cuál elegirías?',
    comenta: '¿Cuál elegirías para tu negocio? 👇',
    queSeVe: 'Cada variante cambia la tipografía y el color de marca: la identidad de la web, de un vistazo.',
    dolor: () => '¿Cómo se ve la identidad de un negocio?',
    cuerpo: () => 'En dos decisiones: la letra y el color de marca.',
  },
}
