// Each palette ships a full light and dark token set. One accent per palette,
// locked across every section of the preview.

export const PALETTES = [
  {
    id: 'grafito',
    name: 'Grafito',
    swatch: '#2563eb',
    light: {
      bg: '#fafafa', surface: '#ffffff', surface2: '#f4f4f5',
      text: '#18181b', muted: '#52525b', border: '#e4e4e7',
      accent: '#2563eb', accentText: '#ffffff',
    },
    dark: {
      bg: '#0b0b0d', surface: '#141417', surface2: '#1d1d21',
      text: '#f4f4f5', muted: '#a1a1aa', border: '#2a2a2f',
      accent: '#5b9bff', accentText: '#0b0b0d',
    },
  },
  {
    id: 'bosque',
    name: 'Bosque',
    swatch: '#1f7a53',
    light: {
      bg: '#f6f5f0', surface: '#ffffff', surface2: '#eeece3',
      text: '#1b241f', muted: '#5a6660', border: '#dcd9cc',
      accent: '#1f7a53', accentText: '#ffffff',
    },
    dark: {
      bg: '#0e1512', surface: '#161f1a', surface2: '#1e2823',
      text: '#edf0ec', muted: '#9db0a6', border: '#2a352e',
      accent: '#4cbf8b', accentText: '#0e1512',
    },
  },
  {
    id: 'cobalto',
    name: 'Cobalto',
    swatch: '#2b4de0',
    light: {
      bg: '#f7f6f2', surface: '#ffffff', surface2: '#efeee7',
      text: '#141726', muted: '#565a6f', border: '#e0dfd6',
      accent: '#2b4de0', accentText: '#ffffff',
    },
    dark: {
      bg: '#0a0c16', surface: '#121524', surface2: '#181c30',
      text: '#eef0f8', muted: '#9aa0c0', border: '#242a44',
      accent: '#6d86ff', accentText: '#0a0c16',
    },
  },
  {
    id: 'terracota',
    name: 'Terracota',
    swatch: '#c05a37',
    light: {
      bg: '#faf7f4', surface: '#ffffff', surface2: '#f1ebe5',
      text: '#231b17', muted: '#6b5d55', border: '#e6ddd4',
      accent: '#c05a37', accentText: '#ffffff',
    },
    dark: {
      bg: '#14100e', surface: '#1d1815', surface2: '#26201c',
      text: '#f2ede9', muted: '#b3a297', border: '#332a24',
      accent: '#e0805c', accentText: '#14100e',
    },
  },
  {
    id: 'monocromo',
    name: 'Monocromo',
    swatch: '#10b981',
    light: {
      bg: '#f5f5f4', surface: '#ffffff', surface2: '#ececeb',
      text: '#1c1c1c', muted: '#5b5b5a', border: '#e0e0de',
      accent: '#10b981', accentText: '#0a0a0a',
    },
    dark: {
      bg: '#0c0c0c', surface: '#151515', surface2: '#1f1f1f',
      text: '#f2f2f0', muted: '#a0a09e', border: '#2b2b2b',
      accent: '#34d399', accentText: '#0a0a0a',
    },
  },
]

export function getPalette(id) {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]
}
