import { SECTION_ORDER } from '../config/schema'

// ============================================================
// EL MENÚ BAJA A SU SECCIÓN
//
// Esto es una landing de una sola página: el menú no lleva a otras páginas,
// lleva más abajo. Cada enlace se empareja con una sección por lo que DICE
// ("Precios" → la sección de precios), sin acentos ni mayúsculas de por medio.
// Lo que no encaja con ninguna palabra clave se reparte por orden de aparición
// entre las secciones que queden libres: ningún enlace del menú acaba siendo un
// clic que no hace nada.
//
// Los enlaces los escribe el cliente a mano en "Contenido", así que esto tiene
// que aguantar cualquier texto. No hay un desplegable donde elegir destino, ni
// falta: el emparejamiento se rehace solo al cambiar el texto o las secciones.
// ============================================================

/** Se prueban en orden; gana la primera. Sin acentos: el texto llega plano. */
const LINK_HINTS = [
  [/inicio|home|portada|principal|volver arriba/, 'hero'],
  [/precio|tarifa|plan|cuota|coste|paquete/, 'pricing'],
  [/pregunt|frecuent|faq|duda/, 'faq'],
  [/opinion|testimoni|resena|review|clientes|casos|experiencia/, 'testimonial'],
  [/galeria|trabajo|proyecto|portfolio|obra|catalogo|carta|menu|carrusel/, 'carousel'],
  [/servicio|producto|caracteristica|feature|solucion|ventaja|funciona|hacemos|tratamiento/, 'features'],
  // Antes que contacto: "Visítanos" y "Cómo llegar" son la dirección, no el
  // formulario. "Primera visita" (una cita) no entra: se exige "visitanos".
  [/donde|ubicacion|llegar|direccion|horario|mapa|encuentranos|visitanos/, 'location'],
  [/contact|cita|reserva|presupuest|escrib|llam|hablar|empez|prueba|demo|visita/, 'cta'],
  [/marca|logo|partner|colabora|confian/, 'logos'],
]

/** Quita acentos y mayúsculas: "Atención al Cliente" -> "atencion al cliente". */
const plain = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const hintedSection = (label) => {
  const text = plain(label)
  for (const [re, type] of LINK_HINTS) if (re.test(text)) return type
  return null
}

/**
 * Devuelve el destino de cada enlace del menú, en su mismo orden.
 * Primero por palabra clave; lo que sobra, por orden de aparición en la página.
 */
export function navTargets(links, order) {
  const sections = order?.length ? order : SECTION_ORDER
  // Ni la portada ni la franja de logos se reparten solas: a la portada se
  // llega si un enlace lo pide por su nombre ("Inicio"), y la franja de logos
  // es un adorno de dos centímetros de alto — aterrizar ahí parece un fallo.
  // Ambas siguen siendo destino válido si el texto del enlace las nombra.
  const pool = sections.filter((t) => t !== 'hero' && t !== 'logos')
  const taken = new Set()

  const byHint = (links || []).map((label) => {
    const type = hintedSection(label)
    if (type === 'hero') return sections.includes('hero') ? 'hero' : null
    if (!type || !sections.includes(type) || taken.has(type)) return null
    taken.add(type)
    return type
  })

  let i = 0
  return byHint.map((type) => {
    if (type) return type
    while (i < pool.length && taken.has(pool[i])) i += 1
    // Sin secciones libres, al pie: es donde acaban los datos de contacto.
    if (i >= pool.length) return 'db-footer'
    taken.add(pool[i])
    return pool[i]
  })
}

/**
 * Destino de un enlace del pie. A diferencia del menú, aquí no hay reparto:
 * varios enlaces pueden ir al mismo sitio ("Dónde estamos" y "Horarios" bajan
 * los dos a la dirección), y lo que no nombra ninguna sección visible va al
 * contacto —donde se actúa— o, sin él, a la portada. Nunca un `href="#"`.
 */
export function footerTarget(label, order) {
  const sections = order?.length ? order : SECTION_ORDER
  const type = hintedSection(label)
  if (type && sections.includes(type)) return type
  return sections.includes('cta') ? 'cta' : 'hero'
}
