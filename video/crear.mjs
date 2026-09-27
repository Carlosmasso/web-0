// ============================================================
// CREAR — de una idea de contenido/ideas.json a lo que se sube
//
//   pnpm crear                        lista las ideas: cuáles se pueden crear ya
//   pnpm crear IR-19                  → out/IR-19/  (vídeo o imágenes, portada, pies y ficha)
//   pnpm crear IR-19 IC-07 IR-03      varias
//   pnpm crear feed IR-03 IC-07 IR-19 borrador del feed con esas, en orden de
//                                     publicación → out/feed.png
//
// Cuándo sale cada pieza lo decides tú; esto solo la fabrica.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import * as sistema from './contenido/sistema.mjs'
import { ganchoDe, listaParaCrear, validarTodas } from './lib/modelo.mjs'
import { propsDe } from './lib/props.mjs'
import { escribirTextos } from './lib/textos.mjs'

const plano = (t) => String(t ?? '').replace(/\*/g, '')
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), 'out')

let ideas
try {
  ideas = validarTodas(JSON.parse(fs.readFileSync(new URL('./contenido/ideas.json', import.meta.url), 'utf8')), sistema)
} catch (error) {
  console.error(`✗ ${error.message}`)
  process.exit(1)
}
const buscar = (id) => {
  const p = ideas.find((q) => q.id === id.toUpperCase())
  if (!p) throw new Error(`no existe la idea ${id} en contenido/ideas.json`)
  if (!listaParaCrear(p)) throw new Error(`${p.id} no tiene aún las diapositivas escritas (plantilla "${p.carrusel.plantilla}")`)
  return p
}

function listar() {
  for (const formato of ['reel', 'carrusel']) {
    console.log(`\n${formato === 'reel' ? 'REELS' : 'CARRUSELES'}`)
    for (const p of ideas.filter((q) => q.formato === formato)) {
      const marca = p.bloqueo ? '⏸' : listaParaCrear(p) ? '✓' : '·'
      console.log(`${marca} ${p.id}  ${plano(ganchoDe(p))}`)
    }
  }
  console.log('\n✓ se puede crear · · faltan las diapositivas · ⏸ bloqueada (fase 0: no publicar)')
  console.log('\npnpm crear <id…>   ·   pnpm crear feed <id…>')
}

async function crear(ids) {
  const lista = ids.map(buscar)
  for (const p of lista) if (p.bloqueo) console.log(`⏸ ${p.id} está bloqueada (${p.bloqueo}): se crea, pero no se publica.`)
  const { empaquetar, abrirNavegador, renderReel, renderCarrusel } = await import('./lib/render.mjs')
  console.log('empaquetando…')
  const ctx = { serveUrl: await empaquetar(), navegador: await abrirNavegador() }
  for (const p of lista) {
    const destino = path.join(OUT, p.id)
    fs.rmSync(destino, { recursive: true, force: true })
    fs.mkdirSync(destino, { recursive: true })
    try {
      const props = propsDe(p, ideas, sistema)
      const detalle =
        p.formato === 'reel'
          ? `${(await renderReel(ctx, p, props, destino)).toFixed(1).replace('.', ',')} s`
          : `${await renderCarrusel(ctx, p, props, destino, plano(ganchoDe(p)))} diapositivas`
      escribirTextos(p, destino, { ideas, sistema, detalle })
      console.log(`\r✓ ${p.id}  ${detalle} → out/${p.id}/          `)
    } catch (error) {
      process.exitCode = 1
      console.log(`\r✗ ${p.id}  ${error.message.split('\n')[0]}          `)
    }
  }
  await ctx.navegador.close({ silent: true })
}

async function feed(ids) {
  ids.forEach(buscar)
  const { empaquetar, abrirNavegador, renderFeed } = await import('./lib/render.mjs')
  const ctx = { serveUrl: await empaquetar(), navegador: await abrirNavegador() }
  fs.mkdirSync(OUT, { recursive: true })
  await renderFeed(ctx, ids.map((id) => id.toUpperCase()), path.join(OUT, 'feed.png'))
  await ctx.navegador.close({ silent: true })
  console.log('✓ borrador del feed → out/feed.png')
}

const [primero, ...resto] = process.argv.slice(2)
try {
  if (!primero) listar()
  else if (primero === 'feed') {
    if (!resto.length) throw new Error('uso: pnpm crear feed <id> <id>… (en el orden en que los publicarás)')
    await feed(resto)
  } else await crear([primero, ...resto])
} catch (error) {
  console.error(`✗ ${error.message}`)
  process.exitCode = 1
}
