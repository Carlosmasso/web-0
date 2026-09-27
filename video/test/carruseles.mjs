// Renderiza los carruseles de resistencia (test/carruseles/*.json) y falla si
// algún texto no cabe. Parte de `pnpm test`; tarda unos segundos.

import fs from 'node:fs'
import path from 'node:path'
import { abrirNavegador, comprobarCarrusel, empaquetar, RAIZ } from '../lib/render.mjs'

const carpeta = path.join(RAIZ, 'test', 'carruseles')
const ctx = { serveUrl: await empaquetar(), navegador: await abrirNavegador() }
for (const f of fs.readdirSync(carpeta).filter((f) => f.endsWith('.json'))) {
  try {
    const carrusel = JSON.parse(fs.readFileSync(path.join(carpeta, f), 'utf8'))
    const n = await comprobarCarrusel(ctx, { carrusel, visual: { tema: 'dark', layout: 'A' } })
    console.log(`✓ ${f}  ${n} diapositivas caben`)
  } catch (error) {
    process.exitCode = 1
    console.log(`✗ ${f}  ${error.message.split('\n')[0]}`)
  }
}
await ctx.navegador.close({ silent: true })
