// ============================================================
// FUENTES DE LAS WEBS A MEDIDA, SERVIDAS DESDE MAKETA
//
// Las demos de public/trabajos/ no piden nada a Google al abrirse. Cada una
// declara sus tipografías con la URL de Google Fonts de siempre, pero guardada
// en un atributo:
//   <link rel="stylesheet" href="/trabajos/fuentes/fuentes.css" data-fuentes="https://fonts.googleapis.com/css2?…">
// Este script lee esas URL, descarga solo el subconjunto latino (español
// completo: ñ, tildes, ¿ ¡, comillas…) en woff2 y escribe un único
// public/trabajos/fuentes/fuentes.css. Los navegadores solo descargan las caras
// que cada página usa de verdad.
//
//   pnpm fuentes:trabajos
//
// Para añadir o cambiar una tipografía: se cambia el data-fuentes de la demo y
// se pasa el script. Primero lo descarga todo; si algo falla, no toca nada.
// ============================================================

import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const DIR = 'public/trabajos'
const OUT = join(DIR, 'fuentes')
// Con un navegador moderno, Google sirve woff2 y separa por subconjuntos.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
const LINK = /<link rel="stylesheet" href="\/trabajos\/fuentes\/fuentes\.css" data-fuentes="([^"]+)">/

const prop = (body, name) => {
  const m = body.match(new RegExp(`${name}:\\s*([^;]+);`))
  if (!m) throw new Error(`Falta ${name} en un @font-face de Google`)
  return m[1].trim()
}

// 1. Qué pide cada demo.
const urls = new Set()
for (const file of readdirSync(DIR).filter((f) => f.endsWith('.html'))) {
  const m = readFileSync(join(DIR, file), 'utf8').match(LINK)
  if (m) urls.add(m[1].replace(/&amp;/g, '&'))
  else console.log(`· ${file}: sin data-fuentes, se queda como está`)
}

// 2. Descargarlo todo a memoria.
const faces = new Map() // familia|estilo|peso → { body, src, name }
for (const url of urls) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`Google Fonts respondió ${res.status} para ${url}`)
  const css = await res.text()
  // Cada bloque va precedido de su subconjunto: /* latin */ @font-face { … }
  for (const [, subset, body] of css.matchAll(/\/\* ([\w-]+) \*\/\s*@font-face\s*\{([^}]+)\}/g)) {
    if (subset !== 'latin') continue
    const family = prop(body, 'font-family').replace(/'/g, '')
    const style = prop(body, 'font-style')
    const weight = prop(body, 'font-weight')
    const key = `${family}|${style}|${weight}`
    if (faces.has(key)) continue
    const src = (body.match(/url\((https:[^)]+\.woff2)\)/) || [])[1]
    if (!src) throw new Error(`Google no ha dado woff2 para ${key} (¿ha cambiado su respuesta?)`)
    const slug = family.toLowerCase().replace(/\s+/g, '-')
    // El nombre sale del archivo de origen: varios pesos de una fuente variable
    // comparten el mismo woff2 y así se descarga una sola vez.
    const name = `${slug}-${style}-${createHash('sha1').update(src).digest('hex').slice(0, 8)}.woff2`
    faces.set(key, { body, src, name })
  }
}
if (!faces.size) throw new Error('No ha salido ninguna fuente: no se toca nada.')
const files = new Map()
for (const f of faces.values()) {
  if (files.has(f.name)) continue
  const res = await fetch(f.src)
  if (!res.ok) throw new Error(`No se pudo bajar ${f.src} (${res.status})`)
  files.set(f.name, Buffer.from(await res.arrayBuffer()))
}

// 3. Escribir: la carpeta entera de nuevo, para no dejar archivos huérfanos.
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
for (const [name, data] of files) writeFileSync(join(OUT, name), data)
const css = [...faces.values()].map((f) => `@font-face {${f.body.replace(/url\([^)]+\)/, `url(/trabajos/fuentes/${f.name})`)}}`)
writeFileSync(join(OUT, 'fuentes.css'), '/* Generado por scripts/fuentes-trabajos.mjs: tipografías de las demos, solo latín. */\n' + css.join('\n') + '\n')
const kb = Math.round([...files.values()].reduce((s, b) => s + b.length, 0) / 1024)
console.log(`✓ ${faces.size} caras en ${files.size} archivos (${kb} KB) para ${urls.size} demos`)
