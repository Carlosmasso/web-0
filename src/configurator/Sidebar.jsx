import { useEffect, useMemo, useState } from 'react'
import { PRESETS, PRESET_CATEGORIES, presetsByCategory } from '../registry/presets'
import { TYPE_PAIRINGS } from '../registry/fonts'
import { VOCABULARY } from '../registry/vocabulary'
import { SECTION_META, IDENTITY_AFFECTS } from '../registry/options'
import { ensureFonts } from '../theme/fonts'
import { auditPalette } from '../theme/color'
import { allowedValues, lockedPaths, ownerOfValue, GUARDRAILS } from '../config/guardrails'
import { getIn } from '../config/patch'
import { SECTION_ORDER } from '../config/schema'

// ============================================================
// EL PANEL EN TRES CAPAS
//
//   1. MACRO           elige un mundo entero. Una decisión, no veinte.
//   2. IDENTIDAD       lo que hace tuya esa base: color, tipo, esquinas.
//                      Todo pasa por guardarraíles, no se puede romper.
//   3. AVANZADO        acceso crudo, plegado y con aviso. Para quien sabe.
//
// La parálisis por análisis se ataca en la capa 1: el usuario no ve 20
// controles al entrar, ve 6 tarjetas y una pregunta que sabe contestar.
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

/**
 * Encender el foco al pasar el puntero o al recibir el foco de teclado.
 * Compartido por TODOS los controles, vengan del vocabulario o escritos a mano:
 * si un control puede cambiar algo del sitio, tiene que poder señalarlo.
 */
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
 * Control generado a partir del VOCABULARIO, no de nombres de CSS. Si la
 * estética activa bloquea o restringe el campo, se refleja aquí: las opciones
 * prohibidas se deshabilitan con su motivo, en vez de dejar que el usuario
 * elija algo que el motor va a revertir sin explicar.
 */
function VocabControl({
  path,
  value,
  onChange,
  aesthetic,
  unlocked,
  onFocus,
  onReveal,
  onSwitchAesthetic,
}) {
  const entry = VOCABULARY[path]
  if (!entry) return null

  const allowed = unlocked ? null : allowedValues(aesthetic, path)
  const isLocked = !unlocked && lockedPaths(aesthetic).has(path)
  const reason = GUARDRAILS[aesthetic]?.reason

  const focus = focusProps(entry.affects, onFocus)
  const affectsLine = <Affects affects={entry.affects} onReveal={onReveal} />

  if (entry.kind === 'toggle') {
    return (
      <label className={`toggle ${isLocked ? 'is-locked' : ''}`} {...focus}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          disabled={isLocked}
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
      <div className={`ctrl ${isLocked ? 'is-locked' : ''}`} {...focus}>
        <span className="ctrl__label">
          {entry.label}
          {isLocked && <em className="lock" title={reason}>fijado</em>}
        </span>
        {affectsLine}
        <div className="slider">
          <input
            type="range"
            min={entry.min}
            max={entry.max}
            step={entry.step}
            value={value ?? entry.min}
            disabled={isLocked}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <output>{entry.format ? entry.format(Number(value)) : value}</output>
        </div>
      </div>
    )
  }

  return (
    <div className="ctrl" {...focus}>
      <span className="ctrl__label">
        {entry.label}
        {isLocked && (
          <em className="lock" title={reason}>
            lo fija la estética
          </em>
        )}
      </span>
      {entry.question && <span className="ctrl__q">{entry.question}</span>}
      {affectsLine}
      <div className="optlist">
        {entry.options.map((opt) => {
          const blocked = allowed ? !allowed.includes(opt.id) : false
          const owner = blocked ? ownerOfValue(path, opt.id) : null

          // Una opción bloqueada NO es un botón muerto: es una puerta a la
          // estética a la que pertenece. Si no hay a dónde llevar al usuario,
          // entonces sí se deshabilita.
          return (
            <button
              key={opt.id}
              type="button"
              disabled={blocked && !owner}
              className={`opt ${opt.id === value ? 'is-active' : ''} ${blocked ? 'is-elsewhere' : ''}`}
              onClick={() => (owner ? onSwitchAesthetic?.(owner.id) : onChange(opt.id))}
            >
              <span className="opt__label">{opt.label}</span>
              {opt.tone && <span className="opt__note">{opt.tone}</span>}
              {owner && <span className="opt__owner">Cambia a {owner.label}</span>}
            </button>
          )
        })}
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
    ensureFonts(TYPE_PAIRINGS.map((t) => t.values.headingFamily), document)
  }, [])

  const unlocked = config.advanced?.unlocked
  const aesthetic = config.aesthetic
  const audit = useMemo(() => auditPalette(config.palette), [config.palette])
  const failing = audit.filter((a) => !a.pass)

  const vocab = (path) => (
    <VocabControl
      key={path}
      path={path}
      value={getIn(config, path)}
      onChange={(v) => onSet(path, v)}
      aesthetic={aesthetic}
      unlocked={unlocked}
      onFocus={onFocus}
      onReveal={onReveal}
      onSwitchAesthetic={onSwitchAesthetic}
    />
  )

  return (
    <div className="sidebar">
      {/* ---------- CAPA 1: MACRO ---------- */}
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

        <button type="button" className="surprise" onClick={onSurprise}>
          <span aria-hidden="true">🎲</span> Sorpréndeme
          <em>Combina color, tipo y estructura sin romper nada</em>
        </button>
      </Layer>

      {/* ---------- CAPA 2: IDENTIDAD SEGURA ---------- */}
      <Layer n="2" title="Tu identidad" subtitle="Lo que hace tuya esa base.">
        <Group title="Color de marca" hint="El resto de la paleta se calcula sola para que siempre se lea.">
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
              onClick={() => onBrandColor(config.palette.primary, config.meta?.mode === 'dark' ? 'light' : 'dark')}
            >
              {config.meta?.mode === 'dark' ? 'Fondo oscuro' : 'Fondo claro'}
            </button>
          </div>
          <p className={`a11y ${failing.length ? 'a11y--warn' : 'a11y--ok'}`}>
            {failing.length
              ? `${failing.length} par de colores por debajo del mínimo. Se corrige al aplicar.`
              : `Contraste verificado · ${audit[0].ratio}:1 en el texto principal`}
          </p>
        </Group>

        <Group title="Tipografía">
          <div {...focusProps(IDENTITY_AFFECTS.typography, onFocus)}>
            <Affects affects={IDENTITY_AFFECTS.typography} onReveal={onReveal} />
          </div>
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
      </Layer>

      {/* ---------- CAPA 3: MODO AVANZADO ---------- */}
      <Layer
        n="3"
        title="Ajuste fino"
        subtitle="Para quien sabe lo que hace."
        defaultOpen={false}
        tone="pro"
      >
        <label className="unlock">
          <input
            type="checkbox"
            checked={Boolean(unlocked)}
            onChange={(e) => onSet('advanced.unlocked', e.target.checked)}
          />
          <span>
            <span className="unlock__label">Saltarme las reglas de la estética</span>
            <span className="unlock__note">
              Los mínimos de contraste se siguen aplicando siempre.
            </span>
          </span>
        </label>

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
