// ============================================================
// PLANTILLAS DE CARRUSEL — contenido → diapositivas
//
// Cada plantilla lee un contenido con SENTIDO (puntos, casos, comprobaciones)
// y decide la narrativa: qué diapositivas salen, en qué orden y con qué
// variante. El JSON no habla de diapositivas; así el mismo contenido podrá
// alimentar mañana una plantilla de reel sin reescribirse.
//
// Todas empiezan con `portada` y terminan con `cierre`. Por medio, las
// variantes genéricas de `Diapositiva.jsx`.
// ============================================================

const dos = (n) => String(n).padStart(2, '0')

/** Lo que falta en el JSON, dicho en claro. */
const exigir = (condicion, mensaje) => {
  if (!condicion) throw new Error(`Carrusel: ${mensaje}`)
}

const lista = (valor, campo, plantilla) => {
  exigir(Array.isArray(valor) && valor.length > 0, `la plantilla "${plantilla}" necesita "${campo}" con al menos un elemento`)
  return valor
}

// ------------------------------------------------------------

/**
 * ERRORES — "5 errores al encargar una web".
 * portada → un error por diapositiva (número, qué pasa, mejor así) →
 * [lista de preguntas] → cierre
 */
function errores(c) {
  const puntos = lista(c.puntos, 'puntos', 'errores')
  const diapositivas = puntos.map((p, i) => {
    exigir(p.titulo, `el punto ${i + 1} no tiene "titulo"`)
    return {
      variante: 'punto',
      numero: dos(i + 1),
      antetitulo: p.antetitulo,
      titulo: p.titulo,
      texto: p.texto,
      icono: p.icono,
      resalte: p.mejor ? { etiqueta: p.etiquetaMejor ?? 'Mejor así', texto: p.mejor, icono: 'idea' } : null,
    }
  })
  if (c.preguntas) {
    diapositivas.push({
      variante: 'lista',
      marcador: 'numero',
      antetitulo: c.preguntas.antetitulo,
      titulo: c.preguntas.titulo,
      texto: c.preguntas.texto,
      lista: lista(c.preguntas.lista, 'preguntas.lista', 'errores').map((texto) => ({ texto })),
    })
  }
  return diapositivas
}

/**
 * PREGUNTA — "¿Necesito mantenimiento todos los meses?".
 * portada (la pregunta) → la respuesta corta y de qué depende → un caso por
 * diapositiva (si… → entonces…) → [resumen] → cierre
 */
function pregunta(c) {
  const casos = lista(c.casos, 'casos', 'pregunta')
  exigir(c.respuesta?.titulo, 'la plantilla "pregunta" necesita "respuesta.titulo" (la respuesta corta, p. ej. "Depende.")')
  const diapositivas = [
    {
      variante: 'respuesta',
      antetitulo: c.respuesta.antetitulo ?? 'La respuesta corta',
      titulo: c.respuesta.titulo,
      texto: c.respuesta.texto,
      // Si no se dice otra cosa, la respuesta adelanta los casos que vienen;
      // con `"lista": false`, va sola.
      lista:
        c.respuesta.lista === false
          ? []
          : (c.respuesta.lista ?? casos.map((k) => ({ texto: k.resumen ?? k.si, icono: k.icono }))).map((l) =>
              typeof l === 'string' ? { texto: l } : l,
            ),
    },
  ]
  casos.forEach((k, i) => {
    exigir(k.si && k.entonces, `el caso ${i + 1} necesita "si" y "entonces"`)
    diapositivas.push({
      variante: 'caso',
      antetitulo: k.antetitulo ?? (casos.length > 1 ? `Caso ${i + 1} de ${casos.length}` : 'El caso'),
      titulo: k.si,
      consecuencia: k.entonces,
      texto: k.texto,
      icono: k.icono,
    })
  })
  if (c.resumen) {
    diapositivas.push({
      variante: 'lista',
      marcador: c.resumen.marcador ?? 'numero',
      antetitulo: c.resumen.antetitulo ?? 'En resumen',
      titulo: c.resumen.titulo,
      texto: c.resumen.texto,
      lista: lista(c.resumen.lista, 'resumen.lista', 'pregunta').map((texto) => ({ texto })),
    })
  }
  return diapositivas
}

/**
 * CHECKLIST — "Antes de contratar una web, comprueba estas 7 cosas".
 * portada → una comprobación por diapositiva, con el avance de la lista en
 * casillas y la pregunta que hay que hacer → la lista entera, para guardarla
 * y marcarla → cierre
 */
function checklist(c) {
  const items = lista(c.items, 'items', 'checklist')
  const diapositivas = items.map((it, i) => {
    exigir(it.titulo, `la comprobación ${i + 1} no tiene "titulo"`)
    return {
      variante: 'item',
      antetitulo: it.antetitulo ?? `${i + 1} de ${items.length}`,
      titulo: it.titulo,
      texto: it.texto,
      icono: it.icono,
      progreso: { actual: i, cuantos: items.length },
      resalte: it.pregunta ? { etiqueta: 'Pregunta', texto: it.pregunta, icono: 'conversacion' } : null,
    }
  })
  if (c.resumen !== false) {
    const r = c.resumen ?? {}
    diapositivas.push({
      variante: 'lista',
      marcador: 'casilla',
      antetitulo: r.antetitulo ?? 'Tu lista',
      titulo: r.titulo ?? 'Guárdala y márcala *antes de firmar*.',
      texto: r.texto,
      lista: items.map((it) => ({ texto: it.corto ?? it.titulo, estado: 'pendiente' })),
    })
  }
  return diapositivas
}

export const PLANTILLAS = { errores, pregunta, checklist }

// ------------------------------------------------------------

const CIERRE = {
  titulo: '¿Te ha servido?',
  cta: 'Guárdalo para más adelante.',
}

/**
 * El carrusel entero: portada + lo que decida la plantilla + cierre.
 * Devuelve las diapositivas listas para `Diapositiva.jsx`.
 */
export function resolverCarrusel(contenido) {
  exigir(contenido && typeof contenido === 'object', 'el contenido está vacío')
  const plantilla = PLANTILLAS[contenido.plantilla]
  exigir(
    plantilla,
    `plantilla desconocida "${contenido.plantilla}". Hay: ${Object.keys(PLANTILLAS).join(', ')}`,
  )
  exigir(contenido.portada?.titulo, 'falta "portada.titulo"')
  const cierre = { ...CIERRE, ...contenido.cierre }
  return [
    { variante: 'portada', ...contenido.portada },
    ...plantilla(contenido),
    { variante: 'cierre', ...cierre },
  ]
}
