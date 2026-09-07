import { describe, it, expect } from 'vitest'
import { looksLikeBot, tooLarge, MIN_FORM_MS } from '../api/lead.js'

describe('looksLikeBot', () => {
  it('humano normal -> null', () => {
    expect(looksLikeBot({ company: '', elapsedMs: 40000 })).toBe(null)
    expect(looksLikeBot({})).toBe(null)
  })

  it('honeypot relleno -> "honeypot"', () => {
    expect(looksLikeBot({ company: 'Acme Corp' })).toBe('honeypot')
    expect(looksLikeBot({ company: '   x   ' })).toBe('honeypot')
  })

  it('envío casi instantáneo -> "too_fast"', () => {
    expect(looksLikeBot({ elapsedMs: 400 })).toBe('too_fast')
    expect(looksLikeBot({ elapsedMs: MIN_FORM_MS - 1 })).toBe('too_fast')
  })

  it('sin marca de tiempo (0 o ausente) no cuenta como bot', () => {
    expect(looksLikeBot({ elapsedMs: 0 })).toBe(null)
    expect(looksLikeBot({ company: '' })).toBe(null)
  })
})

describe('tooLarge', () => {
  it('payload normal -> false', () => {
    expect(tooLarge({ name: 'Ana', email: 'a@b.es', note: 'hola', contentText: '{}' })).toBe(false)
  })

  it('campos desmesurados -> true', () => {
    expect(tooLarge({ name: 'x'.repeat(300) })).toBe(true)
    expect(tooLarge({ note: 'x'.repeat(5000) })).toBe(true)
    expect(tooLarge({ contentText: 'x'.repeat(200001) })).toBe(true)
  })
})
