// ============================================================
// FORMATOS
//
// El segundo eje de variación. Todos los reels usan la MISMA plantilla de
// Remotion (`video/src/plantilla/`), con el acabado del vídeo de marca:
// gancho sobre fondo tinta, la web real en una tarjeta que se transforma y
// cierre de marca, 15 s. Lo que cambia de un formato a otro es la IDEA que
// enseña la web:
//
//   rafaga    · seis estilos seguidos, uno por segundo. Captación.
//   identidad · el color de marca y la tipografía, y se recoloca todo.
//   portada   · tres portadas para el mismo negocio.
//   escribir  · el titular se teclea y aparece en la web a la vez.
//   recorrido · la web entera de arriba abajo. El contrapunto.
//
// Cada formato es DATOS: `reel(n)` devuelve
//
//   gancho   la frase de la escena 1; *entre asteriscos* va en azul
//   frases   [desde, hasta, 'texto'] bajo la tarjeta
//   cambios  { frame, estetica | color | tipografia | portada }
//            { desde, hasta, titular: true }   teclea el titular
//            { desde, hasta, scroll: true }    recorre la web entera
//
// Los fotogramas (30 por segundo) cuentan desde que empieza la escena de la
// demo, que dura 290. La pastilla de arriba se rellena sola con el nombre de
// cada cambio. Para retocar un reel, se tocan aquí los textos y los números.
// ============================================================

// `n.quien` es "tu casa rural", "tu clínica"…: le habla a quien tiene ese negocio.
export const FORMATOS = {
  // ----------------------------------------------------------
  rafaga: {
    queSeVe:
      'Gancho sobre fondo oscuro; después la web del negocio en una tarjeta que cambia de estilo seis veces, una por segundo, fundiéndose de uno a otro. La pastilla de arriba nombra cada estilo. Cierra con la marca.',
    voz: 'Trepidante: un cambio por segundo. La de captar.',
    reel: (n) => ({
      gancho: `La web de *${n.quien}*, en seis estilos.`,
      cambios: [
        { frame: 30, estetica: 'neo-brutalism' },
        { frame: 60, estetica: 'glassmorphism' },
        { frame: 90, estetica: 'cyberpunk' },
        { frame: 120, estetica: 'claymorphism' },
        { frame: 150, estetica: 'minimalist-flat' },
        { frame: 180, estetica: 'material-clean' },
        { frame: 230, color: '#be123c' },
      ],
      frases: [
        [20, 200, 'Un toque, *otro estilo*.'],
        [205, 290, 'La misma web, *sin saber diseño*.'],
      ],
    }),
    pie: (n) => `Seis formas de ver la web de ${unA(n.sector)}. Elige la tuya 👇

Tocas, y cambia delante de ti. Sin saber diseño, sin instalar nada, sin registrarte. Cuando des con la que te gusta, yo la construyo con tus textos y tus fotos.

Gratis y sin compromiso 👉 maketa.es`,
    pieTikTok: (n) => `POV: la web de tu ${n.sector.toLowerCase()} cambia de estilo mientras la miras 🤯

Gratis y sin registro: maketa.es`,
  },

  // ----------------------------------------------------------
  identidad: {
    queSeVe:
      'Gancho sobre fondo oscuro; después el color de marca de la web cambia cinco veces (se recalculan botones, sombras y contraste) y luego la tipografía, tres. La pastilla de arriba dice cada color y cada letra.',
    voz: 'Un solo gesto repetido: el color, y luego la letra.',
    reel: () => ({
      gancho: 'Cambia un color y *cambia toda tu web*.',
      cambios: [
        { frame: 30, color: '#0f766e' },
        { frame: 60, color: '#b45309' },
        { frame: 90, color: '#1d4ed8' },
        { frame: 120, color: '#be123c' },
        { frame: 150, color: '#4d7c0f' },
        { frame: 195, tipografia: 'playfair' },
        { frame: 225, tipografia: 'space-grotesk' },
        { frame: 255, tipografia: 'archivo-black' },
      ],
      frases: [
        [20, 180, 'Botones, sombras y *contraste*.'],
        [185, 290, 'Y la letra, *también*.'],
      ],
    }),
    pie: (n) => `Cambias un color y se recoloca la web entera: sombras, degradados y hasta el contraste del texto 🎨

Eso no lo hace una plantilla con tu logo encima. Esta es la web de ${unA(n.sector)}, pero funciona igual con la de cualquiera.

Pruébalo gratis, sin registro 👉 maketa.es`,
    pieTikTok: () => `Cambio UN color y se recoloca la web entera 🎨

Gratis y sin registro: maketa.es`,
  },

  // ----------------------------------------------------------
  portada: {
    queSeVe:
      'Gancho sobre fondo oscuro; después la portada del negocio se rehace tres veces, dividida, centrada y con foto a sangre, dos segundos y medio cada una. Cierra con la marca.',
    voz: 'Pausado: tres estados, dos segundos cada uno.',
    reel: (n) => ({
      gancho: `Tres portadas para *${n.quien}*.`,
      cambios: [
        { frame: 30, portada: 'split' },
        { frame: 105, portada: 'centered' },
        { frame: 180, portada: 'image' },
      ],
      frases: [
        [20, 250, 'Lo primero que *ve tu cliente*.'],
        [250, 290, 'Un clic, *cada una*.'],
      ],
    }),
    pie: (n) => `La portada es lo único que mira un cliente antes de decidir si te llama. Aquí van tres para ${unA(n.sector)} 👀

En Maketa las pruebas todas y te quedas con la que te representa. Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Tres portadas para el mismo negocio, un clic cada una 👀

Gratis: maketa.es`,
  },

  // ----------------------------------------------------------
  escribir: {
    queSeVe:
      'Gancho sobre fondo oscuro; después el titular de la portada se teclea letra a letra y aparece en la web a la vez. Luego cambian la tipografía y el color, con el texto ya puesto.',
    voz: 'Íntimo: casi todo quieto salvo el texto.',
    reel: () => ({
      gancho: 'Escribe tu frase. *Ya es tu web.*',
      cambios: [
        { desde: 25, hasta: 150, titular: true },
        { frame: 190, tipografia: 'playfair' },
        { frame: 235, color: '#b45309' },
      ],
      frases: [
        [20, 170, 'Aparece *mientras la escribes*.'],
        [175, 290, 'Con tu letra y *tu color*.'],
      ],
    }),
    pie: (n) => `Escribes el titular y aparece en tu web mientras lo tecleas ✍️

Nada de rellenar un formulario y esperar a ver qué sale. Esto es ${unA(n.sector)}, pero el texto lo pone siempre quien conoce el negocio: tú.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Escribo el titular y aparece en la web a la vez ✍️

Gratis: maketa.es`,
  },

  // ----------------------------------------------------------
  recorrido: {
    queSeVe:
      'Gancho sobre fondo oscuro; después la web entera del negocio desplazándose despacio de arriba abajo dentro de la tarjeta. El contrapunto tranquilo del resto de formatos.',
    voz: 'Contemplativo, sin cortes. El contrapunto.',
    reel: (n) => ({
      gancho: `Así sería la web de *${n.quien}*.`,
      cambios: [{ desde: 25, hasta: 270, scroll: true }],
      frases: [
        [20, 150, 'De arriba *abajo*.'],
        [155, 290, 'Hecha *a medida*.'],
      ],
    }),
    pie: (n) => `Así queda la web de ${unA(n.sector)}, de arriba abajo 🏡

No es una plantilla con el logo cambiado: la diseñas tú en un rato y yo la construyo con tu contenido real.

Gratis y sin compromiso 👉 maketa.es`,
    pieTikTok: (n) => `La web de ${unA(n.sector).toLowerCase()}, de arriba abajo 👀

Gratis: maketa.es`,
  },
}

/** "una clínica dental" / "un taller mecánico": el artículo según el sector. */
function unA(sector) {
  const s = sector.toLowerCase()
  const femenino = /^(clínica|panadería|peluquería|fisioterapia|asesoría)/.test(s)
  return `${femenino ? 'una' : 'un'} ${s}`
}

export const listaFormatos = () => Object.keys(FORMATOS)
