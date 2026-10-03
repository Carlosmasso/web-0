import { describe, it, expect } from 'vitest'
import { summariseImages } from './contact'

const IMG = 'data:image/webp;base64,AAAA'

describe('summariseImages', () => {
  it('sin imágenes subidas -> cadena vacía (las URLs no cuentan)', () => {
    expect(summariseImages({ hero: { image: 'https://ejemplo.com/foto.jpg' } })).toBe('')
    expect(summariseImages({})).toBe('')
    expect(summariseImages(null)).toBe('')
  })

  it('lista las secciones con imágenes subidas y cuenta cuando hay varias', () => {
    const content = {
      hero: { image: IMG },
      features: { items: [{ image: IMG }, { image: IMG }, {}] },
      faq: { items: [{ q: 'x', a: 'y' }] },
    }
    expect(summariseImages(content)).toBe('hero, features (2)')
  })
})

describe('extras en la nota', () => {
  it('van delante de la nota, y sin extras la nota queda igual', async () => {
    const { noteWithExtras } = await import('./contact')
    expect(noteWithExtras('  Para mayo  ', ['Más páginas', 'Reservas o citas'])).toBe(
      'También necesita: Más páginas, Reservas o citas.\n\nPara mayo',
    )
    expect(noteWithExtras('Hola', [])).toBe('Hola')
    expect(noteWithExtras('', ['Vender online'])).toBe('También necesita: Vender online.')
  })
})
