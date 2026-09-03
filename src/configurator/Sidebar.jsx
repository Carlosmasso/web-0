import { useEffect, useMemo, useState } from 'react'
import { PRESET_CATEGORIES, presetsByCategory } from '../registry/presets'
import { AESTHETIC_OPTIONS } from '../registry/aesthetics'
import { TYPE_PAIRINGS } from '../registry/fonts'
import { VOCABULARY } from '../registry/vocabulary'
import { SECTION_META, IDENTITY_AFFECTS } from '../registry/options'
import { ensureFonts } from '../theme/fonts'
import { auditPalette } from '../theme/color'
import { GUARDRAILS, recommendedValue } from '../config/guardrails'
import { getIn } from '../config/patch'
import { SECTION_ORDER } from '../config/schema'

// ============================================================
// EL PANEL EN TRES CAPAS
//
//   1. PUNTO DE PARTIDA   elige un mundo entero (preset o estética base).
//   2. TU IDENTIDAD       color, tipo, esquinas, densidad, movimiento.
//   3. AJUSTE FINO        cada knob suelto, plegado por defecto.
//
// Regla de oro: en las capas 2 y 3, cada control hace EXACTAMENTE lo que dice.
// Nunca bloquea, nunca teletransporta, nunca salta a la opción siguiente. El
// guardarraíl solo marca lo "recomendado" para la estética activa; elegir es
// del usuario. Cambiar de mundo entero se hace arriba, en la capa 1.
// ============================================================

function Layer({ n, title, subtitle, children, defaultOpen = true, tone }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className={`layer ${open ? 'is-open' : ''} ${tone ? `layer--${tone}` : ''}`}>
      <button type="button" className="layer__head" onClick={() => setOpen((v) => !v)}>
        <span className="layer__n">{n}</span>
        <span className="layer__titles">
          <span className="layer__title">{title}</span>
          {subtitle && <span className="layer__sub">{subtitle}</span>}
        </span>
        <span className="layer__chevron" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <div className="layer__body">{children}</div>}
    </section>
  )
}

function Group({ title, hint, children }) {
  return (
    <div className="grp">
      {title && <h3 className="grp__title">{title}</h3>}
      {hint && <p className="grp__hint">{hint}</p>}
      {children}
    </div>
  )
}

/** Enciende el foco del lienzo al pasar el puntero o al recibir foco de teclado. */
function focusProps(affects, onFocus) {
  if (!affects) return {}
  return {
    onMouseEnter: () => onFocus?.(affects),
    onMouseLeave: () => onFocus?.(null),
    onFocusCapture: () => onFocus?.(affects),
    onBlurCapture: () => onFocus?.(null),
  }
}

/** Pasar el ratón ilumina; pulsar "Ver" desplaza. Dos gestos, dos intenciones. */
function Affects({ affects, onReveal }) {
  if (!affects) return null
  return (
    <span className="ctrl__affects">
      Afecta a: {affects.label}
      <button
        type="button"
        className="ctrl__reveal"
        onClick={(e) => {
          e.preventDefault()
          onReveal?.(affects)
        }}
      >
        Ver
      </button>
    </span>
  )
}

/**
 * Control generado desde el VOCABULARIO (nunca desde nombres de CSS).
 * Toda opción es una elección libre: aplica su valor y nada más. Si un valor
 * es el "recomendado" para la estética activa, se marca — pero no se impone.
 */
function VocabControl({ path, value, onChange, aesthetic, onFocus, onReveal }) {
  const entry = VOCABULARY[path]
  if (!entry) return null

  const rec = recommendedValue(aesthetic, path)
  const focus = focusProps(entry.affects, onFocus)
  const affectsLine = <Affects affects={entry.affects} onReveal={onReveal} />

  if (entry.kind === 'toggle') {
    return (
      <label className="toggle" {...focus}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          <span className="toggle__label">{entry.label}</span>
          {entry.tone && <span className="toggle__tone">{entry.tone}</span>}
          {affectsLine}
        </span>
      </label>
    )
  }

  if (entry.kind === 'range') {
    return (
      <div className="ctrl" {...focus}>
        <span className="ctrl__label">{entry.label}</span>
        {affectsLine}
        <div className="slider">
          <input
            type="range"
            min={entry.min}
            max={entry.max}
            step={entry.step}
            value={value ?? entry.min}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <output>{entry.format ? entry.format(Number(value)) : value}</output>
        </div>
      </div>
    )
  }

  return (
    <div className="grp" {...focus}>
      <span className="grp__title">{entry.label}</span>
      {entry.question && <span className="ctrl__q">{entry.question}</span>}
      {affectsLine}
      <div className="optlist">
        {entry.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`opt ${opt.id === value ? 'is-active' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            <span className="opt__label">
              {opt.label}
              {opt.id === rec && opt.id !== value && (
                <span className="opt__rec">recomendado</span>
              )}
            </span>
            {opt.tone && <span className="opt__note">{opt.tone}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Sidebar({
  config,
  onSet,
  onApplyPreset,
  onApplyType,
  onBrandColor,
  onSurprise,
  onFocus,
  onReveal,
  onSwitchAesthetic,
}) {
  useEffect(() => {
    ensureFonts(
      TYPE_PAIRINGS.map((t) => t.values.headingFamily),
      document,
    )
  }, [])

  const aesthetic = config.aesthetic
  const audit = useMemo(() => auditPalette(config.palette), [config.palette])
  const failing = audit.filter((a) => !a.pass)
  const aestheticNote = GUARDRAILS[aesthetic]?.note

  const vocab = (path) => (
    <VocabControl
      key={path}
      path={path}
      value={getIn(config, path)}
      onChange={(v) => onSet(path, v)}
      aesthetic={aesthetic}
      onFocus={onFocus}
      onReveal={onReveal}
    />
  )

  return (
    <div className="sidebar">
      {/* ---------- CAPA 1 ---------- */}
      <Layer n="1" title="Punto de partida" subtitle="Elige el mundo. Lo demás viene afinado.">
        {PRESET_CATEGORIES.map((cat) => (
          <Group key={cat.id} title={cat.label} hint={cat.note}>
            <div className="preset-grid">
              {presetsByCategory(cat.id).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`preset ${p.id === config.meta?.presetId ? 'is-active' : ''}`}
                  onClick={() => onApplyPreset(p)}
                >
                  <span className="preset__swatch">
                    {p.swatch.map((c, i) => (
                      <i key={i} style={{ background: c }} />
                    ))}
                  </span>
                  <span className="preset__label">{p.label}</span>
                  <span className="preset__audience">{p.audience}</span>
                  <span className="preset__note">{p.note}</span>
                </button>
              ))}
            </div>
          </Group>
        ))}

        <Group title="Estética base" hint="El acabado sobre tu color y tu tipo. Cambiarla reajusta bordes, sombras y efectos de una vez.">
          <div className="chips">
            {AESTHETIC_OPTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`chip ${a.id === aesthetic ? 'is-active' : ''}`}
                title={a.note}
                onClick={() => onSwitchAesthetic?.(a.id)}
              >
                {a.label}
              </button>
            ))}
          </div>
        </Group>

        <button type="button" className="surprise" onClick={onSurprise}>
          <span aria-hidden="true">🎲</span> Sorpréndeme
          <em>Combina color, tipo y estructura sin romper nada</em>
        </button>
      </Layer>

      {/* ---------- CAPA 2 ---------- */}
      <Layer n="2" title="Tu identidad" subtitle="Lo que hace tuya esa base.">
        <Group
          title="Color de marca"
          hint="El resto de la paleta se calcula sola para que siempre se lea."
        >
          <Affects affects={IDENTITY_AFFECTS.brand} onReveal={onReveal} />
          <div className="brand" {...focusProps(IDENTITY_AFFECTS.brand, onFocus)}>
            <input
              type="color"
              value={config.palette.primary}
              onChange={(e) => onBrandColor(e.target.value)}
              aria-label="Color de marca"
            />
            <div className="brand__derived">
              {['neutralBg', 'neutralSurface', 'textPrimary', 'accent'].map((k) => (
                <span key={k} style={{ background: config.palette[k] }} title={config.palette[k]} />
              ))}
            </div>
            <button
              type="button"
              className="brand__mode"
              onClick={() =>
                onBrandColor(
                  config.palette.primary,
                  config.meta?.mode === 'dark' ? 'light' : 'dark',
                )
              }
            >
              {config.meta?.mode === 'dark' ? 'Fondo claro' : 'Fondo oscuro'}
            </button>
          </div>
          <p className={`a11y ${failing.length ? 'a11y--warn' : 'a11y--ok'}`}>
            {failing.length
              ? `${failing.length} par de colores por debajo del mínimo. Se corrige al aplicar.`
              : `Contraste verificado · ${audit[0].ratio}:1 en el texto principal`}
          </p>
        </Group>

        <Group title="Tipografía">
          <Affects affects={IDENTITY_AFFECTS.typography} onReveal={onReveal} />
          <div className="optlist" {...focusProps(IDENTITY_AFFECTS.typography, onFocus)}>
            {TYPE_PAIRINGS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`opt ${t.id === config.meta?.typeId ? 'is-active' : ''}`}
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

        {vocab('borders.radius')}
        {vocab('layout.density')}
        {vocab('motion')}

        {aestheticNote && <p className="grp__hint" style={{ margin: '4px 0 0' }}>{aestheticNote}</p>}
      </Layer>

      {/* ---------- CAPA 3 ---------- */}
      <Layer n="3" title="Ajuste fino" subtitle="Cada detalle por separado." defaultOpen={false} tone="pro">
        {vocab('shadows.style')}
        {vocab('shadows.intensity')}
        {vocab('borders.width')}
        {vocab('borders.style')}
        {vocab('effects.blur')}
        {vocab('effects.noise')}
        {vocab('effects.aurora')}
        {vocab('components.hero.background')}
        {vocab('components.button.shape')}
        {vocab('components.button.fill')}
        {vocab('components.input.variant')}
        {vocab('components.carousel.controls')}
        {vocab('iconSet')}

        <Group title="Secciones">
          {SECTION_ORDER.map((type) => (
            <div className="ctrl" key={type} {...focusProps(SECTION_META[type].affects, onFocus)}>
              <span className="ctrl__label">{SECTION_META[type].label}</span>
              <Affects affects={SECTION_META[type].affects} onReveal={onReveal} />
              <div className="optlist">
                {SECTION_META[type].variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={`opt ${config.sections[type] === v.id ? 'is-active' : ''}`}
                    onClick={() => onSet(`sections.${type}`, v.id)}
                  >
                    <span className="opt__label">{v.label}</span>
                    <span className="opt__note">{v.note}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </Group>
      </Layer>
    </div>
  )
}
