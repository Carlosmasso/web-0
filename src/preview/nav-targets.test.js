import { describe, it, expect } from 'vitest'
import { navTargets } from './nav-targets'
import { SECTION_ORDER } from '../config/schema'

// El menú de una landing tiene que bajar a algún sitio SIEMPRE: el cliente
// escribe los textos a mano y nadie elige el destino, así que lo que no se
// reconoce por palabra clave se reparte por orden. Ningún enlace muerto.

describe('destinos del menú', () => {
  it('empareja por lo que dice el enlace, no por su posición', () => {
    expect(navTargets(['Precios', 'Preguntas frecuentes'], SECTION_ORDER)).toEqual([
      'pricing',
      'faq',
    ])
  })

  it('ignora acentos y mayúsculas', () => {
    expect(navTargets(['CARACTERÍSTICAS', 'Opiniones'], SECTION_ORDER)).toEqual([
      'features',
      'testimonial',
    ])
  })

  it('"Inicio" vuelve a la portada, que nunca se reparte sola', () => {
    const [inicio, otro] = navTargets(['Inicio', 'Novedades'], SECTION_ORDER)
    expect(inicio).toBe('hero')
    expect(otro).not.toBe('hero')
  })

  it('lo que no reconoce lo reparte en orden de aparición, sin repetir', () => {
    const out = navTargets(['Novedades', 'Equipo', 'Blog'], SECTION_ORDER)
    expect(new Set(out).size).toBe(3)
    expect(out).not.toContain('hero')
    // en el orden de la página, no en el del menú
    expect(out).toEqual([...out].sort((a, b) => SECTION_ORDER.indexOf(a) - SECTION_ORDER.indexOf(b)))
  })

  it('la franja de logos solo es destino si el enlace la nombra', () => {
    // por reparto automático, nunca: es una banda de dos centímetros
    expect(navTargets(['Novedades'], SECTION_ORDER)).not.toContain('logos')
    expect(navTargets(['Partners'], SECTION_ORDER)).toEqual(['logos'])
  })

  it('nunca manda a una sección que el usuario ha quitado', () => {
    const order = ['hero', 'features', 'cta']
    const out = navTargets(['Precios', 'Opiniones'], order)
    for (const target of out) expect([...order, 'db-footer']).toContain(target)
  })

  it('con más enlaces que secciones, los últimos van al pie', () => {
    const out = navTargets(['Uno', 'Dos', 'Tres', 'Cuatro'], ['hero', 'features', 'cta'])
    expect(out).toEqual(['features', 'cta', 'db-footer', 'db-footer'])
  })

  it('no repite destino aunque dos enlaces hablen de lo mismo', () => {
    const out = navTargets(['Precios', 'Tarifas'], SECTION_ORDER)
    expect(out[0]).toBe('pricing')
    expect(out[1]).not.toBe('pricing')
  })
})
