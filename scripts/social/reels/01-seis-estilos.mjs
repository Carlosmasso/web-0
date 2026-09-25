// REEL 1 — "El mismo negocio, seis estilos"
//
// El gancho es puramente visual: la web de una casa rural que se reinventa
// entera cada segundo y medio. No explica el producto, lo enseña.

export const ficha = {
  nombre: '01-seis-estilos',
  titulo: 'El mismo negocio, seis estilos',
  pieTikTok: `La misma web seis veces. Eliges el estilo y la ves cambiar en directo 🌲

Tú la diseñas, yo la construyo. Gratis y sin registro: maketa.es

#diseñoweb #negociolocal #casarural`,

  pie: `El mismo negocio. La misma web. Seis estilos distintos en quince segundos 🌲

En Maketa eliges cómo se ve tu web y la ves cambiar en vivo, sin saber nada de diseño ni de código. Cuando encuentras la que te gusta, yo la construyo con tus textos y tus fotos.

Es gratis, no hay que registrarse y no te compromete a nada. Entra y juega un rato con la web de tu negocio 👉 maketa.es

#negociolocal #casarural #diseñoweb #pequeñocomercio #turismorural #emprender`,
}

export { NEGOCIO as contenido } from '../lib/negocio.mjs'

export async function guion(reel) {
  await reel.grabar()

  await reel.rotulo('La web de una casa rural')
  await reel.esperar(2400)
  await reel.rotulo(null)
  await reel.esperar(400)

  await reel.preset('Hostelería y artesanía', 2100)

  await reel.rotulo('El mismo negocio, otro estilo')
  await reel.esperar(900)
  await reel.estetica('Neo-brutalismo', 1750)
  await reel.estetica('Glassmorfismo', 1750)
  await reel.rotulo(null)
  await reel.estetica('Claymorfismo', 1750)
  await reel.estetica('Cyberpunk', 1750)
  await reel.estetica('Minimalista plano', 1900)

  await reel.rotulo('Tú eliges. Yo la construyo.')
  await reel.esperar(2400)
  await reel.rotulo(null)
  await reel.esperar(400)

  await reel.cierre()
  return reel.parar()
}
