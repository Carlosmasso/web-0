import { describe, it, expect } from 'vitest'
import { SETS } from './Icon'
import { DEFAULT_CONTENT } from '../content/defaults'
import { CONTENIDO_POR_SECTOR } from '../content/sectores'
import { SECCIONES } from '../../video/datos/secciones.mjs'

// Un icono que el contenido pide y el mapa no tiene no rompe nada: se pinta
// la caja vacía, sin avisar. Así pasó con los 18 de los sectores. Este test
// recorre todo el contenido y exige que cada `icon` exista en las dos familias.

function iconosDe(valor, salida = new Set()) {
  if (Array.isArray(valor)) valor.forEach((v) => iconosDe(v, salida))
  else if (valor && typeof valor === 'object') {
    if (typeof valor.icon === 'string') salida.add(valor.icon)
    Object.values(valor).forEach((v) => iconosDe(v, salida))
  }
  return salida
}

const pedidos = iconosDe([DEFAULT_CONTENT, CONTENIDO_POR_SECTOR, SECCIONES])

describe('iconos del contenido', () => {
  it('encuentra iconos que revisar', () => {
    expect(pedidos.size).toBeGreaterThan(20)
  })

  for (const familia of Object.keys(SETS)) {
    it(`todos existen en ${familia}`, () => {
      const faltan = [...pedidos].filter((n) => !SETS[familia][n])
      expect(faltan).toEqual([])
    })
  }
})
