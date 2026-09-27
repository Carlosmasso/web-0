// ============================================================
// LA TUBERÍA DE RENDER — de una pieza a sus archivos (solo Node)
//
//   reel      video.mp4 + portada.png (la portada para subir con el reel)
//   carrusel  01.png, 02.png… + carrusel.pdf (LinkedIn) + hoja.png (revisión)
//   feed      feed.png: el borrador de la cuadrícula del perfil
//
// Empaqueta una vez y renderiza por props: ninguna pieza toca un componente.
// Si el texto de una diapositiva o una portada no cabe, el render falla y
// dice cuál (componentes/Cabe.jsx).
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundle } from '@remotion/bundler'
import { openBrowser, renderMedia, renderStill, selectComposition } from '@remotion/renderer'
import { PDFDocument } from 'pdf-lib'
import { crearWebpackOverride } from '../webpack.mjs'

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const empaquetar = () =>
  bundle({ entryPoint: path.join(RAIZ, 'src/index.jsx'), webpackOverride: crearWebpackOverride(RAIZ) })

/** El navegador se abre una vez y lo comparten todos los renders. */
export const abrirNavegador = () => openBrowser('chrome')

const progreso = (etiqueta) => {
  let ultimo = -1
  return ({ progress }) => {
    const pct = Math.floor(progress * 10) * 10
    if (pct !== ultimo) {
      ultimo = pct
      process.stdout.write(`\r${etiqueta}  ${pct}%   `)
    }
  }
}

async function still(ctx, id, inputProps, salida, frame = 0) {
  const composition = await selectComposition({ serveUrl: ctx.serveUrl, id, inputProps, puppeteerInstance: ctx.navegador })
  await renderStill({
    serveUrl: ctx.serveUrl,
    composition,
    frame,
    inputProps,
    output: salida,
    imageFormat: 'png',
    puppeteerInstance: ctx.navegador,
  })
  return composition
}

/** Un reel: el vídeo y su portada. Devuelve la duración en segundos. */
export async function renderReel(ctx, pieza, props, destino) {
  const composition = await selectComposition({ serveUrl: ctx.serveUrl, id: 'Reel', inputProps: props, puppeteerInstance: ctx.navegador })
  await renderMedia({
    serveUrl: ctx.serveUrl,
    composition,
    inputProps: props,
    codec: 'h264',
    outputLocation: path.join(destino, 'video.mp4'),
    puppeteerInstance: ctx.navegador,
    onProgress: progreso(pieza.id),
  })
  await still(ctx, `Portada-${pieza.id}`, undefined, path.join(destino, 'portada.png'))
  return composition.durationInFrames / composition.fps
}

/** Un carrusel: una imagen por diapositiva, el PDF y la hoja de contactos. */
export async function renderCarrusel(ctx, pieza, props, destino, titulo) {
  const composition = await selectComposition({ serveUrl: ctx.serveUrl, id: 'Carrusel', inputProps: props, puppeteerInstance: ctx.navegador })
  const imagenes = []
  for (let frame = 0; frame < composition.durationInFrames; frame++) {
    const salida = path.join(destino, `${String(frame + 1).padStart(2, '0')}.png`)
    process.stdout.write(`\r${pieza.id}  ${frame + 1}/${composition.durationInFrames}   `)
    await renderStill({
      serveUrl: ctx.serveUrl,
      composition,
      frame,
      inputProps: props,
      output: salida,
      imageFormat: 'png',
      puppeteerInstance: ctx.navegador,
    })
    imagenes.push(salida)
  }
  await still(ctx, 'CarruselHoja', props, path.join(destino, 'hoja.png'))

  const pdf = await PDFDocument.create()
  pdf.setTitle(titulo)
  pdf.setAuthor('Maketa · maketa.es')
  for (const img of imagenes) {
    const png = await pdf.embedPng(fs.readFileSync(img))
    pdf.addPage([composition.width, composition.height]).drawImage(png, { x: 0, y: 0, width: composition.width, height: composition.height })
  }
  fs.writeFileSync(path.join(destino, 'carrusel.pdf'), await pdf.save())
  return composition.durationInFrames
}

/** El borrador del feed con esas ideas, en orden de publicación. */
export const renderFeed = (ctx, ids, salida) => still(ctx, 'Feed', { ids }, salida)

/** Un carrusel de prueba (test/carruseles.mjs): solo comprueba que todo cabe. */
export async function comprobarCarrusel(ctx, props) {
  const composition = await selectComposition({ serveUrl: ctx.serveUrl, id: 'Carrusel', inputProps: props, puppeteerInstance: ctx.navegador })
  const tmp = path.join(RAIZ, 'out', '.comprobar.png')
  for (let frame = 0; frame < composition.durationInFrames; frame++) {
    await renderStill({ serveUrl: ctx.serveUrl, composition, frame, inputProps: props, output: tmp, imageFormat: 'png', puppeteerInstance: ctx.navegador })
  }
  fs.rmSync(tmp, { force: true })
  return composition.durationInFrames
}
