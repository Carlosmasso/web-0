import { describe, it, expect } from 'vitest'
import { buildProjectFiles } from './scaffold'
import { DEFAULT_CONFIG } from '../config/schema'
import { DEFAULT_CONTENT } from '../content/defaults'

describe('buildProjectFiles (el .zip que le llega al cliente)', () => {
  const content = structuredClone(DEFAULT_CONTENT)
  content.brand.name = 'Café Luná'
  content.hero.image = 'data:image/webp;base64,QUFBQQ==' // imagen subida
  content.features.items[1].image = 'https://picsum.photos/seed/x/900/700' // por URL

  const { files, projectName } = buildProjectFiles(DEFAULT_CONFIG, content)

  it('slugifica el nombre de proyecto', () => {
    expect(projectName).toBe('cafe-luna')
  })

  it('incluye los archivos núcleo del proyecto', () => {
    for (const f of [
      'package.json',
      'vite.config.js',
      'index.html',
      'src/main.jsx',
      'src/site.config.js',
      'src/preview/DemoPage.jsx',
      'src/theme/resolve.js',
    ]) {
      expect(files[f], f).toBeTruthy()
    }
  })

  it('demo.css llega resuelto (?inline), con los 5 parciales dentro', () => {
    const css = files['src/preview/demo.css']
    expect(typeof css).toBe('string')
    expect(css.length).toBeGreaterThan(4000)
    expect(css).toMatch(/\.pv-canvas/) // tokens
    expect(css).toMatch(/\[data-aesthetic=/) // aesthetics
    expect(css).toMatch(/\.db-hero/) // elements
    expect(css).toMatch(/\.pv-spot/) // states
    expect(css).not.toMatch(/@import/) // ya resuelto, no un índice
  })

  it('saca las imágenes subidas a public/img/ y reescribe la ruta', () => {
    expect(files['public/img/hero-image.webp']).toEqual({ base64: 'QUFBQQ==' })
    expect(files['src/site.config.js']).toContain('/img/hero-image.webp')
    expect(files['src/site.config.js']).not.toContain('data:image/webp')
  })

  it('deja intactas las imágenes por URL', () => {
    expect(files['src/site.config.js']).toContain('picsum.photos/seed/x')
  })

  it('site.config.js exporta JSON parseable', () => {
    const src = files['src/site.config.js']
    expect(src).toMatch(/export const SITE_CONFIG =/)
    expect(src).toMatch(/export const SITE_CONTENT =/)
    const cfg = src.slice(
      src.indexOf('SITE_CONFIG = ') + 'SITE_CONFIG = '.length,
      src.indexOf('\n\nexport const SITE_CONTENT'),
    )
    const cnt = src.slice(src.indexOf('SITE_CONTENT = ') + 'SITE_CONTENT = '.length).trimEnd()
    expect(() => JSON.parse(cfg)).not.toThrow()
    expect(() => JSON.parse(cnt)).not.toThrow()
  })

  it('index.html referencia el punto de entrada', () => {
    expect(files['index.html']).toContain('src/main.jsx')
  })
})
