import { NEGOCIOS, foto } from '../../datos/negocios.mjs'
import HISTORIAS from '../../datos/historias.json'
import { AESTHETIC_OPTIONS } from '../../../src/registry/aesthetics'
import { TYPE_PAIRINGS } from '../../../src/registry/fonts'
import { PRESETS } from '../../../src/registry/presets'
import { safePalette } from '../../../src/theme/color'
import { alLienzo, partida } from './web'

// ============================================================
// LA PLANTILLA "HISTORIA" — un negocio de verdad, en tres formas
//
// Todas empiezan con un clip real del oficio y su frase, y acaban con el
// cierre de siempre. Lo de en medio depende de la forma (datos/historias.json):
//
//   antes    "Antes y ahora": su web de antes en un móvil y tres toques en la
//            hoja de Maketa, elegidos del catálogo de abajo (preset, estilo,
//            color, tipografía, portada). Planos reales y la web terminada.
//   escribe  "Lo escribes tú": alguien teclea el titular y la web se escribe
//            a la vez; luego elige su foto en la galería del móvil. Planos
//            reales y la web terminada.
//   partida  Pantalla partida: arriba el oficio, abajo su web, emparejados
//            (amasan → "Lo que hacemos"; el local → la galería…). Sin toques.
//
// Hasta que haya clientes, el negocio es de ejemplo y se cuenta como "así
// quedaría", nunca como un caso real.
// ============================================================

export const TIEMPOS_HISTORIA = {
  gancho: 96,
  movil: 300,
  escribe: 300,
  planos: 150,
  partida: 360,
  resultado: 150,
  cierre: 80,
  cruce: 15,
}

/** Fotogramas (dentro de la escena del móvil) en que cae cada toque. */
export const TOQUES = [96, 166, 236]
/** "Lo escribes tú": el tecleo, la galería y el toque en la foto. */
export const ESCRIBE = { desde: 26, hasta: 150, galeria: 172, foto: 226 }
/** Pantalla partida: lo que dura cada pareja de plano y sección. */
export const PAR = 120

/** Las escenas de cada forma, en orden. */
export const ESCENAS = {
  antes: ['gancho', 'movil', 'planos', 'resultado', 'cierre'],
  escribe: ['gancho', 'escribe', 'planos', 'resultado', 'cierre'],
  partida: ['gancho', 'partida', 'cierre'],
}

// ---------- el "antes" ----------

// La web genérica que tienen muchos negocios. Misma información, sin
// decisiones: azul por defecto, letra de sistema, todo recto y centrado.
const LETRA_ANTES = '"Open Sans", system-ui, sans-serif'
const AZUL_ANTES = '#4a6fa5'

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const distancia = (a, b) => Math.hypot(...rgb(a).map((c, i) => c - rgb(b)[i]))
const COLORES = ['#3d7a6a', '#3b53d6', '#b4532a', '#7c3aed', '#1f2937', '#be185d']
const lejosDe = (marca) => [...COLORES].sort((a, b) => distancia(b, marca) - distancia(a, marca))

function antesDe(raw, color) {
  return {
    ...raw,
    aesthetic: 'minimalist-flat',
    palette: safePalette(color, { scheme: 'light' }),
    typography: { ...raw.typography, headingFamily: LETRA_ANTES, bodyFamily: LETRA_ANTES, headingWeight: 700, headingCase: 'none', headingTracking: '0em' },
    borders: { ...raw.borders, radius: 'none' },
    shadows: { style: 'none', color: 'auto', intensity: 1 },
    gradients: { primaryGradient: null, backgroundGradient: null },
    effects: { blur: 0, noise: false, aurora: false, mesh: false },
    sections: { ...raw.sections, hero: 'centered' },
    components: { ...raw.components, hero: { background: 'solid' }, button: { shape: 'sharp', fill: 'solid' } },
  }
}

const conFoto = (raw) => ({ ...raw, sections: { ...raw.sections, hero: 'image' }, components: { ...raw.components, hero: { background: 'image' } } })

// ---------- el catálogo de toques ("Antes y ahora") ----------
//
// Cada toque lleva un aspecto de la web de antes a la de ahora, y dice cómo se
// ve en la hoja de Maketa: qué opciones enseña, cuál está marcada al empezar
// (`inicial`) y cuál se toca (`objetivo`).

const nombreLetra = (familia) =>
  TYPE_PAIRINGS.find((t) => t.values.headingFamily === familia)?.name ?? familia.split(',')[0].replace(/"/g, '')

const TOQUE = {
  preset: {
    titulo: 'Punto de partida',
    grupo: 'tarjetas',
    transicion: 'barrido',
    // Todo el preset menos el color y la portada, que tienen su propio toque.
    aplicar: (raw, ahora) => ({
      ...ahora,
      palette: raw.palette,
      sections: { ...ahora.sections, hero: raw.sections.hero },
      components: { ...ahora.components, hero: raw.components.hero },
    }),
    opciones: ({ preset }) => {
      const otros = PRESETS.filter((p) => p.category === 'commercial' && p.label !== preset.label)
      return [otros[0], preset, otros[1]].map((p) => ({ label: p.label, nota: p.audience, swatch: p.swatch }))
    },
    objetivo: 1,
    inicial: -1,
    etiqueta: ({ preset }) => ({ titulo: preset.label, valor: 'Punto de partida', muestras: [] }),
  },
  estilo: {
    titulo: 'Estilo',
    grupo: 'lista',
    transicion: 'barrido',
    aplicar: (raw, ahora) => ({
      ...raw,
      aesthetic: ahora.aesthetic,
      borders: ahora.borders,
      shadows: ahora.shadows,
      effects: ahora.effects,
      gradients: ahora.gradients,
      components: { ...raw.components, button: ahora.components.button, card: ahora.components.card },
    }),
    opciones: ({ ahora }) => {
      const de = (id) => AESTHETIC_OPTIONS.find((a) => a.id === id)
      const otro = AESTHETIC_OPTIONS.find((a) => a.id !== 'minimalist-flat' && a.id !== ahora.aesthetic)
      return [de('minimalist-flat'), de(ahora.aesthetic), otro].map((a) => ({ label: a.label, nota: a.note }))
    },
    objetivo: 1,
    inicial: 0,
    etiqueta: ({ ahora }) => ({ titulo: AESTHETIC_OPTIONS.find((a) => a.id === ahora.aesthetic).label, valor: 'Estilo', muestras: [] }),
  },
  color: {
    titulo: 'Tu color de marca',
    grupo: 'muestras',
    transicion: 'morph',
    aplicar: (raw, ahora) => ({ ...raw, palette: ahora.palette }),
    opciones: ({ marca, colorAntes }) => {
      const resto = lejosDe(marca).filter((c) => c !== colorAntes && distancia(c, marca) > 70)
      return [colorAntes, resto[0], marca, ...resto.slice(1, 4)].map((color) => ({ color }))
    },
    objetivo: 2,
    inicial: 0,
    etiqueta: ({ marca }) => ({ titulo: 'Tu color', valor: marca.toUpperCase(), muestras: [marca] }),
  },
  tipografia: {
    titulo: 'Tipografía',
    grupo: 'lista',
    transicion: 'barrido',
    aplicar: (raw, ahora) => ({ ...raw, typography: ahora.typography }),
    opciones: ({ ahora }) => {
      const suya = nombreLetra(ahora.typography.headingFamily)
      const otra = TYPE_PAIRINGS.find((t) => t.name !== suya && t.id !== 'inter-clean')
      return [
        { label: 'Open Sans', nota: 'La de siempre' },
        { label: suya, nota: 'La de tu sector' },
        { label: otra.name, nota: 'Otra voz' },
      ]
    },
    objetivo: 1,
    inicial: 0,
    etiqueta: ({ ahora }) => ({ titulo: nombreLetra(ahora.typography.headingFamily), valor: 'Tipografía', muestras: [] }),
  },
  portada: {
    titulo: 'Portada',
    grupo: 'lista',
    transicion: 'barrido',
    aplicar: (raw) => conFoto(raw),
    opciones: () => [
      { label: 'Dividida', nota: 'Texto + panel visual' },
      { label: 'Centrada', nota: 'Manifiesto tipográfico' },
      { label: 'Imagen de fondo', nota: 'Tu foto a sangre' },
    ],
    objetivo: 2,
    inicial: 1,
    etiqueta: () => ({ titulo: 'Tus fotos', valor: 'Portada', muestras: [] }),
  },
}
export const TIPOS_DE_TOQUE = Object.keys(TOQUE)

// ---------- cada forma ----------

const conConfig = (pasos) => pasos.map(({ raw, ...p }) => ({ ...p, config: alLienzo(raw) }))

function formaAntes(historia, ctx) {
  const { ahora, colorAntes } = ctx
  const toques = historia.toques ?? ['preset', 'color', 'portada']
  if (toques.length !== TOQUES.length) throw new Error(`"Antes y ahora" lleva ${TOQUES.length} toques`)
  for (const t of toques) if (!TOQUE[t]) throw new Error(`toque desconocido "${t}" (hay: ${TIPOS_DE_TOQUE.join(', ')})`)

  let raw = antesDe(ahora, colorAntes)
  const pasos = [{ frame: 0, raw, transicion: 'barrido', titulo: 'Antes', valor: null, muestras: [colorAntes] }]
  toques.forEach((t, i) => {
    raw = TOQUE[t].aplicar(raw, ahora)
    pasos.push({ frame: TOQUES[i], raw, transicion: TOQUE[t].transicion, ...TOQUE[t].etiqueta(ctx) })
  })
  return {
    pasos: conConfig(pasos),
    grupos: toques.map((t) => ({
      tipo: t,
      titulo: TOQUE[t].titulo,
      grupo: TOQUE[t].grupo,
      opciones: TOQUE[t].opciones(ctx),
      objetivo: TOQUE[t].objetivo,
      inicial: TOQUE[t].inicial,
    })),
  }
}

function formaEscribe(_historia, { ahora, contenido }) {
  const base = { ...ahora, sections: { ...ahora.sections, hero: 'centered' } }
  return {
    pasos: conConfig([
      { frame: 0, raw: base, transicion: 'barrido', titulo: 'Tu titular', valor: null, muestras: [] },
      { frame: ESCRIBE.foto, raw: conFoto(ahora), transicion: 'barrido', titulo: 'Tu foto', valor: 'Portada', muestras: [] },
    ]),
    texto: contenido.hero.title,
    movimiento: { tipo: 'titular', desde: ESCRIBE.desde, hasta: ESCRIBE.hasta, texto: contenido.hero.title },
  }
}

function formaPartida(historia, { final, marca }) {
  if (!Array.isArray(historia.pares) || historia.pares.length !== 3) {
    throw new Error('la pantalla partida necesita tres "pares" (clip, sección y texto)')
  }
  return { pasos: [{ frame: 0, config: final, transicion: 'barrido', titulo: 'Ahora', valor: null, muestras: [marca] }], pares: historia.pares }
}

const FORMAS = { antes: formaAntes, escribe: formaEscribe, partida: formaPartida }

export function resolverHistoria(reel, plantilla) {
  const negocio = NEGOCIOS[reel.negocio]
  const historia = HISTORIAS[reel.negocio]
  if (!historia) throw new Error(`"${reel.negocio}" no tiene historia en datos/historias.json`)
  const forma = reel.forma ?? historia.forma ?? 'antes'
  if (!FORMAS[forma]) throw new Error(`forma desconocida "${forma}" (hay: ${Object.keys(FORMAS).join(', ')})`)

  const { raw: ahora, contenido } = partida(reel.negocio)
  const preset = PRESETS.find((p) => p.label.includes(negocio.preset))
  const marca = ahora.palette.primary
  // El azul de antes, salvo que la marca sea azul: entonces otro bien lejos.
  const colorAntes = distancia(AZUL_ANTES, marca) > 70 ? AZUL_ANTES : lejosDe(marca)[0]
  // La web terminada, para bajar por ella o enseñarla en la pantalla partida:
  // sin las secciones que en el móvil alargan sin contar nada (precios, el
  // mapa, que en el vídeo no llega a cargar).
  const final = alLienzo({ ...conFoto(ahora), sectionOrder: ['hero', 'features', 'carousel', 'testimonial', 'cta'] })
  const ctx = { ahora, contenido, preset, marca, colorAntes, final }
  const propio = FORMAS[forma](historia, ctx)

  const T = TIEMPOS_HISTORIA
  const escenas = ESCENAS[forma]
  return {
    historia: true,
    forma,
    escenas,
    gancho: reel.gancho ?? historia.gancho ?? plantilla.gancho({ quien: negocio.quien }),
    pregunta: reel.pregunta ?? plantilla.pregunta,
    frases: historia.frases,
    clips: historia.clips,
    nombreEje: plantilla.etiqueta,
    tipo: forma === 'escribe' ? 'titular' : 'preset',
    visual: { tema: reel.visual?.tema ?? 'dark', layout: reel.visual?.layout ?? 'A' },
    marca,
    contenido,
    final,
    // De fondo, desenfocada, la foto del negocio: no depende de lo que dure un clip.
    fondo: foto(reel.negocio, 'vertical'),
    fotoApaisada: foto(reel.negocio, 'apaisada'),
    ...propio,
    // La portada "duelo" compara antes y ahora; las demás usan la web final.
    portada: forma === 'antes' ? [propio.pasos[0], { ...propio.pasos.at(-1), titulo: 'Ahora' }] : propio.pasos,
    demo: T.movil,
    duracion: escenas.reduce((s, e) => s + T[e], 0) - (escenas.length - 1) * T.cruce,
  }
}
