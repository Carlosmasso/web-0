import { getPalette } from '../registry/palettes'
import { getFont, loadGoogleFont } from '../registry/fonts'

const RADIUS = {
  none: { card: '0px', btn: '0px' },
  sm: { card: '8px', btn: '8px' },
  md: { card: '16px', btn: '12px' },
  pill: { card: '22px', btn: '999px' },
}

const DENSITY = { compact: 0.78, normal: 1, airy: 1.28 }

// Writes the whole token set onto one element as inline custom properties.
// Everything downstream reads var(--token); nothing hard-codes a colour.
export function applyTokens(el, cfg, doc = document) {
  const palette = getPalette(cfg.palette)
  const c = palette[cfg.mode] ?? palette.light
  const font = getFont(cfg.font)
  const radius = RADIUS[cfg.radius] ?? RADIUS.md
  const scale = DENSITY[cfg.density] ?? 1

  const s = el.style
  s.setProperty('--bg', c.bg)
  s.setProperty('--surface', c.surface)
  s.setProperty('--surface-2', c.surface2)
  s.setProperty('--text', c.text)
  s.setProperty('--muted', c.muted)
  s.setProperty('--border', c.border)
  s.setProperty('--accent', c.accent)
  s.setProperty('--accent-text', c.accentText)
  s.setProperty('--radius-card', radius.card)
  s.setProperty('--radius-btn', radius.btn)
  s.setProperty('--space-scale', String(scale))
  s.setProperty('--font-heading', font.heading)
  s.setProperty('--font-body', font.body)
  s.setProperty('--shadow', shadowFor(cfg.mode))

  el.dataset.mode = cfg.mode
  el.dataset.effects = cfg.effects
  el.dataset.surface = cfg.surface ?? 'elevated'

  loadGoogleFont(font, doc)
}

function shadowFor(mode) {
  return mode === 'dark'
    ? '0 1px 2px rgba(0,0,0,0.4), 0 12px 32px -12px rgba(0,0,0,0.6)'
    : '0 1px 2px rgba(15,23,42,0.06), 0 12px 32px -12px rgba(15,23,42,0.14)'
}
