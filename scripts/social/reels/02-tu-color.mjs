// REEL 2 — "Pon el color de tu marca"
//
// Enseña lo que de verdad diferencia a Maketa de una plantilla: al cambiar un
// solo color, el resto del diseño se recalcula —sombras, degradados, contraste
// del texto— en vez de quedarse un botón suelto de otro color.

export const ficha = {
  nombre: '02-tu-color',
  titulo: 'Pon el color de tu marca',
  pieTikTok: `Cambio UN color y se recoloca la web entera: sombras, degradados, contraste 🎨

Eso no lo hace una plantilla. Pruébalo gratis en maketa.es

#diseñoweb #marca #emprender`,

  pie: `Cambias un color y la web entera se recoloca sola 🎨

No es solo el botón: se recalculan las sombras, los degradados y el contraste del texto para que todo siga leyéndose bien. Eso es lo que separa una web hecha a medida de una plantilla con tu logo encima.

En Maketa lo pruebas tú mismo, gratis y sin registrarte 👉 maketa.es

#diseñoweb #identidadvisual #marca #negociolocal #autónomos #casarural`,
}

export { NEGOCIO as contenido } from '../lib/negocio.mjs'

export async function guion(reel) {
  await reel.grabar()

  await reel.preset('Hostelería y artesanía', 1800)

  await reel.rotulo('Pon el color de tu marca')
  await reel.esperar(1600)
  await reel.paso(1) // "Tu identidad": ahí vive el selector de color
  await reel.rotulo(null)
  await reel.esperar(300)

  for (const hex of ['#0f766e', '#b45309', '#1d4ed8', '#be123c', '#4d7c0f']) {
    await reel.color(hex, 1450)
  }

  await reel.rotulo('Y el resto se recalcula solo')
  await reel.esperar(2600)
  await reel.rotulo(null)
  await reel.esperar(400)

  await reel.cierre()
  return reel.parar()
}
