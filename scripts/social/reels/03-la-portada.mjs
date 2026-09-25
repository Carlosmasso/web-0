// REEL 3 — "La portada, tres formas (y el texto es tuyo)"
//
// Dos ideas en una pieza: la portada se puede rehacer entera, y los textos los
// escribe el dueño del negocio. El titular se teclea letra a letra a propósito:
// es la prueba de que no es una maqueta fija.

export const ficha = {
  nombre: '03-la-portada',
  titulo: 'La portada, tres formas',
  pieTikTok: `Tres portadas para el mismo negocio. Y el titular se escribe a mano: lo ves cambiar mientras tecleas ✍️

Gratis y sin registro: maketa.es

#diseñoweb #negociolocal #emprender`,

  pie: `Lo primero que ve tu cliente es la portada. Aquí tienes tres 👀

Y el texto lo escribes tú: se ve cambiar mientras lo tecleas. Nada de rellenar un formulario y esperar a ver qué sale.

Maketa es gratis y sin registro: entra, monta la portada de tu negocio y, si te gusta, hablamos 👉 maketa.es

#negociolocal #casarural #diseñoweb #pequeñocomercio #turismorural #emprender`,
}

export { NEGOCIO as contenido } from '../lib/negocio.mjs'

export async function guion(reel) {
  await reel.grabar()

  await reel.preset('Hostelería y artesanía', 1900)
  await reel.paso(2) // "Ajuste fino": ahí están las variantes de cada sección

  await reel.rotulo('La portada, tres formas')
  await reel.esperar(1500)
  await reel.rotulo(null)
  await reel.esperar(300)

  await reel.opcionDeSeccion('La portada', 'Dividida', 2100)
  await reel.opcionDeSeccion('La portada', 'Centrada', 2100)
  await reel.opcionDeSeccion('La portada', 'Imagen de fondo', 2100)

  await reel.rotulo('Y el texto lo escribes tú')
  await reel.esperar(1200)
  await reel.pestana('Contenido')
  await reel.rotulo(null)
  await reel.teclear('hero.title', 'Un fin de semana sin cobertura', { velocidad: 78, pausa: 2000 })

  await reel.rotulo('Y lo ves mientras lo escribes')
  await reel.esperar(2300)
  await reel.rotulo(null)
  await reel.esperar(400)

  await reel.cierre()
  return reel.parar()
}
