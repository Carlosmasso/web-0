import { NEGOCIOS } from '../../datos/negocios.mjs'
import HISTORIAS from '../../datos/historias.json'
import { PRESETS } from '../../../src/registry/presets'
import { safePalette } from '../../../src/theme/color'
import { alLienzo, partida } from './web'

// ============================================================
// LA PLANTILLA "HISTORIA" — un negocio de verdad, antes y ahora
//
//   gancho     vídeo real del negocio (Pexels) y la frase encima
//   móvil      su web de antes en un móvil, y Maketa en uso: tres toques
//              (punto de partida, color, portada con su foto) y la web
//              cambiando arriba, con las mismas transiciones del motor
//   planos     dos planos reales del oficio con dos frases
//   resultado  la web terminada en el móvil, bajando despacio
//   cierre     el de siempre
//
// Es la misma composición (motor/Reel.jsx): un reel de este tipo es un
// negocio con su entrada en datos/historias.json. Hasta que haya clientes,
// el negocio es de ejemplo y se cuenta como "así quedaría", nunca como un
// caso real.
// ============================================================

export const TIEMPOS_HISTORIA = {
  gancho: 96,
  movil: 300,
  planos: 150,
  resultado: 150,
  cierre: 80,
  cruce: 15,
}

/** Fotogramas (dentro de la escena del móvil) en que cae cada toque. */
export const TOQUES = [96, 166, 236]

// El "antes": la web genérica que tienen muchos negocios. Misma información,
// sin decisiones: azul por defecto, letra de sistema, todo recto y centrado.
const LETRA_ANTES = '"Open Sans", system-ui, sans-serif'
function antesDe(raw) {
  return {
    ...raw,
    aesthetic: 'minimalist-flat',
    palette: safePalette('#4a6fa5', { scheme: 'light' }),
    typography: {
      ...raw.typography,
      headingFamily: LETRA_ANTES,
      bodyFamily: LETRA_ANTES,
      headingWeight: 700,
      headingCase: 'none',
      headingTracking: '0em',
    },
    borders: { ...raw.borders, radius: 'none' },
    shadows: { style: 'none', color: 'auto', intensity: 1 },
    gradients: { primaryGradient: null, backgroundGradient: null },
    effects: { blur: 0, noise: false, aurora: false, mesh: false },
    sections: { ...raw.sections, hero: 'centered' },
    components: {
      ...raw.components,
      hero: { background: 'solid' },
      button: { shape: 'sharp', fill: 'solid' },
    },
  }
}

// El primer toque deja el preset con otro color; el segundo, el de la marca.
const COLOR_DE_PASO = '#3d7a6a'

export function resolverHistoria(reel, plantilla) {
  const negocio = NEGOCIOS[reel.negocio]
  const historia = HISTORIAS[reel.negocio]
  if (!historia) throw new Error(`"${reel.negocio}" no tiene historia en datos/historias.json`)

  const { raw: ahora, contenido } = partida(reel.negocio)
  const preset = PRESETS.find((p) => p.label.includes(negocio.preset))
  const marca = ahora.palette.primary
  const conPreset = { ...ahora, palette: safePalette(COLOR_DE_PASO, { scheme: 'light' }), sections: { ...ahora.sections, hero: 'centered' } }
  const conColor = { ...conPreset, palette: ahora.palette }
  const conFoto = { ...conColor, sections: { ...conColor.sections, hero: 'image' }, components: { ...conColor.components, hero: { background: 'image' } } }

  const pasos = [
    { frame: 0, raw: antesDe(ahora), transicion: 'barrido', titulo: 'Antes', valor: null, muestras: ['#4a6fa5'] },
    { frame: TOQUES[0], raw: conPreset, transicion: 'barrido', titulo: preset.label, valor: 'Punto de partida', muestras: [] },
    { frame: TOQUES[1], raw: conColor, transicion: 'morph', titulo: 'Tu color', valor: marca.toUpperCase(), muestras: [marca] },
    { frame: TOQUES[2], raw: conFoto, transicion: 'barrido', titulo: 'Tus fotos', valor: 'Portada', muestras: [] },
  ].map(({ raw, ...paso }) => ({ ...paso, config: alLienzo(raw) }))

  // La web terminada, para bajar por ella: sin las secciones que en el móvil
  // alargan el recorrido sin contar nada (precios, el mapa, que en el vídeo no
  // llega a cargar).
  const final = alLienzo({ ...conFoto, sectionOrder: ['hero', 'features', 'carousel', 'testimonial', 'cta'] })

  const T = TIEMPOS_HISTORIA
  return {
    historia: true,
    gancho: reel.gancho ?? historia.gancho ?? plantilla.gancho({ quien: negocio.quien }),
    pregunta: reel.pregunta ?? plantilla.pregunta,
    frases: historia.frases,
    clips: historia.clips,
    nombreEje: plantilla.etiqueta,
    tipo: 'preset',
    visual: { tema: reel.visual?.tema ?? 'dark', layout: reel.visual?.layout ?? 'A' },
    preset: { label: preset.label, audience: preset.audience, swatch: preset.swatch },
    marca,
    contenido,
    pasos,
    // La portada (variante "duelo") compara solo dos estados: antes y ahora.
    portada: [pasos[0], { ...pasos.at(-1), titulo: 'Ahora' }],
    final,
    demo: T.movil,
    duracion: T.gancho + T.movil + T.planos + T.resultado + T.cierre - 4 * T.cruce,
  }
}
