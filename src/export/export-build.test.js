import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { Buffer } from 'node:buffer'
import { buildProjectFiles } from './scaffold'
import { PRESETS } from '../registry/presets'
import { normalizeConfigWithGuardrails } from '../config/guardrails'
import { DEFAULT_CONTENT } from '../content/defaults'

// Lento y con red: solo corre con VERIFY_EXPORT_BUILD=1 (`npm run verify:export`).
// Genera un proyecto desde un preset, lo escribe en un temp, hace `npm install`
// y `vite build`, y comprueba que sale `dist/`. Es la única prueba de que el
// .zip que entregas de verdad compila.
const RUN = process.env.VERIFY_EXPORT_BUILD === '1'

describe.skipIf(!RUN)('el .zip compila (npm install + vite build)', () => {
  it(
    'un proyecto generado desde un preset produce dist/index.html',
    () => {
      const preset = PRESETS.find((p) => p.id === 'local-food') ?? PRESETS[0]
      const config = normalizeConfigWithGuardrails(preset.config).config
      const content = structuredClone(DEFAULT_CONTENT)
      content.brand.name = 'Prueba de export'
      content.hero.image = 'data:image/webp;base64,QUFBQQ==' // imagen subida -> public/img/

      const { files } = buildProjectFiles(config, content)
      const dir = mkdtempSync(join(tmpdir(), 'maqueta-export-'))

      try {
        for (const [name, body] of Object.entries(files)) {
          const full = join(dir, name)
          mkdirSync(dirname(full), { recursive: true })
          writeFileSync(
            full,
            body && typeof body === 'object' && 'base64' in body
              ? Buffer.from(body.base64, 'base64')
              : body,
          )
        }

        execSync('npm install --no-audit --no-fund --loglevel=error', {
          cwd: dir,
          stdio: 'inherit',
        })
        execSync('npm run build', { cwd: dir, stdio: 'inherit' })

        const html = readFileSync(join(dir, 'dist/index.html'), 'utf8')
        expect(html).toContain('<div id="root">')
        expect(html).toMatch(/<script[^>]+src=/)
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
    240_000,
  )
})
