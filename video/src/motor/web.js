import { PRESETS } from '../../../src/registry/presets'
import { getIn, setIn } from '../../../src/config/patch'
import { normalizeConfigWithGuardrails } from '../../../src/config/guardrails'
import { DEFAULT_CONTENT } from '../../../src/content/defaults'
import { contenidoDeSector, mezclarContenido } from '../../../src/content/sectores'
import { NEGOCIOS } from '../../datos/negocios.mjs'
import { SECCIONES } from '../../datos/secciones.mjs'

// ============================================================
// LA WEB DE UN NEGOCIO: el punto de partida de cada reel
//
// El preset del negocio, su portada y su contenido en tres capas (sector del
// preset → secciones propias → marca y portada del negocio). Los cambios de
// cada variante los aplica después motor/ejes.js; todo config pasa por los
// guardarraíles antes de pintarse, como en el configurador.
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
