import { PRESETS } from '../../../src/registry/presets'
import { getAesthetic } from '../../../src/registry/aesthetics'
import { hexToHsl } from '../../../src/theme/color'
import { COLORES_CANDIDATOS, EJES, claseTipografia } from './ejes'

// ============================================================
// SELECCIÓN AUTOMÁTICA DE VARIANTES
//
// Un reel con `"variantes": "auto"` no se elige a mano: se buscan las N
// variantes MÁS DISTINTAS entre sí, empezando por la que ya tiene el negocio.
//
// La estrategia es explícita y sencilla: cada eje define una distancia entre
// dos valores con los datos que ya existen (estética, modo claro u oscuro,
// tono del color, clase de tipografía…), y se hace un muestreo del punto más
// lejano: cada nueva variante es la que más se aleja de todas las ya
// elegidas. Es determinista: el mismo reel da siempre el mismo vídeo.
// ============================================================

const distanciaTono = (a, b) => {
  const d = Math.abs(hexToHsl(a).h - hexToHsl(b).h) % 360
  return Math.min(d, 360 - d) / 180 // 0 … 1
}

const rasgosPreset = (id) => {
  const c = PRESETS.find((p) => p.id === id).config
  return {
    estetica: c.aesthetic,
    oscuro: c.meta?.mode === 'dark',
    color: c.palette.primary,
    serif: /serif/i.test(c.typography.headingFamily) && !/sans-serif/i.test(c.typography.headingFamily),
  }
}

const rasgosEstilo = (id) => {
  const { patch } = getAesthetic(id)
  return {
    radio: patch.borders?.radius,
    sombra: patch.shadows?.style,
    cristal: (patch.effects?.blur ?? 0) > 0,
    oscuro: id === 'cyberpunk', // los guardarraíles le fuerzan fondo oscuro
  }
}

/** Distancia entre dos valores de un eje: 0 = iguales, cuanto más, más distintos. */
export const DISTANCIAS = {
  preset: (a, b) => {
    const [x, y] = [rasgosPreset(a), rasgosPreset(b)]
    return (x.estetica !== y.estetica) * 1 + (x.oscuro !== y.oscuro) * 1.2 + (x.serif !== y.serif) * 0.8 + distanciaTono(x.color, y.color)
  },
  estilo: (a, b) => {
    const [x, y] = [rasgosEstilo(a), rasgosEstilo(b)]
    return (x.radio !== y.radio) * 1 + (x.sombra !== y.sombra) * 1 + (x.cristal !== y.cristal) * 0.8 + (x.oscuro !== y.oscuro) * 1.2
  },
  color: (a, b) => distanciaTono(a, b) * 2,
  tipografia: (a, b) => (claseTipografia(a) !== claseTipografia(b)) * 1.5 + (a !== b) * 0.3,
  portada: (a, b) => (a !== b) * 1, // solo hay tres, y las tres son muy distintas
}

/**
 * Las `n` variantes más distintas de un eje, empezando por `inicial` (lo que
 * el negocio ya tiene), por muestreo del punto más lejano.
 */
export function elegir(eje, n, inicial) {
  const candidatos = EJES[eje].valores()
  const d = DISTANCIAS[eje]
  const elegidas = [inicial && candidatos.includes(inicial) ? inicial : candidatos[0]]
  while (elegidas.length < Math.min(n, candidatos.length)) {
    let mejor = null
    let mejorDist = -1
    for (const c of candidatos) {
      if (elegidas.includes(c)) continue
      const cerca = Math.min(...elegidas.map((e) => d(c, e)))
      if (cerca > mejorDist) [mejor, mejorDist] = [c, cerca]
    }
    elegidas.push(mejor)
  }
  return elegidas
}

/** Lo que el negocio ya tiene en cada eje: de ahí parte la selección. */
export function valorInicial(eje, raw) {
  if (eje === 'preset') return raw.meta?.presetId
  if (eje === 'estilo') return raw.aesthetic
  if (eje === 'tipografia') return raw.meta?.typeId ?? null
  if (eje === 'portada') return raw.sections?.hero
  // el color de marca del negocio, llevado al candidato de tono más parecido
  if (eje === 'color') {
    return [...COLORES_CANDIDATOS].sort(
      (a, b) => distanciaTono(a, raw.palette.primary) - distanciaTono(b, raw.palette.primary),
    )[0]
  }
  return null
}
