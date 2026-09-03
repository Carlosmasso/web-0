// Paletas del marketplace. Cada una entrega el bloque `palette` completo del
// contrato, en claro y en oscuro. Elegir una escribe VALORES en la config: a
// partir de ahí cualquiera de ellos se puede afinar a mano sin romper nada.

export const PALETTES = [
  {
    id: 'grafito',
    name: 'Grafito',
    swatch: '#2563eb',
    light: {
      primary: '#2563eb', secondary: '#7c3aed', accent: '#2563eb',
      neutralBg: '#fafafa', neutralSurface: '#ffffff',
      textPrimary: '#18181b', textMuted: '#52525b',
    },
    dark: {
      primary: '#5b9bff', secondary: '#a78bfa', accent: '#5b9bff',
      neutralBg: '#0b0b0d', neutralSurface: '#141417',
      textPrimary: '#f4f4f5', textMuted: '#a1a1aa',
    },
  },
  {
    id: 'bosque',
    name: 'Bosque',
    swatch: '#1f7a53',
    light: {
      primary: '#1f7a53', secondary: '#b7791f', accent: '#1f7a53',
      neutralBg: '#f6f5f0', neutralSurface: '#ffffff',
      textPrimary: '#1b241f', textMuted: '#5a6660',
    },
    dark: {
      primary: '#4cbf8b', secondary: '#e0b163', accent: '#4cbf8b',
      neutralBg: '#0e1512', neutralSurface: '#161f1a',
      textPrimary: '#edf0ec', textMuted: '#9db0a6',
    },
  },
  {
    id: 'cobalto',
    name: 'Cobalto',
    swatch: '#2b4de0',
    light: {
      primary: '#2b4de0', secondary: '#0ea5e9', accent: '#2b4de0',
      neutralBg: '#f7f6f2', neutralSurface: '#ffffff',
      textPrimary: '#141726', textMuted: '#565a6f',
    },
    dark: {
      primary: '#6d86ff', secondary: '#38bdf8', accent: '#6d86ff',
      neutralBg: '#0a0c16', neutralSurface: '#121524',
      textPrimary: '#eef0f8', textMuted: '#9aa0c0',
    },
  },
  {
    id: 'terracota',
    name: 'Terracota',
    swatch: '#c05a37',
    light: {
      primary: '#c05a37', secondary: '#3f6151', accent: '#c05a37',
      neutralBg: '#faf7f4', neutralSurface: '#ffffff',
      textPrimary: '#231b17', textMuted: '#6b5d55',
    },
    dark: {
      primary: '#e0805c', secondary: '#6fa088', accent: '#e0805c',
      neutralBg: '#14100e', neutralSurface: '#1d1815',
      textPrimary: '#f2ede9', textMuted: '#b3a297',
    },
  },
  {
    id: 'monocromo',
    name: 'Monocromo',
    swatch: '#10b981',
    light: {
      primary: '#1c1c1c', secondary: '#10b981', accent: '#10b981',
      neutralBg: '#f5f5f4', neutralSurface: '#ffffff',
      textPrimary: '#1c1c1c', textMuted: '#5b5b5a',
    },
    dark: {
      primary: '#f2f2f0', secondary: '#34d399', accent: '#34d399',
      neutralBg: '#0c0c0c', neutralSurface: '#151515',
      textPrimary: '#f2f2f0', textMuted: '#a0a09e',
    },
  },
  {
    id: 'neon',
    name: 'Neón',
    swatch: '#22d3ee',
    light: {
      primary: '#0891b2', secondary: '#db2777', accent: '#0891b2',
      neutralBg: '#f2fbfd', neutralSurface: '#ffffff',
      textPrimary: '#0b1c22', textMuted: '#4c6b76',
    },
    dark: {
      primary: '#22d3ee', secondary: '#f472b6', accent: '#22d3ee',
      neutralBg: '#05070d', neutralSurface: '#0b111c',
      textPrimary: '#d7fbff', textMuted: '#6f8b98',
    },
  },
]

export const getPalette = (id) => PALETTES.find((p) => p.id === id) ?? PALETTES[0]

/** Devuelve el bloque `palette` del contrato para una paleta y un modo. */
export function paletteValues(id, mode) {
  const p = getPalette(id)
  return { ...(p[mode] ?? p.light) }
}
