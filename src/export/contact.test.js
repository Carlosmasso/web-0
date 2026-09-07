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
