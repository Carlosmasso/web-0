// ============================================================
// RENDER COMPARTIDO — lo usan `pnpm reel` (reel.mjs) y `pnpm reels`
// (publicar.mjs). Empaqueta una vez y renderiza composiciones por props.
// ============================================================

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import { crearWebpackOverride } from './webpack.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))

export const empaquetar = () =>
  bundle({ entryPoint: path.join(AQUI, 'src/index.jsx'), webpackOverride: crearWebpackOverride(AQUI) })

/**
 * Renderiza la composición `id` con `inputProps` a `salida` (MP4 H.264).
 * Devuelve la composición resuelta (duración, tamaño) para poder comprobarla.
 */
export async function renderizar({ serveUrl, id, inputProps, salida, etiqueta = id }) {
  const composition = await selectComposition({ serveUrl, id, inputProps })
  let ultimo = -1
  await renderMedia({
    serveUrl,
    composition,
    inputProps,
    codec: 'h264',
    outputLocation: salida,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10
      if (pct !== ultimo) {
        ultimo = pct
        process.stdout.write(`\r${etiqueta}  ${pct}%   `)
      }
    },
  })
  const s = (composition.durationInFrames / composition.fps).toFixed(1)
  console.log(`\r✓ ${etiqueta}  ${composition.width}x${composition.height} · ${s} s          `)
  return composition
}
