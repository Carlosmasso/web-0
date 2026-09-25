#!/usr/bin/env node
// ============================================================
// GRABAR REELS —  node scripts/social/grabar.mjs [nombre|todos]
//
// Hace el recorrido entero solo: compila el proyecto, lo sirve, graba cada
// reel del producto de verdad, monta el MP4 y deja el pie de foto al lado.
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

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.resolve(AQUI, '../..')
const SALIDA = path.join(AQUI, 'salida')
const PUERTO = 4173

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
      const r = await fetch(url)
      if (r.ok) return true
    } catch {}
    await new Promise((res) => setTimeout(res, 500))
  }
  throw new Error('el servidor no respondió: ' + url)
}

// Los textos se retocan mucho más a menudo que los vídeos, y regrabar para
// cambiar una coma son diez minutos tirados: `--pies` escribe solo los .txt.
const soloPies = process.argv.includes('--pies')

const args = process.argv.filter((a) => !a.startsWith('--'))
const pedido = args[2] ?? 'todos'

// ---------- el plan en serie ----------
// `--plan [desde] [cuantas]` graba piezas de la cola combinatoria en vez de
// los guiones artesanales de `reels/`. `--calendario` solo lo enseña.
const enPlan = process.argv.includes('--plan') || process.argv.includes('--calendario')
let piezasPlan = []
if (enPlan) {
  const { cola, materializar, revisar, calendario, TOTAL } = await import('./plan.mjs')
  const desde = Number(args[2]) || 0
  const cuantas = Number(args[3]) || 3
  const problemas = revisar()
  if (problemas.length) {
    console.error('la cola se pisa:\n' + problemas.map((p) => '  · ' + p).join('\n'))
    process.exit(1)
  }
  if (process.argv.includes('--calendario')) {
    console.log(`Cola de ${TOTAL} piezas sin repetir. Siguientes desde la ${desde + 1}:\n`)
    console.log(calendario(desde, cuantas || 12))
    process.exit(0)
  }
  piezasPlan = cola(desde, cuantas).map(materializar)
  console.log(`plan: piezas ${desde + 1} a ${desde + piezasPlan.length} de ${TOTAL}\n`)
}

// ---------- qué se graba ----------
const guiones = enPlan
  ? []
  : fs
      .readdirSync(path.join(AQUI, 'reels'))
      .filter((f) => f.endsWith('.mjs'))
      .sort()
      .filter((f) => pedido === 'todos' || f.includes(pedido))

if (!guiones.length && !piezasPlan.length) {
  console.error(`no hay ningún guion que case con "${pedido}"`)
  process.exit(1)
}

/** Las piezas a grabar, vengan del plan o de los guiones artesanales. */
async function cargarPiezas() {
  if (piezasPlan.length) return piezasPlan
  return Promise.all(guiones.map((a) => import(path.join(AQUI, 'reels', a))))
}

/** Un pie por red: Instagram admite párrafos y etiquetas; TikTok, una frase. */
function escribirPies(ficha) {
  fs.writeFileSync(path.join(SALIDA, `${ficha.nombre}.txt`), ficha.pie + '\n')
  if (ficha.pieTikTok) {
    fs.writeFileSync(path.join(SALIDA, `${ficha.nombre}-tiktok.txt`), ficha.pieTikTok + '\n')
  }
}

// ---------- solo los textos ----------
if (soloPies) {
  fs.mkdirSync(SALIDA, { recursive: true })
  for (const { ficha } of await cargarPiezas()) {
    escribirPies(ficha)
    console.log(`✓ ${ficha.nombre}`)
  }
  console.log('\npies actualizados en scripts/social/salida/ (los vídeos no se han tocado)')
  process.exit(0)
}

// ---------- montador ----------
const mux = path.join(AQUI, 'lib', 'mux')
if (!fs.existsSync(mux)) {
  console.log('compilando el montador…')
  execFileSync('swiftc', ['-O', path.join(AQUI, 'lib', 'mux.swift'), '-o', mux], { stdio: 'inherit' })
}

// ---------- build + servidor ----------
console.log('compilando el proyecto…')
execFileSync('npm', ['run', 'build'], { cwd: RAIZ, stdio: ['ignore', 'ignore', 'inherit'] })

const servidor = spawn('npx', ['vite', 'preview', '--host', '--port', String(PUERTO)], {
  cwd: RAIZ,
  stdio: 'ignore',
})
const base = `http://${ipLocal()}:${PUERTO}`
await esperarServidor(`${base}/app.html`)
console.log('sirviendo en ' + base + '\n')

fs.mkdirSync(SALIDA, { recursive: true })

try {
  for (const { ficha, contenido, guion } of await cargarPiezas()) {
    console.log(`▶ ${ficha.nombre} — ${ficha.titulo}`)

    const trabajo = path.join(SALIDA, ficha.nombre)
    const reel = await abrirPlato({ url: `${base}/app.html`, salida: trabajo, contenido })
    await guion(reel)

    const mp4 = path.join(SALIDA, `${ficha.nombre}.mp4`)
    execFileSync(mux, [path.join(trabajo, 'manifest.json'), path.join(trabajo, 'frames'), mp4, '30'], {
      stdio: ['ignore', 'ignore', 'inherit'],
    })
    escribirPies(ficha)
    // los fotogramas sueltos pesan cientos de megas y ya están dentro del MP4
    fs.rmSync(trabajo, { recursive: true, force: true })
    console.log(`  ✓ ${path.relative(RAIZ, mp4)}\n`)
  }
} finally {
  servidor.kill()
}

console.log('listo. Los MP4 y sus pies de foto están en scripts/social/salida/')
