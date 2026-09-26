// ============================================================
// EXPORTAR CARRUSELES
//
//   pnpm carrusel carruseles/pregunta-dominio.json   → out/carruseles/pregunta-dominio/
//   pnpm carrusel carruseles/*.json                  → todos
//   pnpm carrusel carruseles/pruebas/*.json          → los de resistencia
//
// Por cada carrusel:
//   01.png, 02.png…   una imagen por diapositiva, 1080x1350, para Instagram
//   carrusel.pdf      las mismas en un PDF, que es como LinkedIn publica carruseles
//   hoja.png          todas juntas en pequeño, para revisarlo de un vistazo
//   pie.txt           el texto de la publicación, si el JSON trae "pie"
//
// El JSON es el carrusel entero (ver src/carrusel/plantillas.js). Siempre se
// renderiza la misma composición, "Carrusel": uno nuevo no necesita código.
// Si un texto no cabe ni reducido, el render falla y dice cuál.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { openBrowser, renderStill, selectComposition } from '@remotion/renderer'
import { PDFDocument } from 'pdf-lib'
import { empaquetar } from './render.mjs'

const archivos = process.argv.slice(2).filter((a) => a.endsWith('.json'))
if (!archivos.length) {
  console.error('uso: pnpm carrusel carruseles/<carrusel>.json [más.json…]')
  process.exit(1)
}

const serveUrl = await empaquetar()
const navegador = await openBrowser('chrome')
let fallos = 0

for (const archivo of archivos) {
  const nombre = path.basename(archivo, '.json')
  const carpeta = path.join('out/carruseles', nombre)
  const carrusel = JSON.parse(fs.readFileSync(archivo, 'utf8'))
  const inputProps = { carrusel }
  try {
    fs.rmSync(carpeta, { recursive: true, force: true })
    fs.mkdirSync(carpeta, { recursive: true })

    const composition = await selectComposition({ serveUrl, id: 'Carrusel', inputProps, puppeteerInstance: navegador })
    const total = composition.durationInFrames
    const imagenes = []
    for (let frame = 0; frame < total; frame++) {
      const salida = path.join(carpeta, `${String(frame + 1).padStart(2, '0')}.png`)
      process.stdout.write(`\r${nombre}  ${frame + 1}/${total}   `)
      await renderStill({ serveUrl, composition, frame, inputProps, output: salida, imageFormat: 'png', puppeteerInstance: navegador })
      imagenes.push(salida)
    }

    const hoja = await selectComposition({ serveUrl, id: 'CarruselHoja', inputProps, puppeteerInstance: navegador })
    await renderStill({
      serveUrl,
      composition: hoja,
      frame: 0,
      inputProps,
      output: path.join(carpeta, 'hoja.png'),
      imageFormat: 'png',
      puppeteerInstance: navegador,
    })

    const pdf = await PDFDocument.create()
    pdf.setTitle(carrusel.portada?.titulo?.replace(/\*/g, '') ?? nombre)
    pdf.setAuthor('Maketa · maketa.es')
    for (const img of imagenes) {
      const png = await pdf.embedPng(fs.readFileSync(img))
      pdf.addPage([composition.width, composition.height]).drawImage(png, {
        x: 0,
        y: 0,
        width: composition.width,
        height: composition.height,
      })
    }
    fs.writeFileSync(path.join(carpeta, 'carrusel.pdf'), await pdf.save())

    if (carrusel.pie) fs.writeFileSync(path.join(carpeta, 'pie.txt'), carrusel.pie.trim() + '\n')

    console.log(`\r✓ ${nombre}  ${total} diapositivas → ${carpeta}/          `)
  } catch (error) {
    fallos++
    console.log(`\r✗ ${nombre}  ${error.message.split('\n')[0]}          `)
  }
}

await navegador.close({ silent: true })
process.exit(fallos ? 1 : 0)
