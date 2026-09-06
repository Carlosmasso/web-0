import { describe, it, expect } from 'vitest'
import { encodeConfig, decodeConfig, encodeContent, decodeContent } from './encode'
import { DEFAULT_CONFIG } from './schema'
import { DEFAULT_CONTENT } from '../content/defaults'

describe('encode/decode config (enlaces ?c=)', () => {
  it('ida y vuelta conserva la configuración', () => {
    const d = decodeConfig(encodeConfig(DEFAULT_CONFIG))
    expect(d.aesthetic).toBe(DEFAULT_CONFIG.aesthetic)
    expect(d.palette.primary).toBe(DEFAULT_CONFIG.palette.primary)
    expect(d.sectionOrder).toEqual(DEFAULT_CONFIG.sectionOrder)
  })

  it('devuelve null con basura, sin lanzar', () => {
    expect(decodeConfig('esto-no-es-base64-@@@')).toBeNull()
    expect(decodeConfig('')).toBeNull()
  })

  it('la salida es url-safe (sin + / =)', () => {
    expect(encodeConfig(DEFAULT_CONFIG)).not.toMatch(/[+/=]/)
  })
})

describe('encode/decode content (parte ~ del enlace)', () => {
  it('conserva textos y URLs de imagen, vacía las subidas (data URI)', () => {
    const content = structuredClone(DEFAULT_CONTENT)
    content.hero.title = 'Hola'
    content.hero.image = 'data:image/webp;base64,AAAA'
    content.features.items[0].image = 'https://x.com/a.jpg'

    const d = decodeContent(encodeContent(content))
    expect(d.hero.title).toBe('Hola')
    expect(d.hero.image).toBe('')
    expect(d.features.items[0].image).toBe('https://x.com/a.jpg')
  })

  it('devuelve null con basura', () => {
    expect(decodeContent('@@@')).toBeNull()
  })
})
