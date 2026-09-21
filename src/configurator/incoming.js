import { normalizeConfigWithGuardrails } from '../config/guardrails'
import { encodeConfig, decodeConfig } from '../config/encode'
import { listProjects, readProject, createProject, setActiveId, freeName } from './projects'

// ============================================================
// LA REGLA DEL ENLACE ENTRANTE
//
// La URL del configurador lleva el diseño en `?c=`, así que se llega aquí de
// dos maneras que por fuera son idénticas: el enlace que te manda alguien, y
// el marcador de tu propia sesión de ayer. Con trabajo guardado en el
// navegador, hace falta una regla, y solo hay una aceptable:
//
//   UN ENLACE NUNCA PISA LO QUE YA HAY GUARDADO.
//
// Si el diseño del enlace ya es uno de los guardados, se abre ese. Si no lo
// es, entra como uno propio y nuevo. En ningún caso se sobrescribe ni se
// descarta nada de lo que el usuario tenía.
// ============================================================

const SHARED_NAME = 'Diseño recibido'

/**
 * Huella de un diseño: dos configuraciones con la misma huella son la misma
 * web. Se normaliza antes de comparar porque la URL lleva la versión ya pasada
 * por los guardarraíles y lo guardado es la cruda.
 */
export function fingerprint(config) {
  try {
    return encodeConfig(normalizeConfigWithGuardrails(config).config)
  } catch {
    return null
  }
}

/**
 * Resuelve con qué trabajo guardado arrancar.
 *
 * @param {string|null} param  el `?c=` de la URL, tal cual
 * @param {string} activeId    lo que se abriría sin enlace de por medio
 * @returns {string} id del trabajo que hay que abrir
 */
export function openIncomingDesign(param, activeId) {
  if (!param) return activeId
  const incoming = decodeConfig(param)
  if (!incoming) return activeId

  // Sin huella, el diseño no es normalizable (un `?c=` roto o de otra versión
  // del contrato): no se puede comparar ni pintaría bien, así que se ignora en
  // vez de guardar basura como un trabajo más.
  const target = fingerprint(incoming)
  if (!target) return activeId

  const match = listProjects().find((p) => fingerprint(readProject(p.id).config) === target)
  const id = match
    ? match.id
    : // El enlace lleva diseño, no textos: los del trabajo activo le sirven.
      createProject(freeName(SHARED_NAME), {
        config: incoming,
        content: readProject(activeId).content,
      })
  setActiveId(id)
  return id
}
