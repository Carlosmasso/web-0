import { PRESETS } from '../../../src/registry/presets'
import { getAesthetic } from '../../../src/registry/aesthetics'
import { getTypePairing } from '../../../src/registry/fonts'
import { SECTION_META } from '../../../src/registry/options'
import { deepMerge, getIn, setIn } from '../../../src/config/patch'
import { normalizeConfigWithGuardrails } from '../../../src/config/guardrails'
import { safePalette } from '../../../src/theme/color'
import { DEFAULT_CONTENT } from '../../../src/content/defaults'
import { contenidoDeSector, mezclarContenido } from '../../../src/content/sectores'
import { NEGOCIOS } from '../../../scripts/social/lib/negocios.mjs'
import { SECCIONES } from '../../../scripts/social/lib/secciones.mjs'

// ============================================================
// LA WEB DE UN NEGOCIO, CAMBIO A CAMBIO
//
// Traduce los `cambios` de un reel (ver scripts/social/lib/formatos.mjs) en
// los configs que pinta el escenario. Cada cambio se aplica con el MISMO
// parche que el configurador y pasa por los guardarraíles: el vídeo enseña
// exactamente lo que vería quien pulsara ese botón.
// ============================================================

export const alLienzo = (raw) =>
  // El movimiento propio del sitio va por reloj y no por fotograma: se apaga.
  normalizeConfigWithGuardrails({ ...raw, motion: 'none' }).config

/** Punto de partida: el preset del negocio, su portada y su contenido. */
export function partida(clave) {
  const negocio = NEGOCIOS[clave]
  if (!negocio) throw new Error(`negocio desconocido: ${clave}`)
  const preset = PRESETS.find((p) => p.label.includes(negocio.preset))
  if (!preset) throw new Error(`preset no encontrado: ${negocio.preset}`)

  const raw = structuredClone(preset.config)
  if (negocio.portada) raw.sections.hero = negocio.portada === 'imagen' ? 'image' : 'centered'

  // Tres capas: el contenido del sector del preset; encima, las secciones
  // propias del negocio cuando el sector no le casa (secciones.mjs); y encima
  // de todo, su marca y su portada (negocios.mjs).
  const sector = contenidoDeSector(preset.id)
  let contenido = sector ? mezclarContenido(DEFAULT_CONTENT, sector) : DEFAULT_CONTENT
  if (SECCIONES[clave]) contenido = mezclarContenido(contenido, SECCIONES[clave])
  for (const [ruta, valor] of Object.entries(negocio.contenido)) {
    const esLista = Array.isArray(getIn(DEFAULT_CONTENT, ruta)) // "uno por línea" en el formulario
    contenido = setIn(contenido, ruta, esLista ? valor.split('\n').filter(Boolean) : valor)
  }
  return { raw, contenido }
}

function aplicar(raw, cambio) {
  if (cambio.estetica) {
    const { id, patch } = getAesthetic(cambio.estetica)
    return deepMerge(raw, { aesthetic: id, ...patch, meta: { aestheticId: id } })
  }
  if (cambio.color) {
    const scheme = raw.meta?.mode === 'dark' ? 'dark' : 'light'
    return deepMerge(raw, { palette: safePalette(cambio.color, { scheme }), meta: { mode: scheme } })
  }
  if (cambio.tipografia) {
    return deepMerge(raw, { typography: getTypePairing(cambio.tipografia).values, meta: { typeId: cambio.tipografia } })
  }
  if (cambio.portada) return setIn(raw, 'sections.hero', cambio.portada)
  return raw
}

/**
 * @returns {{
 *   contenido: object,
 *   estados: { frame: number, config: object }[],   // un config por cambio
 *   titular: { desde, hasta, texto } | null,          // tecleo del titular
 *   scroll: { desde, hasta } | null,                  // recorrido de la web
 * }}
 */
export function webDelReel(clave, cambios = []) {
  const { raw: inicial, contenido } = partida(clave)
  const estados = [{ frame: 0, config: alLienzo(inicial) }]
  let raw = inicial
  const puntuales = cambios.filter((c) => c.frame != null).sort((a, b) => a.frame - b.frame)
  for (const cambio of puntuales) {
    raw = aplicar(raw, cambio)
    estados.push({ frame: cambio.frame, config: alLienzo(raw) })
  }

  const tecleo = cambios.find((c) => c.titular)
  const recorrido = cambios.find((c) => c.scroll)
  return {
    contenido,
    estados,
    titular: tecleo ? { desde: tecleo.desde, hasta: tecleo.hasta, texto: contenido.hero.title } : null,
    scroll: recorrido ? { desde: recorrido.desde, hasta: recorrido.hasta } : null,
  }
}

// ------------------------------------------------------------
// LA ETIQUETA: qué se está cambiando, con las palabras del configurador.

export const tipoDe = (c) =>
  ['estetica', 'color', 'tipografia', 'portada', 'titular', 'scroll'].find((t) => c[t] != null)

const NOMBRE = {
  estetica: 'Estilo',
  color: 'Color principal',
  tipografia: 'Tipografía',
  portada: 'Portada',
  titular: 'Tu titular',
  scroll: 'Tu web entera',
}

/** { tipo, etiqueta, valor, color } de un cambio, para la pastilla. */
export function etiquetaDe(c) {
  const tipo = tipoDe(c)
  let valor = ''
  if (tipo === 'estetica') valor = getAesthetic(c.estetica).label
  if (tipo === 'color') valor = c.color.toUpperCase()
  if (tipo === 'tipografia') valor = getTypePairing(c.tipografia).name.split(' + ')[0]
  if (tipo === 'portada') valor = SECTION_META.hero.variants.find((v) => v.id === c.portada)?.label ?? c.portada
  if (tipo === 'titular') valor = 'en vivo'
  return { tipo, etiqueta: NOMBRE[tipo], valor, color: c.color ?? null }
}

/**
 * Agrupa los cambios seguidos del mismo tipo: cada grupo es una pastilla que
 * se queda mientras duran sus cambios y va actualizando el valor.
 */
export function gruposDe(cambios) {
  const ordenados = [...cambios].sort((a, b) => (a.frame ?? a.desde) - (b.frame ?? b.desde))
  const grupos = []
  for (const c of ordenados) {
    const inicio = c.frame ?? c.desde
    const ultimo = grupos.at(-1)
    if (ultimo && ultimo.tipo === tipoDe(c)) ultimo.pasos.push({ frame: inicio, ...etiquetaDe(c) })
    else grupos.push({ tipo: tipoDe(c), desde: inicio, pasos: [{ frame: inicio, ...etiquetaDe(c) }] })
  }
  grupos.forEach((g, i) => (g.hasta = grupos[i + 1]?.desde ?? null))
  return grupos
}
