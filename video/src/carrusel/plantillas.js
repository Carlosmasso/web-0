// ============================================================
// PLANTILLAS DE CARRUSEL — contenido → diapositivas
//
// Cada plantilla lee un contenido con SENTIDO (puntos, casos, comprobaciones)
// y decide la narrativa: qué diapositivas salen, en qué orden y con qué
// variante. El JSON no habla de diapositivas; así el mismo contenido podrá
// alimentar mañana una plantilla de reel sin reescribirse.
//
// Todas las diapositivas salen con los mismos huecos llenos (icono,
// antetítulo, titular y, si hay, texto), porque todas comparten esqueleto
// (`Diapositiva.jsx`). Lo que el JSON no diga lo pone la plantilla.
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
 * portada → un error por diapositiva (qué pasa y, abajo, "mejor así") →
 * [preguntas] → cierre
 */
function errores(c) {
  const puntos = lista(c.puntos, 'puntos', 'errores')
  const diapositivas = puntos.map((p, i) => {
    exigir(p.titulo, `el punto ${i + 1} no tiene "titulo"`)
    return {
      variante: 'punto',
      icono: p.icono ?? 'aviso',
      antetitulo: p.antetitulo ?? `Error ${dos(i + 1)}`,
      titulo: p.titulo,
      texto: p.texto,
      resalte: p.mejor ? { etiqueta: 'Mejor así', texto: p.mejor, icono: 'idea' } : null,
    }
  })
  if (c.preguntas) {
    diapositivas.push({
      variante: 'lista',
      marcador: 'numero',
      icono: c.preguntas.icono ?? 'conversacion',
      antetitulo: c.preguntas.antetitulo ?? 'Antes de empezar',
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
 * diapositiva ("Si…" y, abajo, "entonces") → [resumen] → cierre
 */
function pregunta(c) {
  const casos = lista(c.casos, 'casos', 'pregunta')
  exigir(c.respuesta?.titulo, 'la plantilla "pregunta" necesita "respuesta.titulo" (la respuesta corta, p. ej. "Depende.")')
  const diapositivas = [
    {
      variante: 'respuesta',
      icono: c.respuesta.icono ?? 'conversacion',
      antetitulo: c.respuesta.antetitulo ?? 'La respuesta corta',
      titulo: c.respuesta.titulo,
      texto: c.respuesta.texto,
      // Si no se dice otra cosa, la respuesta adelanta los casos que vienen;
      // con `"lista": false`, va sola.
      lista:
        c.respuesta.lista === false
          ? []
          : (c.respuesta.lista ?? casos.map((k) => ({ texto: k.resumen ?? k.si, icono: k.icono ?? 'pregunta' }))).map((l) =>
              typeof l === 'string' ? { texto: l } : l,
            ),
    },
  ]
  casos.forEach((k, i) => {
    exigir(k.si && k.entonces, `el caso ${i + 1} necesita "si" y "entonces"`)
    diapositivas.push({
      variante: 'caso',
      icono: k.icono ?? 'pregunta',
      antetitulo: k.antetitulo ?? (casos.length > 1 ? `Caso ${i + 1} de ${casos.length}` : 'El caso'),
      titulo: k.si,
      resalte: { etiqueta: 'Entonces', texto: k.entonces, nota: k.texto, icono: 'flecha' },
    })
  })
  if (c.resumen) {
    diapositivas.push({
      variante: 'lista',
      marcador: 'numero',
      icono: c.resumen.icono ?? 'lista',
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
 * portada → una comprobación por diapositiva (el icono con la marca de
 * comprobado y, abajo, la pregunta que hay que hacer) → la lista entera en
 * casillas, para guardarla y marcarla → cierre
 */
function checklist(c) {
  const items = lista(c.items, 'items', 'checklist')
  const diapositivas = items.map((it, i) => {
    exigir(it.titulo, `la comprobación ${i + 1} no tiene "titulo"`)
    return {
      variante: 'item',
      icono: it.icono ?? 'check',
      antetitulo: it.antetitulo ?? `Comprobación ${i + 1} de ${items.length}`,
      titulo: it.titulo,
      texto: it.texto,
      resalte: it.pregunta ? { etiqueta: 'Pregunta', texto: it.pregunta, icono: 'conversacion', tono: 'acento' } : null,
    }
  })
  if (c.resumen !== false) {
    const r = c.resumen ?? {}
    diapositivas.push({
      variante: 'lista',
      marcador: 'casilla',
      icono: r.icono ?? 'lista',
      antetitulo: r.antetitulo ?? 'Tu lista',
      titulo: r.titulo ?? 'Guárdala y márcala *antes de firmar*.',
      texto: r.texto,
      lista: items.map((it) => ({ texto: it.corto ?? it.titulo, estado: 'pendiente' })),
    })
  }
  return diapositivas
}

/** Una lista final opcional (resumen, lo que hay que recordar). */
function resumenDe(r, plantilla, marcador = 'numero') {
  if (!r) return []
  return [
    {
      variante: 'lista',
      marcador,
      icono: r.icono ?? 'lista',
      antetitulo: r.antetitulo ?? 'En resumen',
      titulo: r.titulo,
      texto: r.texto,
      lista: lista(r.lista, 'resumen.lista', plantilla).map((texto) => ({ texto })),
    },
  ]
}

/**
 * COMPARACIÓN — "¿Freelance o agencia?".
 * portada → un criterio por diapositiva, las dos opciones en columnas → [resumen] → cierre
 * { lados: ['Freelance', 'Agencia'], criterios: [{ titulo, a, b, icono? }] }
 */
function comparacion(c) {
  exigir(Array.isArray(c.lados) && c.lados.length === 2, 'la plantilla "comparacion" necesita "lados" con dos nombres')
  const criterios = lista(c.criterios, 'criterios', 'comparacion')
  return [
    ...criterios.map((k, i) => {
      exigir(k.titulo && k.a && k.b, `el criterio ${i + 1} necesita "titulo", "a" y "b"`)
      return {
        variante: 'comparativa',
        icono: k.icono ?? 'capas',
        antetitulo: k.antetitulo ?? `Criterio ${i + 1} de ${criterios.length}`,
        titulo: k.titulo,
        texto: k.texto,
        columnas: [
          { etiqueta: c.lados[0], texto: k.a },
          { etiqueta: c.lados[1], texto: k.b },
        ],
      }
    }),
    ...resumenDe(c.resumen, 'comparacion'),
  ]
}

/**
 * MITO Y REALIDAD — "Mitos sobre el SEO".
 * portada → un mito por diapositiva y, abajo, la realidad → [resumen] → cierre
 * { mitos: [{ mito, realidad, texto?, icono? }] }
 */
function mito(c) {
  const mitos = lista(c.mitos, 'mitos', 'mito')
  return [
    ...mitos.map((m, i) => {
      exigir(m.mito && m.realidad, `el mito ${i + 1} necesita "mito" y "realidad"`)
      return {
        variante: 'punto',
        icono: m.icono ?? 'no',
        antetitulo: m.antetitulo ?? `Mito ${dos(i + 1)}`,
        titulo: `«${m.mito}»`,
        resalte: { etiqueta: 'La realidad', texto: m.realidad, nota: m.texto, icono: 'check' },
      }
    }),
    ...resumenDe(c.resumen, 'mito'),
  ]
}

/**
 * EXPLICACIÓN — "Qué es el hosting, en cuatro partes".
 * portada → una idea por diapositiva → [resumen] → cierre
 * { partes: [{ titulo, texto, icono? }] }
 */
function explicacion(c) {
  const partes = lista(c.partes, 'partes', 'explicacion')
  return [
    ...partes.map((k, i) => {
      exigir(k.titulo, `la parte ${i + 1} no tiene "titulo"`)
      return {
        variante: 'punto',
        icono: k.icono ?? 'idea',
        antetitulo: k.antetitulo ?? `${i + 1} de ${partes.length}`,
        titulo: k.titulo,
        texto: k.texto,
        resalte: k.ejemplo ? { etiqueta: 'Por ejemplo', texto: k.ejemplo, icono: 'idea' } : null,
      }
    }),
    ...resumenDe(c.resumen, 'explicacion'),
  ]
}

/**
 * DECISIÓN — "¿Web de una página o de varias?".
 * portada → una opción por diapositiva: cuándo elegirla y qué evitar → [resumen] → cierre
 * { opciones: [{ titulo, cuando, evita?, icono? }] }
 */
function decision(c) {
  const opciones = lista(c.opciones, 'opciones', 'decision')
  return [
    ...opciones.map((o, i) => {
      exigir(o.titulo && o.cuando, `la opción ${i + 1} necesita "titulo" y "cuando"`)
      return {
        variante: 'caso',
        icono: o.icono ?? 'flecha',
        antetitulo: o.antetitulo ?? `Opción ${String.fromCharCode(65 + i)}`,
        titulo: o.titulo,
        resalte: { etiqueta: 'Elígela si', texto: o.cuando, nota: o.evita, icono: 'check' },
      }
    }),
    ...resumenDe(c.resumen, 'decision'),
  ]
}

/**
 * COSTES — "¿De qué depende lo que cuesta una web?". Factores, sin cifras.
 * Las piezas de esta plantilla van en la serie "¿Cuánto cuesta?", bloqueada
 * por la fase 0 (PLAN.md): existen, pero el planificador no las propone.
 * { factores: [{ titulo, texto, icono? }] }
 */
function costes(c) {
  const factores = lista(c.factores, 'factores', 'costes')
  return [
    ...factores.map((f, i) => {
      exigir(f.titulo, `el factor ${i + 1} no tiene "titulo"`)
      return {
        variante: 'item',
        icono: f.icono ?? 'capas',
        antetitulo: f.antetitulo ?? `Factor ${i + 1} de ${factores.length}`,
        titulo: f.titulo,
        texto: f.texto,
        resalte: f.pregunta ? { etiqueta: 'Pregunta', texto: f.pregunta, icono: 'conversacion', tono: 'acento' } : null,
      }
    }),
    ...resumenDe(c.resumen, 'costes'),
  ]
}

/**
 * ANTES Y DESPUÉS — "Tres cambios que transforman una portada".
 * portada → un cambio por diapositiva, antes y después en columnas → cierre
 * { pares: [{ titulo, antes, despues, icono? }] }
 */
function antesDespues(c) {
  const pares = lista(c.pares, 'pares', 'antes-despues')
  return pares.map((k, i) => {
    exigir(k.titulo && k.antes && k.despues, `el cambio ${i + 1} necesita "titulo", "antes" y "despues"`)
    return {
      variante: 'comparativa',
      icono: k.icono ?? 'cambios',
      antetitulo: k.antetitulo ?? `Cambio ${i + 1} de ${pares.length}`,
      titulo: k.titulo,
      texto: k.texto,
      columnas: [
        { etiqueta: 'Antes', texto: k.antes },
        { etiqueta: 'Después', texto: k.despues },
      ],
    }
  })
}

/**
 * PASOS — "Cómo pasar tu dominio a tu nombre, en cinco pasos".
 * portada → un paso por diapositiva → la lista para marcar → cierre
 * { pasos: [{ titulo, texto, icono? }] }
 */
function pasos(c) {
  const ps = lista(c.pasos, 'pasos', 'pasos')
  return [
    ...ps.map((k, i) => {
      exigir(k.titulo, `el paso ${i + 1} no tiene "titulo"`)
      return {
        variante: 'punto',
        icono: k.icono ?? 'flecha',
        antetitulo: k.antetitulo ?? `Paso ${i + 1} de ${ps.length}`,
        titulo: k.titulo,
        texto: k.texto,
        resalte: k.consejo ? { etiqueta: 'Consejo', texto: k.consejo, icono: 'idea' } : null,
      }
    }),
    {
      variante: 'lista',
      marcador: 'casilla',
      icono: 'lista',
      antetitulo: 'Tu lista',
      titulo: c.resumen?.titulo ?? 'Guárdala y ve *marcando*.',
      lista: ps.map((k) => ({ texto: k.corto ?? k.titulo, estado: 'pendiente' })),
    },
  ]
}

export const PLANTILLAS = {
  errores,
  pregunta,
  checklist,
  comparacion,
  mito,
  explicacion,
  decision,
  costes,
  'antes-despues': antesDespues,
  pasos,
}

// Lo que lleva la portada si el JSON no lo dice.
const PORTADA = {
  errores: { icono: 'aviso', antetitulo: 'Errores frecuentes' },
  pregunta: { icono: 'pregunta', antetitulo: 'Una duda habitual' },
  checklist: { icono: 'lista', antetitulo: 'Checklist' },
  comparacion: { icono: 'capas', antetitulo: 'Comparativa' },
  mito: { icono: 'no', antetitulo: 'Mito o realidad' },
  explicacion: { icono: 'idea', antetitulo: 'Explicado fácil' },
  decision: { icono: 'flecha', antetitulo: 'Cómo decidir' },
  costes: { icono: 'capas', antetitulo: 'De qué depende' },
  'antes-despues': { icono: 'cambios', antetitulo: 'Antes y después' },
  pasos: { icono: 'lista', antetitulo: 'Paso a paso' },
}

// Las listas que traen las plantillas: su longitud es el número del layout C.
const LISTAS = ['puntos', 'items', 'casos', 'criterios', 'mitos', 'partes', 'opciones', 'factores', 'pares', 'pasos']
const numeroDe = (c) => LISTAS.map((k) => c[k]).find(Array.isArray)?.length ?? null

const CIERRE = {
  icono: 'guardar',
  antetitulo: 'Para acabar',
  titulo: '¿Te ha servido?',
  cta: 'Guárdalo para más adelante.',
}

// ------------------------------------------------------------

/**
 * El carrusel entero: portada + lo que decida la plantilla + cierre.
 * Devuelve las diapositivas listas para `Diapositiva.jsx`.
 *
 * @param contenido  lo que dice el carrusel (los datos de la pieza)
 * @param visual     { tema, layout } de la portada (lo decide el planificador)
 * @param serie      { nombre, numero } si la pieza es de una serie: va en el
 *                   antetítulo de la portada ("ERRORES WEB · 03")
 */
export function resolverCarrusel(contenido, { visual = {}, serie = null } = {}) {
  exigir(contenido && typeof contenido === 'object', 'el contenido está vacío')
  const plantilla = PLANTILLAS[contenido.plantilla]
  exigir(plantilla, `plantilla desconocida "${contenido.plantilla}". Hay: ${Object.keys(PLANTILLAS).join(', ')}`)
  exigir(contenido.portada?.titulo, 'falta "portada.titulo"')
  const diapositivas = [
    {
      variante: 'portada',
      ...PORTADA[contenido.plantilla],
      ...contenido.portada,
      // La serie manda sobre el antetítulo: es lo que hace que se reconozca.
      ...(serie ? { antetitulo: `${serie.nombre} · ${dos(serie.numero)}` } : {}),
      tema: visual.tema ?? 'dark',
      layout: visual.layout ?? 'A',
      numero: numeroDe(contenido),
    },
    ...plantilla(contenido),
    { variante: 'cierre', ...CIERRE, ...contenido.cierre },
  ]
  diapositivas.forEach((d, i) => exigir(d.titulo, `la diapositiva ${i + 1} (${d.variante}) no tiene titular`))
  return diapositivas
}
