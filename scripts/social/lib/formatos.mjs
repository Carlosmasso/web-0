// ============================================================
// FORMATOS
//
// El segundo eje de variación. Cada formato tiene una VOZ VISUAL distinta —no
// solo un guion distinto— para que dos piezas seguidas no se parezcan aunque
// salga el mismo producto:
//
//   rafaga    · cortes a tempo, cámara acercada, 9 s. Captación.
//   identidad · un solo gesto repetido (el color) con la cámara entrando.
//   portada   · tres estados de una misma sección, plano fijo y pausado.
//   escribir  · nada se mueve salvo el texto que alguien teclea.
//   recorrido · plano largo y contemplativo, sin cortes. El contrapunto.
//
// Esa mezcla de ritmos importa tanto como el contenido: cinco piezas
// trepidantes seguidas cansan igual que cinco lentas.
// ============================================================

const c = (reel, n) => reel.compas(n)

export const FORMATOS = {
  // ----------------------------------------------------------
  rafaga: {
    queSeVe:
      'Cuatro estilos completos en los dos primeros segundos, separados por destellos blancos. Freno en seco, dos titulares de golpe, y la cámara entra en la portada mientras el color de marca cambia tres veces. Cierra volviendo al estilo del principio y sin pantalla negra, para que al repetirse no se vea la costura.',
    voz: 'Trepidante, 9 s, bucle cerrado. La de captar.',
    duracion: 9,
    async guion(reel, negocio) {
      await reel.partida(negocio, 600)
      await reel.camara(1.04, 0)
      await reel.grabar()

      for (const estilo of ['Neo-brutalismo', 'Glassmorfismo', 'Cyberpunk', 'Claymorfismo']) {
        await reel.destello()
        await reel.estetica(estilo, c(reel, 0.5))
      }
      await reel.destello()
      await reel.estetica('Minimalista plano', c(reel, 0.25))
      await reel.camara(1.0, c(reel, 2))
      await reel.golpe('La misma web')
      await reel.esperar(c(reel, 2))
      await reel.golpe('Seis estilos')
      await reel.esperar(c(reel, 2))
      await reel.rotulo(null)

      await reel.paso(1)
      await reel.camara(1.12, c(reel, 6), '50% 26%')
      for (const hex of ['#b45309', '#1d4ed8', '#be123c']) await reel.color(hex, c(reel, 1))

      await reel.golpe('Sin saber diseño')
      await reel.esperar(c(reel, 3))
      await reel.rotulo(null)
      await reel.camara(1.0, c(reel, 3), '50% 42%')

      await reel.paso(0)
      await reel.destello()
      await reel.estetica('Material limpio', c(reel, 1.5))
      await reel.golpe('maketa.es')
      await reel.esperar(c(reel, 4))
      return reel.parar()
    },
    pie: (n) => `Seis formas de ver la web de ${unA(n.sector)}. Elige la tuya 👇

Tocas, y cambia delante de ti. Sin saber diseño, sin instalar nada, sin registrarte. Cuando des con la que te gusta, yo la construyo con tus textos y tus fotos.

Gratis y sin compromiso 👉 maketa.es`,
    pieTikTok: (n) => `POV: la web de tu ${n.sector.toLowerCase()} cambia de estilo mientras la miras 🤯

Gratis y sin registro: maketa.es`,
  },

  // ----------------------------------------------------------
  identidad: {
    queSeVe:
      'Un titular presenta la idea y la cámara se va acercando a la portada mientras el color de marca cambia cinco veces seguidas. En cada cambio se recalculan sombras, degradados y el contraste del texto, que es lo que una plantilla no hace.',
    voz: 'Un solo gesto repetido, cámara entrando. 8 s.',
    duracion: 8,
    async guion(reel, negocio) {
      await reel.partida(negocio, 700)
      await reel.grabar()
      await reel.golpe('Tu color de marca')
      await reel.esperar(c(reel, 3))
      await reel.rotulo(null)

      await reel.paso(1)
      await reel.camara(1.13, c(reel, 10), '50% 24%')
      for (const hex of ['#0f766e', '#b45309', '#1d4ed8', '#be123c', '#4d7c0f']) {
        await reel.color(hex, c(reel, 1))
      }
      await reel.camara(1.0, c(reel, 4), '50% 42%')
      await reel.golpe('Y se recoloca todo')
      await reel.esperar(c(reel, 4))
      await reel.rotulo(null)
      await reel.esperar(c(reel, 1))
      return reel.parar()
    },
    pie: (n) => `Cambias un color y se recoloca la web entera: sombras, degradados y hasta el contraste del texto 🎨

Eso no lo hace una plantilla con tu logo encima. Esta es la web de ${unA(n.sector)}, pero funciona igual con la de cualquiera.

Pruébalo gratis, sin registro 👉 maketa.es`,
    pieTikTok: () => `Cambio UN color y se recoloca la web entera 🎨

Gratis y sin registro: maketa.es`,
  },

  // ----------------------------------------------------------
  portada: {
    queSeVe:
      'La portada se rehace tres veces —dividida, centrada y foto a sangre— con un destello entre cada una y la cámara ligeramente acercada. Cierra con «Tres portadas, un clic».',
    voz: 'Plano fijo, tres estados, pausado. 8 s.',
    duracion: 8,
    async guion(reel, negocio) {
      await reel.preset(negocio.preset, 800)
      await reel.paso(2)
      await reel.grabar() // aquí no se fija portada: el formato las recorre
      await reel.golpe('Lo primero que ven')
      await reel.esperar(c(reel, 3))
      await reel.rotulo(null)

      await reel.camara(1.06, c(reel, 12), '50% 30%')
      for (const variante of ['Dividida', 'Centrada', 'Imagen de fondo']) {
        await reel.destello()
        await reel.opcionDeSeccion('La portada', variante, c(reel, 3))
      }
      await reel.camara(1.0, c(reel, 3))
      await reel.golpe('Tres portadas, un clic')
      await reel.esperar(c(reel, 4))
      await reel.rotulo(null)
      return reel.parar()
    },
    pie: (n) => `La portada es lo único que mira un cliente antes de decidir si te llama. Aquí van tres para ${unA(n.sector)} 👀

En Maketa las pruebas todas y te quedas con la que te representa. Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Tres portadas para el mismo negocio, un clic cada una 👀

Gratis: maketa.es`,
  },

  // ----------------------------------------------------------
  escribir: {
    queSeVe:
      'La cámara se queda cerca de la portada y no se mueve nada salvo el titular, que se teclea letra a letra. Se ve aparecer en la web al mismo tiempo que se escribe.',
    voz: 'Quieto salvo el texto. Íntimo, 10 s.',
    duracion: 10,
    async guion(reel, negocio) {
      await reel.partida(negocio, 800)
      await reel.grabar()
      await reel.camara(1.12, c(reel, 14), '50% 26%')
      await reel.golpe('Los textos son tuyos')
      await reel.esperar(c(reel, 3))
      await reel.rotulo(null)

      await reel.pestana('Contenido')
      await reel.teclear('hero.title', negocio.contenido['hero.title'], {
        velocidad: 62,
        pausa: c(reel, 3),
      })
      await reel.pestana('Diseño')
      await reel.camara(1.0, c(reel, 4), '50% 42%')
      await reel.golpe('Y se ve mientras escribes')
      await reel.esperar(c(reel, 4))
      await reel.rotulo(null)
      return reel.parar()
    },
    pie: (n) => `Escribes el titular y aparece en tu web mientras lo tecleas ✍️

Nada de rellenar un formulario y esperar a ver qué sale. Esto es ${unA(n.sector)}, pero el texto lo pone siempre quien conoce el negocio: tú.

Gratis y sin registro 👉 maketa.es`,
    pieTikTok: () => `Escribo el titular y aparece en la web a la vez ✍️

Gratis: maketa.es`,
  },

  // ----------------------------------------------------------
  recorrido: {
    queSeVe:
      'Plano largo sin un solo corte: el nombre del negocio y después la web entera desplazándose de arriba abajo con un acercamiento lentísimo. Es el contrapunto tranquilo del resto de formatos.',
    voz: 'Plano largo sin cortes, contemplativo. 14 s. El contrapunto.',
    duracion: 14,
    async guion(reel, negocio) {
      await reel.partida(negocio, 900)
      await reel.grabar()
      await reel.golpe(negocio.contenido['brand.name'])
      await reel.esperar(c(reel, 3))
      await reel.rotulo(null)
      await reel.camara(1.05, 12000, '50% 40%')
      await reel.recorrer(10000)
      await reel.esperar(c(reel, 1))
      await reel.golpe('Hecha a medida')
      await reel.esperar(c(reel, 4))
      await reel.rotulo(null)
      return reel.parar()
    },
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
