#!/usr/bin/env node
// ============================================================
// GRABAR — producción de reels, organizada por semanas
//
//   node scripts/social/grabar.mjs            enseña el calendario
//   node scripts/social/grabar.mjs 1          graba la semana 1
//   node scripts/social/grabar.mjs 1-3        graba de la semana 1 a la 3
//   node scripts/social/grabar.mjs 2 --textos reescribe solo los textos
//
// Cada pieza cae en su carpeta con todo lo necesario para publicarla sin
// volver aquí:
//
//   salida/semana-01/1-rural-rafaga/
//     video.mp4        el reel, listo para subir
//     instagram.txt    pie con párrafos y etiquetas
//     tiktok.txt       pie de una frase
//     ficha.md         qué se ve, cuánto dura y cómo publicarlo
//
// Se sirve por la IP de la máquina y no por localhost a propósito: en
// localhost el configurador arranca en modo estudio (ver `src/config/mode.js`)
// y saldrían en cuadro botones que el cliente no tiene.
// ============================================================

import { spawn, execFileSync } from 'node:child_process'
import { networkInterfaces } from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { abrirPlato } from './lib/plato.mjs'
import { semana, materializar, revisar, calendario, TOTAL, SEMANAS, POR_SEMANA } from './plan.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '../..')
const SALIDA = path.join(AQUI, 'salida')
const PUERTO = 4173

// ---------- argumentos ----------
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
  console.log('\nPara grabar:  node scripts/social/grabar.mjs 1      (o 1-3)')
  process.exit(0)
}

const [desde, hasta] = rango.includes('-')
  ? rango.split('-').map(Number)
  : [Number(rango), Number(rango)]

const piezas = []
for (let s = desde; s <= Math.min(hasta, SEMANAS); s++) {
  piezas.push(...semana(s).map(materializar))
}
if (!piezas.length) {
  console.error(`no hay piezas entre las semanas ${desde} y ${hasta} (hay ${SEMANAS})`)
  process.exit(1)
}

// ---------- lo que acompaña a cada vídeo ----------
function escribirTextos(ficha, destino, duracionReal) {
  fs.mkdirSync(destino, { recursive: true })
  // La duración real solo se conoce al grabar, pero las fichas se reescriben
  // muchas veces con --textos: se guarda al lado para no perderla.
  const meta = path.join(destino, '.duracion')
  if (duracionReal) fs.writeFileSync(meta, String(duracionReal))
  else if (fs.existsSync(meta)) duracionReal = Number(fs.readFileSync(meta, 'utf8')) || null
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
| Dura | ${duracionReal ? duracionReal.toFixed(1).replace('.', ',') + ' s' : 'unos ' + ficha.dura + ' s'} · 1080x1920 · MP4 H.264 |

## Qué se ve

${ficha.queSeVe}

## Cómo publicarlo

El mismo \`video.mp4\` vale para Instagram y para TikTok: es 9:16 y no lleva
marca de agua de ninguna plataforma. **Va mudo a propósito** — ponle audio en la
propia aplicación, que es lo que premia el algoritmo y evita líos de derechos.
Los cortes están montados a 120 bpm, así que cualquier pista de ese tempo
encaja sola.

El texto NO es el mismo en las dos redes: usa \`instagram.txt\` allí y
\`tiktok.txt\` en TikTok, donde solo se lee la primera línea antes del «más».

El enlace va en la biografía, no en el pie (en el pie no se puede pulsar).
Ponlo como \`maketa.es/?utm_source=instagram\` para poder medir qué trae gente.
`,
  )
}

if (soloTextos) {
  for (const { ficha } of piezas) {
    escribirTextos(ficha, path.join(SALIDA, ficha.carpeta))
    console.log('✓ ' + ficha.carpeta)
  }
  console.log('\ntextos actualizados (los vídeos no se han tocado)')
  process.exit(0)
}

// ---------- utilidades ----------
const ipLocal = () => {
  for (const redes of Object.values(networkInterfaces())) {
    for (const r of redes ?? []) {
      if (r.family === 'IPv4' && !r.internal) return r.address
    }
  }
  throw new Error('sin IP de red: el modo cliente necesita servir por IP, no por localhost')
}

const esperarServidor = async (url, intentos = 40) => {
  for (let i = 0; i < intentos; i++) {
    try {
      if ((await fetch(url)).ok) return true
    } catch {}
    await new Promise((res) => setTimeout(res, 500))
  }
  throw new Error('el servidor no respondió: ' + url)
}

const mux = path.join(AQUI, 'lib', 'mux')
if (!fs.existsSync(mux)) {
  console.log('compilando el montador…')
  execFileSync('swiftc', ['-O', path.join(AQUI, 'lib', 'mux.swift'), '-o', mux], { stdio: 'inherit' })
}

console.log(`semanas ${desde}${hasta > desde ? '–' + hasta : ''} · ${piezas.length} piezas\n`)
console.log('compilando el proyecto…')
execFileSync('npm', ['run', 'build'], { cwd: RAIZ, stdio: ['ignore', 'ignore', 'inherit'] })

const servidor = spawn('npx', ['vite', 'preview', '--host', '--port', String(PUERTO)], {
  cwd: RAIZ,
  stdio: 'ignore',
})
const base = `http://${ipLocal()}:${PUERTO}`
await esperarServidor(`${base}/app.html`)
console.log('sirviendo en ' + base + '\n')

try {
  for (const { ficha, contenido, guion } of piezas) {
    const destino = path.join(SALIDA, ficha.carpeta)
    console.log(`▶ ${ficha.carpeta}`)

    const trabajo = path.join(destino, '.frames')
    const reel = await abrirPlato({ url: `${base}/app.html`, salida: trabajo, contenido })
    const { duracion } = await guion(reel)

    execFileSync(
      mux,
      [path.join(trabajo, 'manifest.json'), path.join(trabajo, 'frames'), path.join(destino, 'video.mp4'), '30'],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    )
    escribirTextos(ficha, destino, duracion)
    // los fotogramas sueltos pesan cientos de megas y ya están dentro del MP4
    fs.rmSync(trabajo, { recursive: true, force: true })
    console.log('  ✓ video.mp4 + instagram.txt + tiktok.txt + ficha.md\n')
  }
} finally {
  servidor.kill()
}

// ---------- índice general ----------
const indice = [
  '# Calendario de publicación',
  '',
  `${TOTAL} piezas · ${POR_SEMANA} por semana · ${SEMANAS} semanas sin que se repita ninguna combinación.`,
  '',
  'Cada carpeta lleva el vídeo, los dos pies de foto y una ficha con lo que se ve.',
  '',
  calendario(0, TOTAL),
  '',
  '## Cómo se graba el resto',
  '',
  '```bash',
  'node scripts/social/grabar.mjs 3      # la semana 3',
  'node scripts/social/grabar.mjs 3-6    # de la 3 a la 6',
  'node scripts/social/grabar.mjs 3 --textos   # solo los textos',
  '```',
  '',
].join('\n')
fs.writeFileSync(path.join(SALIDA, 'CALENDARIO.md'), indice)

console.log('listo. Todo en scripts/social/salida/ (ver CALENDARIO.md)')
