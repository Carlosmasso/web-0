// ============================================================
// PUBLICAR — los reels de la cola, por semanas, listos para subir
//
//   pnpm reels               enseña el calendario
//   pnpm reels 1             renderiza la semana 1
//   pnpm reels 1-3           de la semana 1 a la 3
//   pnpm reels 2 --textos    reescribe solo pies y fichas (no renderiza)
//
// Cada pieza sale en out/semana-XX/N-negocio-formato/ con:
//   video.mp4      el reel (1080x1920, 15 s, mudo)
//   instagram.txt  pie con párrafos y etiquetas
//   tiktok.txt     pie de una frase
//   ficha.md       qué se ve y cómo publicarlo
//
// Qué toca cada semana lo decide scripts/social/plan.mjs; cómo es cada reel,
// scripts/social/lib/formatos.mjs. Este script solo los junta y los renderiza.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { calendario, materializar, revisar, semana, POR_SEMANA, SEMANAS, TOTAL } from '../scripts/social/plan.mjs'
import { idDe, propsDe } from './src/piezas.js'
import { empaquetar, renderizar } from './render.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const SALIDA = path.join(AQUI, 'out')

const soloTextos = process.argv.includes('--textos')
const rango = process.argv.slice(2).find((a) => /^\d+(-\d+)?$/.test(a))

const problemas = revisar()
if (problemas.length) {
  console.error('la cola se pisa:\n' + problemas.map((p) => '  · ' + p).join('\n'))
  process.exit(1)
}

if (!rango) {
  console.log(`${TOTAL} piezas · ${POR_SEMANA} por semana · ${SEMANAS} semanas\n`)
  console.log(calendario(0, TOTAL))
  console.log('\nPara renderizar:  pnpm reels 1      (o 1-3)')
  process.exit(0)
}

const [desde, hasta] = rango.includes('-') ? rango.split('-').map(Number) : [Number(rango), Number(rango)]
const piezas = []
for (let s = desde; s <= Math.min(hasta, SEMANAS); s++) piezas.push(...semana(s))
if (!piezas.length) {
  console.error(`no hay piezas entre las semanas ${desde} y ${hasta} (hay ${SEMANAS})`)
  process.exit(1)
}

// ---------- lo que acompaña a cada vídeo ----------
function escribirTextos(ficha, destino) {
  fs.mkdirSync(destino, { recursive: true })
  fs.writeFileSync(path.join(destino, 'instagram.txt'), ficha.pie + '\n')
  fs.writeFileSync(path.join(destino, 'tiktok.txt'), ficha.pieTikTok + '\n')
  fs.writeFileSync(
    path.join(destino, 'ficha.md'),
    `# ${ficha.sector} · formato «${ficha.formato}»

**Semana ${ficha.semana}**, pieza ${ficha.dentro} de ${POR_SEMANA} · nº ${ficha.numero} de ${TOTAL} de la cola

| | |
| --- | --- |
| Negocio | ${ficha.marca} (${ficha.sector}) |
| Formato | ${ficha.formato} |
| Ritmo | ${ficha.voz} |
| Dura | ${ficha.dura} s · 1080x1920 · MP4 H.264 |

## Qué se ve

${ficha.queSeVe}

## Cómo publicarlo

El mismo \`video.mp4\` vale para Instagram y para TikTok: es 9:16 y no lleva
marca de agua de ninguna plataforma. **Va mudo a propósito**: el audio se le
pone en la propia aplicación, que es lo que premia el algoritmo y evita líos de
derechos. Los cambios caen a 120 bpm, así que cualquier pista de ese tempo
encaja sola.

El texto NO es el mismo en las dos redes: \`instagram.txt\` allí y
\`tiktok.txt\` en TikTok, donde solo se lee la primera línea antes del «más».

El enlace va en la biografía (maketa.es), no en el pie: en el pie no se puede
pulsar. El protocolo de después de publicar está en DIFUSION.md.
`,
  )
}

// ---------- render ----------
let serveUrl = null
if (!soloTextos) {
  console.log('empaquetando…')
  serveUrl = await empaquetar()
}

for (const pieza of piezas) {
  const { ficha } = materializar(pieza)
  const destino = path.join(SALIDA, ficha.carpeta)
  escribirTextos(ficha, destino)

  if (soloTextos) {
    console.log('✓ ' + ficha.carpeta + ' (textos)')
    continue
  }

  await renderizar({
    serveUrl,
    id: idDe(pieza),
    inputProps: propsDe(pieza),
    salida: path.join(destino, 'video.mp4'),
    etiqueta: ficha.carpeta,
  })
}

console.log(`\nlisto en ${path.relative(process.cwd(), SALIDA)}/`)
