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
//   pie          el texto de Instagram · pieTikTok, el de TikTok (una frase)
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
    queSeVe: 'La misma web con varios presets: cada uno cambia colores, letra, acabado y composición de golpe.',
    pie: ({ n, negocio }) => `${mayuscula(n)} puntos de partida para la web de ${unA(negocio.sector)}. El contenido es el mismo; todo lo demás, no 👇

Eliges el que te representa y lo ajustas a tu gusto. Cuando te convenza, yo la construyo con tus textos y tus fotos.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: ({ n }) => `La misma web con ${n} presets distintos. ¿Cuál es la tuya? 👀

Gratis: maketa.es`,
  },

  estilo: {
    ejes: ['estilo'],
    gancho: () => 'Mismo diseño. *Otro estilo.*',
    pregunta: '¿Cuál es el tuyo?',
    queSeVe: 'La misma web cambiando solo de estilo: bordes, sombras y acabado. Se ve que el contenido no se mueve.',
    pie: ({ n, negocio }) => `${mayuscula(n)} formas de ver la web de ${unA(negocio.sector)}. Elige la tuya 👇

Tocas, y cambia delante de ti. Sin saber diseño, sin instalar nada, sin registrarte. Cuando des con la que te gusta, yo la construyo con tus textos y tus fotos.

Gratis y sin compromiso 👉 maketa.es`,
    pieTikTok: ({ negocio }) => `POV: la web de tu ${negocio.sector.toLowerCase()} cambia de estilo mientras la miras 🤯

Gratis y sin registro: maketa.es`,
  },

  color: {
    ejes: ['color'],
    base: COLOR_DE_BASE,
    gancho: ({ n, quien }) => `La web de ${quien}, *en ${n} colores*.`,
    pregunta: '¿Qué color elegirías?',
    queSeVe: 'El color de marca cambia varias veces y la web entera se transforma en su sitio: botones, fondo, sombras y contraste.',
    pie: ({ negocio }) => `Cambias un color y se recoloca la web entera: sombras, degradados y hasta el contraste del texto 🎨

Eso no lo hace una plantilla con tu logo encima. Esta es la web de ${unA(negocio.sector)}, pero funciona igual con la de cualquiera.

Pruébalo gratis, sin registro 👉 maketa.es`,
    pieTikTok: () => `Cambio UN color y se recoloca la web entera 🎨

Gratis y sin registro: maketa.es`,
  },

  tipografia: {
    ejes: ['tipografia'],
    gancho: ({ n }) => `Mismo texto, *${n} tipografías.*`,
    pregunta: '¿Con cuál te quedas?',
    queSeVe: 'El mismo texto con varias tipografías: serif, sin serif, de peso. Cambia la voz de la web sin tocar una palabra.',
    pie: ({ negocio }) => `La letra dice de ti más de lo que parece ✍️

Mismo titular, mismas fotos: solo cambia la tipografía. Esta es la web de ${unA(negocio.sector)}; en la tuya eliges la que te suene a ti.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Mismo texto, otra letra. ¿Cuál te suena más a ti? ✍️

Gratis: maketa.es`,
  },

  portada: {
    ejes: ['portada'],
    gancho: ({ n, quien }) => `${mayuscula(n)} portadas para *${quien}*.`,
    pregunta: '¿Cuál pondrías tú?',
    queSeVe: 'La portada del negocio se rehace varias veces: dividida, centrada y con foto a sangre, con tiempo para leer cada una.',
    pie: ({ n, negocio }) => `La portada es lo único que mira un cliente antes de decidir si te llama. Aquí van ${n} para ${unA(negocio.sector)} 👀

En Maketa las pruebas todas y te quedas con la que te representa. Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Varias portadas para el mismo negocio, un clic cada una 👀

Gratis: maketa.es`,
  },

  titular: {
    ejes: ['tipografia'],
    movimiento: 'titular',
    etiqueta: 'Tu titular',
    gancho: () => 'Escribe tu frase. *Ya es tu web.*',
    pregunta: '¿Qué pondrías tú?',
    queSeVe: 'El titular de la portada se teclea letra a letra y aparece en la web a la vez. Después cambia la tipografía con el texto ya puesto.',
    pie: ({ negocio }) => `Escribes el titular y aparece en tu web mientras lo tecleas ✍️

Nada de rellenar un formulario y esperar a ver qué sale. Esto es ${unA(negocio.sector)}, pero el texto lo pone siempre quien conoce el negocio: tú.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Escribo el titular y aparece en la web a la vez ✍️

Gratis: maketa.es`,
  },

  recorrido: {
    ejes: [],
    movimiento: 'recorrido',
    etiqueta: 'Tu web entera',
    gancho: ({ quien }) => `Así sería la web de *${quien}*.`,
    pregunta: '¿Te la imaginas con tu negocio?',
    queSeVe: 'La web entera del negocio, de arriba abajo, desplazándose despacio dentro de la tarjeta. El contrapunto tranquilo.',
    pie: ({ negocio }) => `Así queda la web de ${unA(negocio.sector)}, de arriba abajo 🏡

No es una plantilla con el logo cambiado: la diseñas tú en un rato y yo la construyo con tu contenido real.

Gratis y sin compromiso 👉 maketa.es`,
    pieTikTok: ({ negocio }) => `La web de ${unA(negocio.sector)}, de arriba abajo 👀

Gratis: maketa.es`,
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
    queSeVe: 'Presets distintos, cada uno con otro color de marca: la misma web, irreconocible de una variante a otra.',
    pie: ({ negocio }) => `Otro preset, otro color, la misma web de ${unA(negocio.sector)} 🎨

Así de lejos se puede llevar un diseño sin tocar el contenido. Cuando des con el tuyo, yo lo construyo.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Mismo contenido, otro preset y otro color. ¿Cuál eliges? 🎨

Gratis: maketa.es`,
  },
  'estilo+color': {
    ejes: ['estilo', 'color'],
    base: COLOR_DE_BASE,
    gancho: () => 'Otro estilo, *otro color*. La misma web.',
    pregunta: '¿Cuál es el tuyo?',
    queSeVe: 'Cada variante cambia a la vez el estilo y el color de marca. El contenido no se mueve.',
    pie: ({ negocio }) => `Estilo y color: dos toques y la web de ${unA(negocio.sector)} parece otra ✨

Sin saber diseño y viendo cada cambio en vivo. Cuando te guste, yo la construyo.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Dos toques y parece otra web ✨

Gratis: maketa.es`,
  },
  'tipografia+estilo': {
    ejes: ['tipografia', 'estilo'],
    gancho: () => 'La letra y el acabado *lo cambian todo*.',
    pregunta: '¿Con cuál te quedas?',
    queSeVe: 'Cada variante cambia la tipografía y el estilo a la vez: la misma web con voces muy distintas.',
    pie: ({ negocio }) => `La letra y el acabado cambian cómo suena un negocio ✍️

Misma web de ${unA(negocio.sector)}, mismo texto, otra personalidad en cada variante.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Otra letra, otro acabado, otra personalidad ✍️

Gratis: maketa.es`,
  },
  'tipografia+color': {
    ejes: ['tipografia', 'color'],
    base: COLOR_DE_BASE,
    gancho: () => 'Otra letra, *otro color*.',
    pregunta: '¿Cuál elegirías?',
    queSeVe: 'Cada variante cambia la tipografía y el color de marca: la identidad de la web, de un vistazo.',
    pie: ({ negocio }) => `Letra y color: la identidad de un negocio en dos decisiones 🎨

Así cambia la web de ${unA(negocio.sector)} con cada combinación. Pruébalo con la tuya.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Letra y color: la identidad en dos decisiones 🎨

Gratis: maketa.es`,
  },
}
