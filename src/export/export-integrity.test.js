import { describe, it, expect } from 'vitest'
import { buildProjectFiles } from './scaffold'
import { DEFAULT_CONFIG } from '../config/schema'
import { DEFAULT_CONTENT } from '../content/defaults'
import pkg from '../../package.json'

// El .zip es lo que Carlos entrega. Estos tests comprueban, sin llegar a
// compilarlo (eso lo hace scripts/verify-export.mjs), que el árbol de imports
// cierra: cada import relativo apunta a un archivo incluido, y cada paquete
// externo está en las dependencias que el package.json generado declara.

const { files } = buildProjectFiles(DEFAULT_CONFIG, DEFAULT_CONTENT)

const codeFiles = Object.entries(files).filter(
  ([name, body]) => /\.(js|jsx)$/.test(name) && typeof body === 'string',
)

/** Todos los especificadores de `import ... from '...'` / `export ... from '...'`. */
function importSpecifiers(src) {
  const out = []
  const re = /(?:import|export)[^'"]*?\bfrom\s*['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(src))) out.push(m[1])
  // imports de efecto colateral: `import './x.css'`
  const side = /import\s*['"]([^'"]+)['"]/g
  while ((m = side.exec(src))) out.push(m[1])
  return out
}

/** Resuelve un import relativo contra el set de archivos del proyecto. */
function resolvesInProject(fromFile, spec) {
  const dir = fromFile.split('/').slice(0, -1)
  const parts = spec.split('/')
  const stack = [...dir]
  for (const p of parts) {
    if (p === '.' || p === '') continue
    if (p === '..') stack.pop()
    else stack.push(p)
  }
  const base = stack.join('/')
  const candidates = base.endsWith('.css')
    ? [base]
    : [base, `${base}.js`, `${base}.jsx`, `${base}/index.js`, `${base}/index.jsx`]
  return candidates.some((c) => c in files)
}

const deps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
])
const packageOf = (spec) => {
  const seg = spec.split('/')
  return spec.startsWith('@') ? `${seg[0]}/${seg[1]}` : seg[0]
}

describe('integridad del proyecto exportado', () => {
  it('genera al menos los componentes de runtime y el punto de entrada', () => {
    expect(codeFiles.length).toBeGreaterThan(15)
    expect(files['src/main.jsx']).toBeTruthy()
  })

  it('todo import relativo apunta a un archivo incluido en el .zip', () => {
    const broken = []
    for (const [name, body] of codeFiles) {
      for (const spec of importSpecifiers(body)) {
        if (!spec.startsWith('.')) continue
        if (!resolvesInProject(name, spec)) broken.push(`${name} → ${spec}`)
      }
    }
    expect(broken).toEqual([])
  })

  it('todo paquete externo está en las dependencias del package.json generado', () => {
    const generatedDeps = new Set(Object.keys(JSON.parse(files['package.json']).dependencies || {}))
    const missing = new Set()
    for (const [, body] of codeFiles) {
      for (const spec of importSpecifiers(body)) {
        if (spec.startsWith('.') || spec.startsWith('/')) continue
        const p = packageOf(spec)
        if (!generatedDeps.has(p) && !deps.has(p)) missing.add(p)
      }
    }
    expect([...missing]).toEqual([])
  })

  it('ningún archivo de runtime arrastra el configurador (mode, guardrails, App…)', () => {
    const forbidden = /\/(config\/mode|config\/guardrails|configurator\/|registry\/presets|registry\/vocabulary)/
    const leaks = []
    for (const [name, body] of codeFiles) {
      for (const spec of importSpecifiers(body)) {
        if (forbidden.test(spec)) leaks.push(`${name} → ${spec}`)
      }
    }
    expect(leaks).toEqual([])
  })
})
