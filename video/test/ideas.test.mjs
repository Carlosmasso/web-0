// Comprueba contenido/ideas.json sin renderizar nada: que cada idea está bien
// escrita y que cada carrusel listo se convierte en diapositivas.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import * as sistema from '../contenido/sistema.mjs'
import { cuantosDe, listaParaCrear, problemasDe, serieDe, validarTodas, visualDe } from '../lib/modelo.mjs'
import { celdasFeed, propsDe } from '../lib/props.mjs'
import { resolverCarrusel } from '../src/carrusel/plantillas.js'

const ideas = JSON.parse(fs.readFileSync(new URL('../contenido/ideas.json', import.meta.url), 'utf8'))

test('todas las ideas están bien escritas y los ids no se repiten', () => {
  assert.doesNotThrow(() => validarTodas(ideas, sistema))
})

test('cada carrusel listo se convierte en diapositivas', () => {
  for (const p of ideas.filter((q) => q.formato === 'carrusel' && listaParaCrear(q))) {
    const { carrusel, visual, serie } = propsDe(p, ideas, sistema)
    assert.doesNotThrow(() => resolverCarrusel(carrusel, { visual, serie }), p.id)
  }
})

test('los errores se explican', () => {
  const mala = problemasDe({ id: 'X', formato: 'reel', gancho: 'a', serie: 'nada', reel: {} }, sistema)
  assert.ok(mala.some((m) => m.includes('IR-01')))
  assert.ok(mala.some((m) => m.includes('serie')))
  assert.ok(mala.some((m) => m.includes('reel.plantilla')))
})

test('visual por defecto: oscuro, el layout de la serie, y sin número no hay C', () => {
  assert.deepEqual(visualDe({ formato: 'reel', reel: {} }, sistema), { tema: 'dark', layout: 'A', portada: 'pila' })
  assert.equal(visualDe({ formato: 'carrusel', serie: 'mitos-web', carrusel: {} }, sistema).layout, 'B')
  assert.equal(visualDe({ formato: 'reel', visual: { layout: 'C' }, reel: { plantilla: 'recorrido' } }, sistema).layout, 'A')
  assert.equal(cuantosDe({ formato: 'carrusel', carrusel: { puntos: [1, 2, 3] } }), 3)
})

test('la serie se numera por el orden del archivo', () => {
  const lista = [{ id: 'IC-05', serie: 'errores-web' }, { id: 'IC-01', serie: 'errores-web' }]
  assert.deepEqual(serieDe(lista[1], lista, sistema), { nombre: 'Errores web', numero: 2 })
})

test('el borrador del feed pone lo último arriba y rechaza lo que no existe', () => {
  const [a, b] = ideas.filter(listaParaCrear)
  const celdas = celdasFeed([a.id, b.id], ideas, sistema)
  assert.deepEqual(celdas.map((c) => [c.id, c.orden]), [[b.id, 2], [a.id, 1]])
  assert.throws(() => celdasFeed(['IR-999'], ideas, sistema), /no existe/)
})
