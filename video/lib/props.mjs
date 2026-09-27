// ============================================================
// DE UNA IDEA A LAS PROPS DE SU COMPOSICIÓN
//
// El puente entre el contenido (contenido/ideas.json) y la presentación
// (src/). Puro, para que el studio y `pnpm crear` rendericen lo mismo.
// ============================================================

import { ctaDe, cuantosDe, ganchoDe, listaParaCrear, serieDe, visualDe } from './modelo.mjs'

/** Las props del motor de reels (src/motor/Reel.jsx). */
export function propsReel(p, sistema) {
  return {
    ...p.reel,
    ...(p.gancho ? { gancho: p.gancho } : {}),
    // La pregunta del cierre: la CTA de la idea si la trae; si no, la de la plantilla.
    ...(p.cta ? { pregunta: p.cta } : {}),
    visual: visualDe(p, sistema),
  }
}

/** Las props del carrusel (src/carrusel/Carrusel.jsx). */
export function propsCarrusel(p, ideas, sistema) {
  const c = p.carrusel
  return {
    carrusel: {
      ...c,
      portada: { ...c.portada, titulo: c.portada?.titulo ?? p.gancho },
      cierre: { ...c.cierre, cta: c.cierre?.cta ?? ctaDe(p, sistema) },
    },
    visual: visualDe(p, sistema),
    serie: serieDe(p, ideas, sistema),
  }
}

export const propsDe = (p, ideas, sistema) => (p.formato === 'reel' ? propsReel(p, sistema) : propsCarrusel(p, ideas, sistema))

/** Lo que necesita su portada (src/portadas/PortadaPieza.jsx). */
export function propsPortada(p, ideas, sistema) {
  return {
    id: p.id,
    formato: p.formato,
    props: propsDe(p, ideas, sistema),
    visual: visualDe(p, sistema),
    serie: serieDe(p, ideas, sistema),
    gancho: ganchoDe(p),
    numero: cuantosDe(p),
    pilar: sistema.PILARES[p.pilar]?.nombre ?? null,
  }
}

/**
 * Las celdas del borrador del feed (src/feed/Feed.jsx). `ids` en el orden en
 * que se publicarán (el primero, el más antiguo); el feed los pinta como el
 * perfil, lo más reciente arriba a la izquierda.
 */
export function celdasFeed(ids, ideas, sistema) {
  const porId = new Map(ideas.map((p) => [p.id, p]))
  return ids
    .map((id, i) => {
      const p = porId.get(id)
      if (!p) throw new Error(`no existe la idea ${id}`)
      if (!listaParaCrear(p)) throw new Error(`${id} no tiene aún las diapositivas escritas`)
      return { id, orden: i + 1, formato: p.formato, portada: propsPortada(p, ideas, sistema) }
    })
    .reverse()
}
