// ============================================================
// RENDER DE UN REEL EN DATOS
//
//   pnpm reel reels/color01.json                 → out/reels/color01.mp4
//   pnpm reel reels/*.json                       → todos
//
// El JSON es el reel entero (plantilla, negocio, variantes…); ver
// src/motor/resolver.js. Siempre se renderiza la misma composición, "Reel":
// un vídeo nuevo no necesita código nuevo.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { empaquetar, renderizar } from './render.mjs'

const archivos = process.argv.slice(2).filter((a) => a.endsWith('.json'))
if (!archivos.length) {
  console.error('uso: pnpm reel reels/<reel>.json [más.json…]')
  process.exit(1)
}

const serveUrl = await empaquetar()
fs.mkdirSync('out/reels', { recursive: true })
for (const archivo of archivos) {
  const nombre = path.basename(archivo, '.json')
  const inputProps = JSON.parse(fs.readFileSync(archivo, 'utf8'))
  await renderizar({ serveUrl, id: 'Reel', inputProps, salida: `out/reels/${nombre}.mp4`, etiqueta: nombre })
}
