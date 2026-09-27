// ============================================================
// QUÉ ES UNA IDEA y lo que se deduce de ella
//
// Puro (sin Node ni React): lo usan `pnpm crear` y Remotion (src/Root.jsx).
//
// Una idea de contenido/ideas.json:
//   id        IR-01 (reel) · IC-01 (carrusel)
//   formato   reel | carrusel
//   gancho    la frase de portada; *así* va en el acento
//   pilar, serie, tema, visual, cta, pie, dolor, pieTikTok, bloqueo, concepto   (opcionales)
//   video     solo reels: otra composición en lugar del motor ("IntroMaketa");
//             entonces `reel` solo da la web de su portada, y el pie va escrito
//   dolor     la primera línea del pie (si no, la de la plantilla del reel)
//   pastilla  solo reels: texto propio para la pastilla de su portada
//   reel      { plantilla, negocio, cantidad | variantes }   (src/motor/resolver.js)
//   carrusel  { plantilla, portada, <lista>, resumen, cierre } (src/carrusel/plantillas.js)
// ============================================================

const ID = { reel: /^IR-\d{2,}$/, carrusel: /^IC-\d{2,}$/ }

// Las listas que puede traer un carrusel, sea cual sea su plantilla.
const LISTAS = ['puntos', 'items', 'casos', 'criterios', 'mitos', 'partes', 'opciones', 'factores', 'pares', 'pasos']

/** Los problemas de una idea, dichos en claro (vacío si está bien). */
export function problemasDe(p, sistema) {
  const fallos = []
  if (!ID[p.formato]) fallos.push(`formato "${p.formato}" (hay: reel, carrusel)`)
  else if (!ID[p.formato].test(p.id ?? '')) fallos.push(`el id de un ${p.formato} tiene la forma ${p.formato === 'reel' ? 'IR-01' : 'IC-01'}`)
  if (!ganchoDe(p)) fallos.push('falta el gancho')
  if (p.pilar && !sistema.PILARES[p.pilar]) fallos.push(`pilar "${p.pilar}" (hay: ${Object.keys(sistema.PILARES).join(', ')})`)
  if (p.serie && !sistema.SERIES[p.serie]) fallos.push(`serie "${p.serie}" (hay: ${Object.keys(sistema.SERIES).join(', ')})`)
  if (p.visual?.tema && !sistema.TEMAS.includes(p.visual.tema)) fallos.push(`visual.tema "${p.visual.tema}" (hay: ${sistema.TEMAS.join(', ')})`)
  if (p.visual?.layout && !sistema.LAYOUTS.includes(p.visual.layout)) fallos.push(`visual.layout "${p.visual.layout}" (hay: A, B, C)`)
  if (p.visual?.portada && (p.formato !== 'reel' || !sistema.PORTADAS_REEL.includes(p.visual.portada))) {
    fallos.push(`visual.portada es solo para reels (hay: ${sistema.PORTADAS_REEL.join(', ')})`)
  }
  if (p.formato === 'reel' && !(p.reel?.plantilla && p.reel?.negocio)) fallos.push('un reel necesita "reel.plantilla" y "reel.negocio"')
  if (p.formato === 'carrusel' && !p.carrusel?.plantilla) fallos.push('un carrusel necesita "carrusel.plantilla"')
  if ((p.video || p.pastilla) && p.formato !== 'reel') fallos.push('"video" y "pastilla" son solo para reels')
  if (p.video && !p.pie) fallos.push('un reel con "video" propio necesita su "pie" escrito')
  return fallos
}

/** Todas las ideas, comprobadas: un error que las lista todas si alguna falla. */
export function validarTodas(ideas, sistema) {
  const fallos = ideas.flatMap((p) => problemasDe(p, sistema).map((m) => `  · ${p.id ?? '?'}: ${m}`))
  const vistos = new Set()
  for (const p of ideas) {
    if (vistos.has(p.id)) fallos.push(`  · ${p.id}: id repetido`)
    vistos.add(p.id)
  }
  if (fallos.length) throw new Error(`hay ideas mal escritas en contenido/ideas.json:\n${fallos.join('\n')}`)
  return ideas
}

/** La frase de portada. */
export const ganchoDe = (p) => p.gancho ?? p.reel?.gancho ?? p.carrusel?.portada?.titulo ?? null

/** La CTA: la de la idea o la de su pilar. */
export const ctaDe = (p, sistema) => p.cta ?? sistema.PILARES[p.pilar]?.cta ?? 'Guárdalo para más adelante.'

/** El número que cuenta la pieza ("5 errores", "6 estilos"): el del layout C. */
export function cuantosDe(p) {
  if (p.formato === 'carrusel') return LISTAS.map((k) => p.carrusel?.[k]).find(Array.isArray)?.length ?? null
  const r = p.reel ?? {}
  if (Array.isArray(r.variantes)) return r.variantes.length
  if (r.plantilla === 'recorrido') return null
  return r.cantidad ?? 5
}

/**
 * ¿Se puede crear ya? Un reel, siempre; un carrusel, cuando tiene escritas
 * sus diapositivas (la lista de su plantilla).
 */
export const listaParaCrear = (p) => p.formato === 'reel' || cuantosDe(p) != null

/** La serie y su número ("Errores web", 3), por el orden de ideas.json. */
export function serieDe(p, ideas, sistema) {
  if (!p.serie) return null
  const misma = ideas.filter((q) => q.serie === p.serie).map((q) => q.id)
  return { nombre: sistema.SERIES[p.serie].nombre, numero: misma.indexOf(p.id) + 1 }
}

/**
 * Tema y layout: los de la idea; si no los trae, oscuro y el layout de su
 * serie (o A). El C necesita un número: sin él, A.
 */
export function visualDe(p, sistema) {
  const layout = p.visual?.layout ?? sistema.SERIES[p.serie]?.layout ?? 'A'
  const visual = { tema: p.visual?.tema ?? 'dark', layout: layout === 'C' && cuantosDe(p) == null ? 'A' : layout }
  // En los reels, además, la variante de portada.
  return p.formato === 'reel' ? { ...visual, portada: p.visual?.portada ?? 'pila' } : visual
}
