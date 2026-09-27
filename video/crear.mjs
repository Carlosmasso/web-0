// ============================================================
// CREAR — de una idea de contenido/ideas.json a lo que se sube
//
//   pnpm crear                        lista las ideas: cuáles se pueden crear ya
//   pnpm crear IR-19                  → out/IR-19-dark-A/  (vídeo, portada, pies y ficha)
//   pnpm crear IC-21                  → out/IC-21-light-A/  (la carpeta lleva el tema y el
//                                     layout: cambiar el visual no pisa la versión anterior)
//   pnpm crear IR-19 IC-07 IR-03      varias
//   pnpm crear IC-21 --video          el carrusel, además, en vídeo: un MP4 animado por diapositiva
//   pnpm crear feed IR-03 IC-07 IR-19 borrador del feed con esas, en orden de
//                                     publicación → out/feed.png
//
// Cuándo sale cada pieza lo decides tú; esto solo la fabrica.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import * as sistema from './contenido/sistema.mjs'
import { ganchoDe, listaParaCrear, validarTodas, visualDe } from './lib/modelo.mjs'
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
/**
 * La carpeta de una idea, con su tema y su layout (y, en un reel, su portada
 * si no es la de siempre): IC-21-light-C, IR-19-dark-A, IR-19-dark-A-rejilla.
 */
const carpetaDe = (p) => {
  const { tema, layout, portada } = visualDe(p, sistema)
  return `${p.id}-${tema}-${layout}${portada && portada !== 'pila' ? `-${portada}` : ''}`
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

async function crear(ids, { video = false } = {}) {
  const lista = ids.map(buscar)
  for (const p of lista) if (p.bloqueo) console.log(`⏸ ${p.id} está bloqueada (${p.bloqueo}): se crea, pero no se publica.`)
  const { empaquetar, abrirNavegador, renderReel, renderCarrusel, renderCarruselVideo } = await import('./lib/render.mjs')
  console.log('empaquetando…')
  const ctx = { serveUrl: await empaquetar(), navegador: await abrirNavegador() }
  for (const p of lista) {
    const destino = path.join(OUT, carpetaDe(p))
    fs.rmSync(destino, { recursive: true, force: true })
    fs.mkdirSync(destino, { recursive: true })
    try {
      const props = propsDe(p, ideas, sistema)
      let detalle
      if (p.formato === 'reel') {
        detalle = `${(await renderReel(ctx, p, props, destino)).toFixed(1).replace('.', ',')} s`
      } else {
        const n = await renderCarrusel(ctx, p, props, destino, plano(ganchoDe(p)))
        if (video) await renderCarruselVideo(ctx, p, props, destino, n)
        detalle = `${n} diapositivas${video ? ' (imagen y vídeo)' : ''}`
      }
      escribirTextos(p, destino, { ideas, sistema, detalle })
      console.log(`\r✓ ${p.id}  ${detalle} → out/${carpetaDe(p)}/          `)
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

const args = process.argv.slice(2)
const video = args.includes('--video')
const [primero, ...resto] = args.filter((a) => !a.startsWith('--'))
try {
  if (!primero) listar()
  else if (primero === 'feed') {
    if (!resto.length) throw new Error('uso: pnpm crear feed <id> <id>… (en el orden en que los publicarás)')
    await feed(resto)
  } else await crear([primero, ...resto], { video })
} catch (error) {
  console.error(`✗ ${error.message}`)
  process.exitCode = 1
}
