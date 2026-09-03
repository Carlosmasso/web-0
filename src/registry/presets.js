// Plantillas completas: configuraciones enteras listas para aplicar de una vez.
// A diferencia de las estéticas (que solo parchean el acabado), un preset fija
// también paleta, tipografía, degradados y estructura de las secciones.

/** @type {Record<string, Partial<typeof import('../config/schema').DEFAULT_CONFIG>>} */
export const PRESETS = [
  {
    id: 'neo-brutal-corp',
    label: 'Neo-brutalismo corporativo',
    note: 'Amarillo y negro, bordes rectos, sombra sólida.',
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
        headingFamily: '"Archivo Black", "Helvetica Neue", sans-serif',
        bodyFamily: '"Inter", system-ui, sans-serif',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 400, headingCase: 'uppercase',
        headingTracking: '-0.01em', scaleRatio: 1.333,
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
      meta: { paletteId: null, mode: 'light', typeId: 'archivo-black', aestheticId: 'neo-brutalism' },
    },
  },

  {
    id: 'saas-glass',
    label: 'SaaS premium glassmorphic',
    note: 'Aurora de fondo, tarjetas translúcidas, esquinas amplias.',
    swatch: ['#7c3aed', '#db2777', '#0ea5e9'],
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
      meta: { paletteId: null, mode: 'dark', typeId: 'sora', aestheticId: 'glassmorphism' },
    },
  },

  {
    id: 'cyberpunk-web3',
    label: 'Dashboard cyberpunk / Web3',
    note: 'Negro profundo, neón cian y rosa, monoespaciada.',
    swatch: ['#05070d', '#22d3ee', '#f472b6'],
    config: {
      aesthetic: 'cyberpunk',
      motion: 'expressive',
      iconSet: 'tabler',
      palette: {
        primary: '#22d3ee', secondary: '#f472b6', accent: '#22d3ee',
        neutralBg: '#05070d', neutralSurface: '#0b111c',
        textPrimary: '#d7fbff', textMuted: '#6f8b98',
      },
      typography: {
        headingFamily: '"Chakra Petch", "IBM Plex Mono", monospace',
        bodyFamily: '"IBM Plex Mono", ui-monospace, monospace',
        monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
        headingWeight: 600, headingCase: 'uppercase',
        headingTracking: '0.08em', scaleRatio: 1.2,
      },
      borders: { radius: 'none', width: 'thin', style: 'solid', color: '#22d3ee' },
      shadows: { style: 'glowing-neon', color: '#22d3ee', intensity: 1.3 },
      gradients: {
        primaryGradient: {
          type: 'linear', angle: 96,
          stops: [
            { color: '#22d3ee', at: 0 },
            { color: '#f472b6', at: 100 },
          ],
        },
        backgroundGradient: {
          type: 'conic', angle: 210, position: '70% 8%',
          stops: [
            { color: '#05070d', at: 0 },
            { color: '#0c1e28', at: 34 },
            { color: '#1a0a1c', at: 68 },
            { color: '#05070d', at: 100 },
          ],
        },
      },
      effects: { blur: 0, noise: true, aurora: false },
      layout: { density: 'compact', containerWidth: 1320 },
      sections: { hero: 'split', features: 'rows', carousel: 'cards', testimonial: 'grid', cta: 'banner' },
      components: {
        hero: { background: 'gradient' },
        card: { media: 'auto' },
        button: { shape: 'sharp', fill: 'outline' },
        input: { variant: 'underline' },
        carousel: { controls: 'dots', peek: false, slidesPerView: 4 },
      },
      meta: { paletteId: 'neon', mode: 'dark', typeId: 'chakra-mono', aestheticId: 'cyberpunk' },
    },
  },
]

export const getPreset = (id) => PRESETS.find((p) => p.id === id) ?? null
