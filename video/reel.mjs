// ============================================================
// RENDER DE REELS SUELTOS
//
//   pnpm reel reels/color01.json       → out/reels/color01/
//   pnpm reel reels/*.json             → todos
//
// Por cada reel: video.mp4, instagram.txt, tiktok.txt y ficha.md. El JSON es
// el reel entero (ver src/motor/resolver.js) y siempre se renderiza la misma
// composición, "Reel": un vídeo nuevo no necesita código nuevo.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { empaquetar, renderizar } from './render.mjs'
import { escribirTextos } from './textos.mjs'

const archivos = process.argv.slice(2).filter((a) => a.endsWith('.json'))
if (!archivos.length) {
  console.error('uso: pnpm reel reels/<reel>.json [más.json…]')
  process.exit(1)
}

const serveUrl = await empaquetar()
for (const archivo of archivos) {
  const nombre = path.basename(archivo, '.json')
  const destino = path.join('out/reels', nombre)
  const reel = JSON.parse(fs.readFileSync(archivo, 'utf8'))
  fs.mkdirSync(destino, { recursive: true })
  const { durationInFrames, fps } = await renderizar({
    serveUrl,
    id: 'Reel',
    inputProps: reel,
    salida: path.join(destino, 'video.mp4'),
    etiqueta: nombre,
  })
  escribirTextos(reel, destino, { segundos: durationInFrames / fps })
}
