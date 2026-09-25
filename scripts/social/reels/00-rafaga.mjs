// REEL 0 — "Ráfaga"
//
// La pieza de captación. Las otras tres explican; esta solo tiene un trabajo:
// que nadie pase de largo en el primer segundo.
//
// Cuatro decisiones que la separan de las demás:
//
//   1. NO HAY INTRODUCCIÓN. El fotograma uno ya está cambiando. Un rótulo
//      sobre una web quieta es exactamente el momento en que se desliza el
//      dedo.
//   2. CORTES A TEMPO (120 bpm). El vídeo se entrega mudo y la música se le
//      pone en Instagram: si los cambios caen en la rejilla, cualquier pista
//      de ese tempo encaja sola y parece montado sobre ella.
//   3. LA CÁMARA NUNCA PARA. Un plano que respira, aunque sea un 6%,
//      distingue un vídeo de una captura de pantalla con cosas moviéndose.
//   4. CIERRA EN BUCLE. Termina en el mismo estilo con el que empieza y sin
//      pantalla negra: al repetirse no se ve la costura, y en reels cada
//      vuelta cuenta como reproducción.

export const ficha = {
  nombre: '00-rafaga',
  titulo: 'Ráfaga',
  pie: `Seis formas de ver la misma web. Elige la tuya 👇

Esto es Maketa: tocas, y la web de tu negocio cambia delante de ti. Sin saber diseño, sin instalar nada, sin registrarte. Cuando des con la que te gusta, yo la construyo con tus textos y tus fotos.

Gratis y sin compromiso 👉 maketa.es

#negociolocal #diseñoweb #pequeñocomercio #emprender #casarural #autonomos`,

  pieTikTok: `POV: tu web cambia de estilo mientras la miras 🤯

Gratis y sin registro: maketa.es

#diseñoweb #negociolocal #emprender`,
}

export { NEGOCIO as contenido } from '../lib/negocio.mjs'

export async function guion(reel) {
  const c = (n) => reel.compas(n) // 120 bpm: 1 compás = 500 ms

  // El punto de partida se deja puesto ANTES de grabar: el primer fotograma
  // tiene que ser ya una web bonita, no la demo por defecto.
  await reel.preset('Hostelería y artesanía', 600)
  await reel.camara(1.04, 0)
  await reel.grabar()

  // — 1. ráfaga: cinco mundos en dos segundos y medio ----------------
  for (const estilo of ['Neo-brutalismo', 'Glassmorfismo', 'Cyberpunk', 'Claymorfismo']) {
    await reel.destello()
    await reel.estetica(estilo, c(0.5))
  }

  // — 2. freno en seco y titular -------------------------------------
  await reel.destello()
  await reel.estetica('Minimalista plano', c(0.25))
  await reel.camara(1.0, c(2))
  await reel.golpe('La misma web')
  await reel.esperar(c(2))
  await reel.golpe('Seis estilos')
  await reel.esperar(c(2))
  await reel.rotulo(null)

  // — 3. el color, con la cámara entrando en la portada ---------------
  await reel.paso(1)
  await reel.camara(1.12, c(6), '50% 26%')
  for (const hex of ['#b45309', '#1d4ed8', '#be123c']) {
    await reel.color(hex, c(1))
  }

  await reel.golpe('Sin saber diseño')
  await reel.esperar(c(3))
  await reel.rotulo(null)
  await reel.camara(1.0, c(3), '50% 42%')

  // — 4. vuelta al principio: la costura del bucle no se ve -----------
  await reel.paso(0)
  await reel.destello()
  await reel.estetica('Material limpio', c(1.5))
  await reel.golpe('maketa.es')
  await reel.esperar(c(4))

  return reel.parar()
}
