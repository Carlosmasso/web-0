// ============================================================
// PUBLICAR — la cola semanal, lista para subir
//
//   pnpm reels               enseña el calendario
//   pnpm reels 1             renderiza la semana 1
//   pnpm reels 1-3           de la semana 1 a la 3
//   pnpm reels 2 --textos    reescribe solo pies y fichas (no renderiza)
//
// Cada pieza sale en out/semana-XX/N-negocio-formato/ con video.mp4,
// instagram.txt, tiktok.txt y ficha.md.
//
// Qué toca cada semana lo decide datos/cola.mjs; cada pieza es un reel del
// motor (datos/formatos.mjs dice con qué plantilla). Este script no tiene
// vídeo propio: renderiza la composición "Reel", como `pnpm reel`.
// ============================================================

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { calendario, carpetaDe, reelDe, revisar, semana, semanaDe, POR_SEMANA, SEMANAS, TOTAL } from './datos/cola.mjs'
import { empaquetar, renderizar } from './render.mjs'
import { escribirTextos } from './textos.mjs'

const SALIDA = path.join(path.dirname(fileURLToPath(import.meta.url)), 'out')
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

const serveUrl = soloTextos ? null : await empaquetar()
for (const pieza of piezas) {
  const reel = reelDe(pieza)
  const destino = path.join(SALIDA, carpetaDe(pieza))
  const { semana: s, dentro } = semanaDe(pieza)
  const cabecera = `**Semana ${s}**, pieza ${dentro} de ${POR_SEMANA} · nº ${pieza.i + 1} de ${TOTAL} de la cola · formato «${pieza.formato}»`

  if (soloTextos) {
    escribirTextos(reel, destino, { cabecera })
    console.log('✓ ' + carpetaDe(pieza) + ' (textos)')
    continue
  }
  const { durationInFrames, fps } = await renderizar({
    serveUrl,
    id: 'Reel',
    inputProps: reel,
    salida: path.join(destino, 'video.mp4'),
    etiqueta: carpetaDe(pieza),
  })
  escribirTextos(reel, destino, { segundos: durationInFrames / fps, cabecera })
}

console.log(`\nlisto en ${path.relative(process.cwd(), SALIDA)}/`)
