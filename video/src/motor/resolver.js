import { NEGOCIOS } from '../../datos/negocios.mjs'
import { setIn } from '../../../src/config/patch'
import { alLienzo, partida } from './web'
import { EJES, ORDEN_EJES } from './ejes'
import { elegir, valorInicial } from './elegir'
import { PLANTILLAS, enLetra } from './plantillas'

// ============================================================
// DE UN REEL EN DATOS A SU LÍNEA DE ESTADOS
//
// Entrada (un JSON de video/reels/):
//
//   {
//     "plantilla": "color",            // ver motor/plantillas.js
//     "negocio": "dental",             // ver video/datos/negocios.mjs
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

// Lo que duran los movimientos de las plantillas que los tienen.
const MOVIMIENTOS = { titular: 100, recorrido: 190 }
// Ritmo de las plantillas sin ejes (recorrido: un solo paso).
const RITMO_SIN_EJES = 30


/** Los ajustes de base (rutas del contrato → valor) sobre un config. */
const conBase = (raw, base = {}) => Object.entries(base).reduce((r, [ruta, valor]) => setIn(r, ruta, valor), raw)

/** Las variantes del reel: las del JSON, o elegidas automáticamente. */
function variantesDe(reel, plantilla, raw) {
  if (Array.isArray(reel.variantes)) return reel.variantes
  if (!plantilla.ejes.length) return [{}] // sin ejes: una sola variante, la del negocio
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
  const ritmo = plantilla.ejes.length ? Math.max(...plantilla.ejes.map((e) => EJES[e].ritmo)) : RITMO_SIN_EJES
  const transicion =
    plantilla.ejes.length && plantilla.ejes.every((e) => EJES[e].transicion === 'morph') ? 'morph' : 'barrido'

  // El movimiento (teclear el titular, bajar por la web) pasa con la primera
  // variante en pantalla; los cambios de los ejes empiezan cuando acaba.
  const duracionMovimiento = MOVIMIENTOS[plantilla.movimiento] ?? 0
  const movimiento = plantilla.movimiento
    ? {
        tipo: plantilla.movimiento,
        desde: TIEMPOS.entrada,
        hasta: TIEMPOS.entrada + duracionMovimiento,
        texto: contenido.hero.title,
      }
    : null
  const inicio = TIEMPOS.entrada + duracionMovimiento

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
      frame: i === 0 ? 0 : inicio + i * ritmo,
      config: alLienzo(raw),
      transicion,
      // sin ejes (recorrido), el nombre que se lee es el del negocio
      titulo: etiquetas.map((e) => e.titulo).join(' · ') || contenido.brand.name,
      valor: etiquetas.find((e) => e.valor)?.valor ?? null,
      muestras: etiquetas.flatMap((e) => e.muestras ?? []),
    }
  })

  const demo = inicio + variantes.length * ritmo + TIEMPOS.cola
  return {
    gancho: reel.gancho ?? plantilla.gancho({ n: enLetra(variantes.length), quien: negocio.quien }),
    pregunta: reel.pregunta ?? plantilla.pregunta,
    nombreEje: plantilla.etiqueta ?? plantilla.ejes.map((e) => EJES[e].nombre).join(' + '),
    contenido,
    movimiento,
    pasos,
    demo,
    duracion: TIEMPOS.gancho + demo + TIEMPOS.cierre - 2 * TIEMPOS.cruce,
  }
}
