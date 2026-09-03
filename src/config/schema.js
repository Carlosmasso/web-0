// The single source of truth for a "web spec": one serialisable object that
// fully describes the demo site. The preview renders from it; the client
// exports it as the brief for the final build.

export const DEFAULT_CONFIG = {
  palette: 'grafito',
  mode: 'light', // light | dark
  font: 'space-grotesk',
  surface: 'elevated', // elevated | minimal | brutal | glass — the visual style
  radius: 'md', // none | sm | md | pill
  density: 'normal', // compact | normal | airy
  iconSet: 'phosphor', // phosphor | tabler
  effects: 'subtle', // none | subtle | expressive
  sections: {
    hero: 'split', // split | centered | image
    features: 'grid', // grid | rows | bento
    carousel: 'peek', // peek | cards | full
    testimonial: 'quote', // quote | grid
    cta: 'boxed', // boxed | banner
  },
}

export const SECTION_ORDER = ['hero', 'features', 'carousel', 'testimonial', 'cta']

// Guards a decoded config against missing / unknown keys.
export function normalizeConfig(input) {
  const base = structuredClone(DEFAULT_CONFIG)
  if (!input || typeof input !== 'object') return base
  for (const key of ['palette', 'mode', 'font', 'surface', 'radius', 'density', 'iconSet', 'effects']) {
    if (typeof input[key] === 'string') base[key] = input[key]
  }
  if (input.sections && typeof input.sections === 'object') {
    for (const key of SECTION_ORDER) {
      if (typeof input.sections[key] === 'string') base.sections[key] = input.sections[key]
    }
  }
  return base
}
