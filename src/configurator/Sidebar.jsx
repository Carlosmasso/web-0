import { useEffect } from 'react'
import { PALETTES } from '../registry/palettes'
import { FONTS, loadGoogleFont } from '../registry/fonts'
import {
  RADIUS_OPTIONS,
  DENSITY_OPTIONS,
  ICON_OPTIONS,
  EFFECT_OPTIONS,
  SECTION_META,
} from '../registry/options'
import { SECTION_ORDER } from '../config/schema'

function Group({ title, children }) {
  return (
    <section className="grp">
      <h3 className="grp__title">{title}</h3>
      {children}
    </section>
  )
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="seg" role="group">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={opt.id === value ? 'is-active' : ''}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function OptionList({ options, value, onChange }) {
  return (
    <div className="optlist">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`opt ${opt.id === value ? 'is-active' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          <span className="opt__label">{opt.label}</span>
          {opt.note && <span className="opt__note">{opt.note}</span>}
        </button>
      ))}
    </div>
  )
}

export function Sidebar({ config, onUpdate, onSection }) {
  // Load every family so the type picker renders each name in its own face.
  useEffect(() => {
    FONTS.forEach((f) => loadGoogleFont(f, document))
  }, [])

  return (
    <div className="sidebar">
      <Group title="Paleta">
        <div className="swatches">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`swatch ${p.id === config.palette ? 'is-active' : ''}`}
              onClick={() => onUpdate({ palette: p.id })}
              title={p.name}
            >
              <span style={{ background: p.light.bg }} />
              <span style={{ background: p.swatch }} />
              <span style={{ background: p.dark.bg }} />
              <em>{p.name}</em>
            </button>
          ))}
        </div>
        <Segmented
          options={[
            { id: 'light', label: 'Claro' },
            { id: 'dark', label: 'Oscuro' },
          ]}
          value={config.mode}
          onChange={(mode) => onUpdate({ mode })}
        />
      </Group>

      <Group title="Tipografía">
        <div className="optlist">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`opt ${f.id === config.font ? 'is-active' : ''}`}
              onClick={() => onUpdate({ font: f.id })}
            >
              <span className="opt__label" style={{ fontFamily: f.heading }}>
                {f.name}
              </span>
              <span className="opt__note">{f.note}</span>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Esquinas">
        <Segmented options={RADIUS_OPTIONS} value={config.radius} onChange={(v) => onUpdate({ radius: v })} />
      </Group>

      <Group title="Densidad">
        <Segmented options={DENSITY_OPTIONS} value={config.density} onChange={(v) => onUpdate({ density: v })} />
      </Group>

      <Group title="Iconos">
        <OptionList options={ICON_OPTIONS} value={config.iconSet} onChange={(v) => onUpdate({ iconSet: v })} />
      </Group>

      <Group title="Efectos">
        <OptionList options={EFFECT_OPTIONS} value={config.effects} onChange={(v) => onUpdate({ effects: v })} />
      </Group>

      {SECTION_ORDER.map((type) => (
        <Group key={type} title={SECTION_META[type].label}>
          <OptionList
            options={SECTION_META[type].variants}
            value={config.sections[type]}
            onChange={(v) => onSection(type, v)}
          />
        </Group>
      ))}
    </div>
  )
}
