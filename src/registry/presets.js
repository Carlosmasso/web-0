// ============================================================
// MÓDULO 2 — CATÁLOGO DE PRESETS MAESTROS
//
// Capa MACRO del configurador. El usuario elige un mundo entero, no ajustes
// sueltos: paleta, tipografía, acabado, estructura de secciones y efectos
// llegan ya afinados y coherentes entre sí.
//
// Dos categorías porque son dos compradores distintos:
//   trend      agencias, startups, portfolios. Compran diferenciación.
//   commercial negocio a pie de calle. Compra confianza y que "parezca serio".
//
// Cada preset declara la `aesthetic` que gobierna su comportamiento en CSS.
// Estética != preset: tres presets comerciales muy distintos pueden apoyarse
// en la misma estética y no parecerse en nada.
// ============================================================

export const PRESET_CATEGORIES = [
  { id: 'commercial', label: 'Negocio', note: 'Sectores con expectativas visuales muy marcadas' },
  { id: 'trend', label: 'Tendencia', note: 'Para diferenciarse, no para tranquilizar' },
]

export const PRESETS = [
  // ==========================================================
  // A) ESTÁNDAR COMERCIAL
  // ==========================================================
  {
    id: 'medical-wellness',
    category: 'commercial',
    label: 'Salud y bienestar',
    audience: 'Dentistas, fisios, psicólogos, clínicas',
    note: 'Verde menta y azul clínico, relieve casi imperceptible. Higiene y calma.',
    swatch: ['#f7fbfa', '#0f9b8e', '#3b7fc4'],
    config: {
      aesthetic: 'material-clean',
      motion: 'subtle',
      iconSet: 'phosphor',
      palette: {
        primary: '#0f8d81', secondary: '#3b7fc4', accent: '#0b7a70',
        neutralBg: '#f6fbfa', neutralSurface: '#ffffff',
        textPrimary: '#0f211f', textMuted: '#4e6360',
      },
      typography: {
        headingFamily: '"Inter Tight", system-ui, sans-serif',
        bodyFamily: '"Inter", system-ui, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 600, headingCase: 'none',
        headingTracking: '-0.025em', scaleRatio: 1.24,
      },
      borders: { radius: 'soft', width: 'thin', style: 'solid', color: 'auto' },
      // Sombra deliberadamente por debajo del umbral consciente: se percibe
      // orden, no se percibe la sombra.
      shadows: { style: 'soft-elevation', color: 'auto', intensity: 0.5 },
      gradients: { primaryGradient: null, backgroundGradient: null },
      effects: { blur: 0, noise: false, aurora: false },
      layout: { density: 'spacious', containerWidth: 1140 },
      sections: { hero: 'split', features: 'grid', carousel: 'cards', testimonial: 'grid', cta: 'boxed' },
      components: {
        hero: { background: 'solid' },
        card: { media: 'auto' },
        button: { shape: 'inherit', fill: 'solid' },
        input: { variant: 'outline' },
        carousel: { controls: 'arrows', peek: false, slidesPerView: 3 },
      },
      meta: { presetId: 'medical-wellness', paletteId: null, mode: 'light', typeId: null, aestheticId: 'material-clean' },
    },
  },

  {
    id: 'corporate-legal',
    category: 'commercial',
    label: 'Corporativo y legal',
    audience: 'Bufetes, consultoras, inmobiliarias',
    note: 'Azul marino profundo con acento champán y serif de autoridad.',
    swatch: ['#f8f7f4', '#12294a', '#a67c3d'],
    config: {
      aesthetic: 'minimalist-flat',
      motion: 'subtle',
      iconSet: 'tabler',
      palette: {
        primary: '#12294a', secondary: '#a67c3d', accent: '#8a682f',
        neutralBg: '#f8f7f4', neutralSurface: '#ffffff',
        textPrimary: '#101d2e', textMuted: '#535e6c',
      },
      typography: {
        headingFamily: '"Playfair Display", Georgia, serif',
        bodyFamily: '"Inter", system-ui, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 600, headingCase: 'none',
        headingTracking: '-0.015em', scaleRatio: 1.3,
      },
      borders: { radius: 'none', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'none', color: 'auto', intensity: 1 },
      gradients: { primaryGradient: null, backgroundGradient: null },
      effects: { blur: 0, noise: false, aurora: false },
      layout: { density: 'spacious', containerWidth: 1180 },
      sections: { hero: 'split', features: 'rows', carousel: 'cards', testimonial: 'quote', cta: 'banner' },
      components: {
        hero: { background: 'solid' },
        card: { media: 'auto' },
        button: { shape: 'sharp', fill: 'solid' },
        input: { variant: 'underline' },
        carousel: { controls: 'arrows', peek: false, slidesPerView: 3 },
      },
      meta: { presetId: 'corporate-legal', paletteId: null, mode: 'light', typeId: null, aestheticId: 'minimalist-flat' },
    },
  },

  {
    id: 'local-food',
    category: 'commercial',
    label: 'Hostelería y artesanía',
    audience: 'Cafeterías, panaderías, talleres',
    note: 'Tonos tierra, esquinas muy orgánicas y grano de papel.',
    swatch: ['#fdf8f1', '#b5551f', '#5f7a4a'],
    config: {
      aesthetic: 'claymorphism',
      motion: 'expressive',
      iconSet: 'phosphor',
      palette: {
        primary: '#a94c1b', secondary: '#5f7a4a', accent: '#9c4517',
        neutralBg: '#fdf8f1', neutralSurface: '#fffdfa',
        textPrimary: '#2a1c13', textMuted: '#6b5748',
      },
      typography: {
        headingFamily: '"Bricolage Grotesque", system-ui, sans-serif',
        bodyFamily: '"Work Sans", system-ui, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 700, headingCase: 'none',
        headingTracking: '-0.03em', scaleRatio: 1.27,
      },
      borders: { radius: 'round', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'inset-3d', color: 'auto', intensity: 1.1 },
      gradients: { primaryGradient: null, backgroundGradient: null },
      effects: { blur: 0, noise: true, aurora: false },
      layout: { density: 'normal', containerWidth: 1120 },
      sections: { hero: 'image', features: 'grid', carousel: 'peek', testimonial: 'quote', cta: 'boxed' },
      components: {
        hero: { background: 'image' },
        card: { media: 'auto' },
        button: { shape: 'pill', fill: 'solid' },
        input: { variant: 'filled' },
        carousel: { controls: 'both', peek: true, slidesPerView: 3 },
      },
      meta: { presetId: 'local-food', paletteId: null, mode: 'light', typeId: null, aestheticId: 'claymorphism' },
    },
  },

  // ==========================================================
  // B) TENDENCIAS UI / EXPERIMENTALES
  // ==========================================================
  {
    id: 'neo-brutal',
    category: 'trend',
    label: 'Neo-brutalismo',
    audience: 'Agencias, herramientas de creador, marcas con carácter',
    note: 'Sombras sólidas negras, trazo grueso y titulares en versales.',
    swatch: ['#ffe500', '#0a0a0a', '#2c2ce0'],
    config: {
      aesthetic: 'neo-brutalism',
      motion: 'expressive',
      iconSet: 'tabler',
      palette: {
        primary: '#0a0a0a', secondary: '#ffe500', accent: '#2c2ce0',
        neutralBg: '#ffe500', neutralSurface: '#ffffff',
        textPrimary: '#0a0a0a', textMuted: '#3d3d3d',
      },
      typography: {
        headingFamily: '"Space Grotesk", system-ui, sans-serif',
        bodyFamily: '"Inter", system-ui, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 700, headingCase: 'uppercase',
        headingTracking: '-0.02em', scaleRatio: 1.333,
      },
      borders: { radius: 'none', width: 'thick', style: 'solid', color: '#0a0a0a' },
      shadows: { style: 'flat-hard', color: '#0a0a0a', intensity: 1.4 },
      gradients: { primaryGradient: null, backgroundGradient: null },
      effects: { blur: 0, noise: false, aurora: false },
      layout: { density: 'normal', containerWidth: 1200 },
      sections: { hero: 'centered', features: 'grid', carousel: 'cards', testimonial: 'grid', cta: 'boxed' },
      components: {
        hero: { background: 'solid' },
        card: { media: 'auto' },
        button: { shape: 'sharp', fill: 'solid' },
        input: { variant: 'outline' },
        carousel: { controls: 'arrows', peek: false, slidesPerView: 3 },
      },
      meta: { presetId: 'neo-brutal', paletteId: null, mode: 'light', typeId: null, aestheticId: 'neo-brutalism' },
    },
  },

  {
    id: 'saas-glass',
    category: 'trend',
    label: 'Glassmorfismo',
    audience: 'SaaS, productos de datos, landing de lanzamiento',
    note: 'Aurora de fondo y superficies translúcidas con desenfoque severo.',
    swatch: ['#0f0b2e', '#7c3aed', '#0ea5e9'],
    config: {
      aesthetic: 'glassmorphism',
      motion: 'expressive',
      iconSet: 'phosphor',
      palette: {
        primary: '#7c3aed', secondary: '#0ea5e9', accent: '#a78bfa',
        neutralBg: '#0f0b2e', neutralSurface: '#2a2358',
        textPrimary: '#f3f0ff', textMuted: '#b9b2e8',
      },
      typography: {
        headingFamily: '"Sora", system-ui, sans-serif',
        bodyFamily: '"Inter", system-ui, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 600, headingCase: 'none',
        headingTracking: '-0.03em', scaleRatio: 1.25,
      },
      borders: { radius: 'round', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'soft-elevation', color: '#05010f', intensity: 1.5 },
      gradients: {
        primaryGradient: {
          type: 'linear', angle: 118,
          stops: [
            { color: '#7c3aed', at: 0 },
            { color: '#db2777', at: 52 },
            { color: '#0ea5e9', at: 100 },
          ],
        },
        backgroundGradient: {
          type: 'radial', angle: 0, position: 'ellipse 120% 90% at 20% 0%',
          stops: [
            { color: '#2e1065', at: 0 },
            { color: '#160f3d', at: 48 },
            { color: '#0f0b2e', at: 100 },
          ],
        },
      },
      effects: { blur: 18, noise: true, aurora: true },
      layout: { density: 'spacious', containerWidth: 1180 },
      sections: { hero: 'centered', features: 'bento', carousel: 'peek', testimonial: 'quote', cta: 'boxed' },
      components: {
        hero: { background: 'aurora' },
        card: { media: 'auto' },
        button: { shape: 'pill', fill: 'gradient' },
        input: { variant: 'filled' },
        carousel: { controls: 'both', peek: true, slidesPerView: 3 },
      },
      meta: { presetId: 'saas-glass', paletteId: null, mode: 'dark', typeId: null, aestheticId: 'glassmorphism' },
    },
  },

  {
    id: 'clay-playful',
    category: 'trend',
    label: 'Claymorfismo',
    audience: 'Apps de consumo, educación, producto infantil',
    note: 'Volumen inflado con doble sombra interna cruzada.',
    swatch: ['#f0eeff', '#6d5cf6', '#ff8fab'],
    config: {
      aesthetic: 'claymorphism',
      motion: 'expressive',
      iconSet: 'phosphor',
      palette: {
        primary: '#5b4bd6', secondary: '#e4568c', accent: '#5346c9',
        neutralBg: '#f1effe', neutralSurface: '#faf9ff',
        textPrimary: '#1e1a3c', textMuted: '#5b5580',
      },
      typography: {
        headingFamily: '"Outfit", system-ui, sans-serif',
        bodyFamily: '"Work Sans", system-ui, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 700, headingCase: 'none',
        headingTracking: '-0.03em', scaleRatio: 1.26,
      },
      borders: { radius: 'pill', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'inset-3d', color: 'auto', intensity: 1.3 },
      gradients: {
        primaryGradient: {
          type: 'linear', angle: 135,
          stops: [
            { color: '#6d5cf6', at: 0 },
            { color: '#e4568c', at: 100 },
          ],
        },
        backgroundGradient: null,
      },
      effects: { blur: 0, noise: false, aurora: false },
      layout: { density: 'spacious', containerWidth: 1140 },
      sections: { hero: 'centered', features: 'bento', carousel: 'cards', testimonial: 'grid', cta: 'boxed' },
      components: {
        hero: { background: 'gradient' },
        card: { media: 'auto' },
        button: { shape: 'pill', fill: 'gradient' },
        input: { variant: 'filled' },
        carousel: { controls: 'dots', peek: false, slidesPerView: 3 },
      },
      meta: { presetId: 'clay-playful', paletteId: null, mode: 'light', typeId: null, aestheticId: 'claymorphism' },
    },
  },
]

export const getPreset = (id) => PRESETS.find((p) => p.id === id) ?? null
export const presetsByCategory = (category) => PRESETS.filter((p) => p.category === category)
