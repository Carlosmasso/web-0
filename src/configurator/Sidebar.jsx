import { useEffect } from 'react'
import { PALETTES } from '../registry/palettes'
import { TYPE_PAIRINGS } from '../registry/fonts'
import { AESTHETIC_OPTIONS } from '../registry/aesthetics'
import { PRESETS } from '../registry/presets'
import { ensureFonts } from '../theme/fonts'
import {
  RADIUS_OPTIONS,
  WIDTH_OPTIONS,
  BORDER_STYLE_OPTIONS,
  SHADOW_OPTIONS,
  DENSITY_OPTIONS,
  ICON_OPTIONS,
  MOTION_OPTIONS,
  HERO_BG_OPTIONS,
  BUTTON_SHAPE_OPTIONS,
  BUTTON_FILL_OPTIONS,
  INPUT_VARIANT_OPTIONS,
  CAROUSEL_CONTROL_OPTIONS,
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

function Slider({ value, min, max, step, onChange, format }) {
  return (
    <div className="slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{format ? format(value) : value}</output>
    </div>
  )
}

function Sub({ label, children }) {
  return (
    <div className="sub">
      <span className="sub__label">{label}</span>
      {children}
    </div>
  )
}

export function Sidebar({ config, onSet, onApplyPalette, onApplyType, onApplyAesthetic, onApplyPreset }) {
  // Carga todas las familias para que el selector muestre cada nombre en su
  // propia tipografía.
  useEffect(() => {
    ensureFonts(TYPE_PAIRINGS.flatMap((t) => [t.values.headingFamily]), document)
  }, [])

  const { meta } = config

  return (
    <div className="sidebar">
      <Group title="Plantilla">
        <div className="optlist">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="opt opt--preset"
              onClick={() => onApplyPreset(p)}
            >
              <span className="opt__swatch">
                {p.swatch.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              <span>
                <span className="opt__label">{p.label}</span>
                <span className="opt__note">{p.note}</span>
              </span>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Estética">
        <OptionList
          options={AESTHETIC_OPTIONS}
          value={config.aesthetic}
          onChange={(id) => onApplyAesthetic(id)}
        />
      </Group>

      <Group title="Paleta">
        <div className="swatches">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.name}
              style={{ padding: 0 }}
              onClick={() => onApplyPalette(p.id, meta.mode)}
              className={`swatch ${p.id === meta.paletteId ? 'is-active' : ''}`}
            >
              <span style={{ background: p.light.neutralBg }} />
              <span style={{ background: p.swatch }} />
              <span style={{ background: p.dark.neutralBg }} />
              <em>{p.name}</em>
            </button>
          ))}
        </div>
        <Segmented
          options={[
            { id: 'light', label: 'Claro' },
            { id: 'dark', label: 'Oscuro' },
          ]}
          value={meta.mode}
          onChange={(mode) => onApplyPalette(meta.paletteId ?? 'grafito', mode)}
        />
      </Group>

      <Group title="Tipografía">
        <div className="optlist">
          {TYPE_PAIRINGS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`opt ${t.id === meta.typeId ? 'is-active' : ''}`}
              onClick={() => onApplyType(t.id)}
            >
              <span className="opt__label" style={{ fontFamily: t.values.headingFamily }}>
                {t.name}
              </span>
              <span className="opt__note">{t.note}</span>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Bordes">
        <Sub label="Esquinas">
          <Segmented
            options={RADIUS_OPTIONS}
            value={config.borders.radius}
            onChange={(v) => onSet('borders.radius', v)}
          />
        </Sub>
        <Sub label="Grosor">
          <Segmented
            options={WIDTH_OPTIONS}
            value={config.borders.width}
            onChange={(v) => onSet('borders.width', v)}
          />
        </Sub>
        <Sub label="Trazo">
          <Segmented
            options={BORDER_STYLE_OPTIONS}
            value={config.borders.style}
            onChange={(v) => onSet('borders.style', v)}
          />
        </Sub>
      </Group>

      <Group title="Sombra">
        <OptionList
          options={SHADOW_OPTIONS}
          value={config.shadows.style}
          onChange={(v) => onSet('shadows.style', v)}
        />
        <Sub label="Intensidad">
          <Slider
            value={config.shadows.intensity}
            min={0.5}
            max={2}
            step={0.1}
            onChange={(v) => onSet('shadows.intensity', v)}
            format={(v) => `${v.toFixed(1)}×`}
          />
        </Sub>
      </Group>

      <Group title="Controles">
        <Sub label="Forma del botón">
          <Segmented
            options={BUTTON_SHAPE_OPTIONS}
            value={config.components.button.shape}
            onChange={(v) => onSet('components.button.shape', v)}
          />
        </Sub>
        <Sub label="Relleno del botón">
          <Segmented
            options={BUTTON_FILL_OPTIONS}
            value={config.components.button.fill}
            onChange={(v) => onSet('components.button.fill', v)}
          />
        </Sub>
        <Sub label="Campos">
          <Segmented
            options={INPUT_VARIANT_OPTIONS}
            value={config.components.input.variant}
            onChange={(v) => onSet('components.input.variant', v)}
          />
        </Sub>
      </Group>

      <Group title="Fondo de cabecera">
        <Segmented
          options={HERO_BG_OPTIONS}
          value={config.components.hero.background}
          onChange={(v) => onSet('components.hero.background', v)}
        />
      </Group>

      <Group title="Navegación del carrusel">
        <Segmented
          options={CAROUSEL_CONTROL_OPTIONS}
          value={config.components.carousel.controls}
          onChange={(v) => onSet('components.carousel.controls', v)}
        />
        <Sub label="Tarjetas por vista">
          <Slider
            value={config.components.carousel.slidesPerView}
            min={2}
            max={5}
            step={1}
            onChange={(v) => onSet('components.carousel.slidesPerView', v)}
          />
        </Sub>
      </Group>

      <Group title="Densidad">
        <Segmented
          options={DENSITY_OPTIONS}
          value={config.layout.density}
          onChange={(v) => onSet('layout.density', v)}
        />
      </Group>

      <Group title="Iconos">
        <OptionList
          options={ICON_OPTIONS}
          value={config.iconSet}
          onChange={(v) => onSet('iconSet', v)}
        />
      </Group>

      <Group title="Movimiento">
        <OptionList
          options={MOTION_OPTIONS}
          value={config.motion}
          onChange={(v) => onSet('motion', v)}
        />
      </Group>

      {SECTION_ORDER.map((type) => (
        <Group key={type} title={SECTION_META[type].label}>
          <OptionList
            options={SECTION_META[type].variants}
            value={config.sections[type]}
            onChange={(v) => onSet(`sections.${type}`, v)}
          />
        </Group>
      ))}
    </div>
  )
}
