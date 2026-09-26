import { NEGOCIOS } from '../../../scripts/social/lib/negocios.mjs'
import { setIn } from '../../../src/config/patch'
import { alLienzo, partida } from '../plantilla/web'
import { EJES, ORDEN_EJES } from './ejes'
import { elegir, valorInicial } from './elegir'
import { PLANTILLAS } from './plantillas'

// ============================================================
// DE UN REEL EN DATOS A SU LÍNEA DE ESTADOS
//
// Entrada (un JSON de video/reels/):
//
//   {
//     "plantilla": "color",            // ver motor/plantillas.js
//     "negocio": "dental",             // ver scripts/social/lib/negocios.mjs
//     "variantes": "auto",             // o una lista: [{ "color": "#1d4ed8" }, …]
//     "cantidad": 5,                   // con "auto"; por defecto 5
//     "gancho": "…",                   // opcional: si no, lo genera la plantilla
//     "base": { "ruta.del.config": v } // opcional: ajustes antes de las variantes
//     "pregunta": "…"                  // opcional: la línea del cierre
//   }
//
// Salida: todo lo que la composición necesita, ya calculado, y la duración.
// ============================================================

// Tiempos de la composición, en fotogramas (30 por segundo).
export const TIEMPOS = {
  gancho: 66, // escena 1
  entrada: 18, // la tarjeta entra antes del primer cambio
  cola: 14, // la última variante se queda un poco más
  cierre: 80, // escena 3
  cruce: 15, // cada transición entre escenas
}

const EN_LETRA = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']
const enLetra = (n) => EN_LETRA[n] ?? String(n)

/** Los ajustes de base (rutas del contrato → valor) sobre un config. */
const conBase = (raw, base = {}) => Object.entries(base).reduce((r, [ruta, valor]) => setIn(r, ruta, valor), raw)

/** Las variantes del reel: las del JSON, o elegidas automáticamente. */
function variantesDe(reel, plantilla, raw) {
  if (Array.isArray(reel.variantes)) return reel.variantes
  const n = reel.cantidad ?? 5
  // Cada eje elige sus N valores más distintos y se emparejan en orden.
  const porEje = Object.fromEntries(plantilla.ejes.map((eje) => [eje, elegir(eje, n, valorInicial(eje, raw))]))
  return Array.from({ length: n }, (_, i) => Object.fromEntries(plantilla.ejes.map((eje) => [eje, porEje[eje][i]])))
}

export function resolverReel(reel) {
  const plantilla = PLANTILLAS[reel.plantilla]
  if (!plantilla) {
    throw new Error(`plantilla desconocida: "${reel.plantilla}". Disponibles: ${Object.keys(PLANTILLAS).join(', ')}`)
  }
  const negocio = NEGOCIOS[reel.negocio]
  if (!negocio) throw new Error(`negocio desconocido: "${reel.negocio}"`)

  const { raw: inicial, contenido } = partida(reel.negocio)
  const ajustes = { ...plantilla.base, ...reel.base }
  const base = conBase(inicial, ajustes)
  const variantes = variantesDe(reel, plantilla, base)

  // El ritmo lo marca el eje más lento de la plantilla; la transición es un
  // morph solo si todos los ejes se pueden interpolar.
  const ritmo = Math.max(...plantilla.ejes.map((e) => EJES[e].ritmo))
  const transicion = plantilla.ejes.every((e) => EJES[e].transicion === 'morph') ? 'morph' : 'barrido'

  const pasos = variantes.map((variante, i) => {
    let raw = base
    const etiquetas = []
    for (const eje of ORDEN_EJES) {
      if (variante[eje] == null) continue
      raw = EJES[eje].aplicar(raw, variante[eje])
      // Un preset trae su config entera: los ajustes de base se reaplican.
      if (eje === 'preset') raw = conBase(raw, ajustes)
      etiquetas.push({ eje, ...EJES[eje].etiqueta(variante[eje]) })
    }
    return {
      frame: i === 0 ? 0 : TIEMPOS.entrada + i * ritmo,
      config: alLienzo(raw),
      transicion,
      titulo: etiquetas.map((e) => e.titulo).join(' · '),
      valor: etiquetas.find((e) => e.valor)?.valor ?? null,
      muestras: etiquetas.flatMap((e) => e.muestras ?? []),
    }
  })

  const demo = TIEMPOS.entrada + variantes.length * ritmo + TIEMPOS.cola
  return {
    gancho: reel.gancho ?? plantilla.gancho({ n: enLetra(variantes.length), quien: negocio.quien }),
    pregunta: reel.pregunta ?? plantilla.pregunta,
    nombreEje: plantilla.ejes.map((e) => EJES[e].nombre).join(' + '),
    contenido,
    pasos,
    demo,
    duracion: TIEMPOS.gancho + demo + TIEMPOS.cierre - 2 * TIEMPOS.cruce,
  }
}
