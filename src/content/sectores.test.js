import { describe, expect, it } from 'vitest'
import { DEFAULT_CONTENT } from './defaults'
import {
  CONTENIDO_POR_SECTOR,
  contenidoDeSector,
  esContenidoDeDemostracion,
  mezclarContenido,
} from './sectores'

const partiendoDeCero = () => structuredClone(DEFAULT_CONTENT)

describe('contenido por sector', () => {
  it('cada sector trae las secciones que el preview lee', () => {
    for (const [id, contenido] of Object.entries(CONTENIDO_POR_SECTOR)) {
      for (const seccion of ['brand', 'hero', 'features', 'carousel', 'pricing', 'faq', 'cta', 'footer']) {
        expect(contenido[seccion], `${id} sin ${seccion}`).toBeTruthy()
      }
      expect(contenido.brand.name, `${id} sin nombre`).toBeTruthy()
      expect(contenido.hero.title, `${id} sin titular`).toBeTruthy()
    }
  })

  it('las fotos son enlaces verificables, no rutas inventadas', () => {
    const urls = JSON.stringify(CONTENIDO_POR_SECTOR).match(/https:\/\/[^"]+/g) ?? []
    expect(urls.length).toBeGreaterThan(20)
    for (const url of urls) {
      expect(url, url).toMatch(/^https:\/\/(images\.pexels\.com|picsum\.photos)\//)
    }
  })

  it('no devuelve contenido para un preset que no es de sector', () => {
    expect(contenidoDeSector('neo-brutal')).toBeNull()
    expect(contenidoDeSector('medical-wellness')).toBeTruthy()
  })
})

// ============================================================
// La regla que protege el trabajo del cliente. Se mira la huella (nombre,
// titular y entradilla) y no el objeto entero: comparar el contenido completo
// hacía que poner tu propio WhatsApp bastara para que el contenido de sector
// no volviera a aplicarse nunca.
// ============================================================
describe('cuándo se puede sustituir el contenido', () => {
  it('sí, si no se ha tocado nada', () => {
    expect(esContenidoDeDemostracion(partiendoDeCero(), DEFAULT_CONTENT)).toBe(true)
  })

  it('sí, aunque se hayan tocado campos que no son la huella', () => {
    const c = partiendoDeCero()
    c.brand.whatsapp = '+34 611 223 344'
    c.footer.legal = 'Aviso legal'
    expect(esContenidoDeDemostracion(c, DEFAULT_CONTENT)).toBe(true)
  })

  it('sí, si ya se había aplicado otro sector', () => {
    const clinica = structuredClone(CONTENIDO_POR_SECTOR['medical-wellness'])
    expect(esContenidoDeDemostracion(clinica, DEFAULT_CONTENT)).toBe(true)
  })

  it('NO, en cuanto el cliente escribe su nombre, su titular o su entradilla', () => {
    for (const [seccion, campo, valor] of [
      ['brand', 'name', 'Bar Casa Paco'],
      ['hero', 'title', 'El mejor pulpo del barrio'],
      ['hero', 'subtitle', 'Abrimos desde 1974 en la misma esquina.'],
    ]) {
      const c = partiendoDeCero()
      c[seccion][campo] = valor
      expect(esContenidoDeDemostracion(c, DEFAULT_CONTENT), `${seccion}.${campo}`).toBe(false)
    }
  })
})

describe('mezclarContenido', () => {
  it('hereda del contenido de partida lo que el sector no define', () => {
    const r = mezclarContenido(DEFAULT_CONTENT, { hero: { title: 'Solo el titular' } })
    expect(r.hero.title).toBe('Solo el titular')
    expect(r.hero.primary).toBe(DEFAULT_CONTENT.hero.primary)
    expect(r.footer).toEqual(DEFAULT_CONTENT.footer)
  })

  it('reemplaza las listas enteras, no las fusiona', () => {
    const r = mezclarContenido(DEFAULT_CONTENT, { brand: { navLinks: ['Uno', 'Dos'] } })
    expect(r.brand.navLinks).toEqual(['Uno', 'Dos'])
  })
})
