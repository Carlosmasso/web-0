import { useEffect, useMemo, useRef } from 'react'
import { PRESET_GROUPS, PRESETS, presetsByGroup } from '../registry/presets'
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
// EL PANEL EN TRES PASOS
//
//   1. PUNTO DE PARTIDA   elige un mundo entero (preset o estética base).
//   2. TU IDENTIDAD       color, tipo, esquinas, densidad, movimiento.
//   3. AJUSTE FINO        secciones y cada knob suelto.
//
// Los tres van en una barra de pestañas FIJA arriba del panel: se ven de un
// vistazo sin desplazarse, y solo se pinta el paso activo. Antes eran tres
// acordeones apilados y el paso 3 quedaba a mil píxeles de scroll: nadie
// llegaba. La barra deja saltar libremente; el pie de cada paso ("Siguiente:
// …") ofrece además el camino guiado para quien entra por primera vez.
//
// Regla de oro: en los pasos 2 y 3, cada control hace EXACTAMENTE lo que dice.
// Nunca bloquea, nunca teletransporta, nunca salta a la opción siguiente. El
// guardarraíl solo marca lo "recomendado" para la estética activa; elegir es
// del usuario. Cambiar de mundo entero se hace en el paso 1.
// ============================================================

/** El orden importa: es el recorrido que se propone a quien no sabe por dónde empezar. */
export const DESIGN_STEPS = [
  {
    id: 'start',
    label: 'Punto de partida',
    lead: 'Elige un mundo entero. Color, tipografía y secciones llegan ya afinados entre sí.',
  },
  {
    id: 'identity',
    label: 'Tu identidad',
    lead: 'Lo que hace tuya esa base: tu color y tu tipo. El resto se recalcula solo.',
  },
  {
    id: 'fine',
    label: 'Ajuste fino',
    lead: 'Qué secciones salen y en qué orden, y los detalles de cada pieza.',
    optional: true,
  },
]

const stepIndex = (id) => Math.max(0, DESIGN_STEPS.findIndex((s) => s.id === id))

/** Barra fija de pasos. Patrón de pestañas: flechas ← → además del clic. */
function StepNav({ step, onStep }) {
  const refs = useRef({})

  const onKeyDown = (e) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const i = stepIndex(step)
    const next = DESIGN_STEPS[(i + dir + DESIGN_STEPS.length) % DESIGN_STEPS.length]
    onStep(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div
      className="steps"
      role="tablist"
      aria-label="Pasos del diseño"
      data-tour="steps"
      onKeyDown={onKeyDown}
    >
      {DESIGN_STEPS.map((s, i) => {
        const active = s.id === step
        return (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[s.id] = el
            }}
            type="button"
            role="tab"
            id={`step-tab-${s.id}`}
            aria-selected={active}
            aria-controls="step-panel"
            tabIndex={active ? 0 : -1}
            className={`steps__item ${active ? 'is-active' : ''}`}
            onClick={() => onStep(s.id)}
          >
            <span className="steps__n">{i + 1}</span>
            <span className="steps__label">{s.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Pie del paso: atrás, y el siguiente por su nombre. En el último, la acción real. */
function StepFoot({ step, onStep, onContact }) {
  const i = stepIndex(step)
  const prev = DESIGN_STEPS[i - 1]
  const next = DESIGN_STEPS[i + 1]

  return (
    <div className="stepfoot">
      {!next && (
        <p className="stepfoot__done">
          Ya está. Cuando te guste cómo se ve, pídeme precio: sin compromiso y sin pagar nada aquí.
        </p>
      )}
      {prev ? (
        <button type="button" className="stepfoot__back" onClick={() => onStep(prev.id)}>
          <span aria-hidden="true">←</span> {prev.label}
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button type="button" className="stepfoot__next" onClick={() => onStep(next.id)}>
          {next.label} <span aria-hidden="true">→</span>
        </button>
      ) : (
        <button type="button" className="stepfoot__next" onClick={onContact}>
          Pedir presupuesto
        </button>
      )}
    </div>
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

// La cabecera y el pie no son secciones (no se quitan ni se reordenan), pero sí
// tienen estilo elegible. Se pintan como filas fijas dentro de "Secciones".
const FRAME_ROWS = [
  {
    path: 'components.nav.variant',
    // "Cabecera" a secas chocaba con la sección de portada, que se llama igual:
    // dos filas seguidas con el mismo nombre y estilos distintos.
    label: 'Barra de navegación',
    affects: { selector: '.db-nav', label: 'La barra de navegación' },
    options: [
      { id: 'standard', label: 'Completa', note: 'Enlaces, acceso y botón de acción' },
      { id: 'minimal', label: 'Mínima', note: 'Enlaces y botón, agrupados a la derecha' },
    ],
  },
  {
    path: 'components.footer.variant',
    label: 'Pie de página',
    affects: { selector: '.db-footer', label: 'El pie de página' },
    options: [
      { id: 'full', label: 'Completo', note: 'Marca y columnas de enlaces' },
      { id: 'slim', label: 'Sobrio', note: 'Una línea: marca y enlaces legales' },
    ],
  },
]

function FrameRow({ row, value, onChange, onFocus, onReveal }) {
  return (
    <div className="sec" {...focusProps(row.affects, onFocus)}>
      <div className="sec__bar">
        <span className="sec__pin">fija</span>
        <span className="sec__label">{row.label}</span>
      </div>
      <Affects affects={row.affects} onReveal={onReveal} />
      <div className="optlist">
        {row.options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`opt ${value === o.id ? 'is-active' : ''}`}
            onClick={() => onChange(o.id)}
          >
            <span className="opt__label">{o.label}</span>
            <span className="opt__note">{o.note}</span>
          </button>
        ))}
      </div>
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
  step = 'start',
  onStep,
  onContact,
  onSet,
  onApplyPreset,
  onApplyType,
  onBrandColor,
  onSurprise,
  onFocus,
  onReveal,
  onSwitchAesthetic,
  onToggleSection,
  onMoveSection,
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

  const meta = DESIGN_STEPS[stepIndex(step)]
  const scrollRef = useRef(null)

  // Cambiar de paso devuelve el panel a su principio: si no, se entra al paso
  // nuevo por la mitad, justo a la altura a la que se había quedado el anterior.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [step])

  // De qué mundo salió esto. En los pasos 2 y 3 es el contexto que se pierde al
  // dejar de ver la rejilla de presets.
  const baseLabel = useMemo(() => {
    const preset = PRESETS.find((p) => p.id === config.meta?.presetId)
    if (preset) return preset.label
    return AESTHETIC_OPTIONS.find((a) => a.id === aesthetic)?.label ?? null
  }, [config.meta?.presetId, aesthetic])

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
      <StepNav step={step} onStep={onStep} />

      <div className="sidebar__scroll" ref={scrollRef}>
        <section
          className={`step ${meta.optional ? 'step--opt' : ''}`}
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${meta.id}`}
          data-tour={meta.id}
        >
          <header className="step__head">
            <h2 className="step__title">
              {meta.label}
              {meta.optional && <span className="step__opt">opcional</span>}
            </h2>
            <p className="step__lead">{meta.lead}</p>
            {step !== 'start' && baseLabel && (
              <p className="step__base">
                <span>
                  Sobre <strong>{baseLabel}</strong>
                </span>
                <button type="button" onClick={() => onStep('start')}>
                  Cambiar base
                </button>
              </p>
            )}
          </header>

          <div className="step__body">
            {/* ---------- PASO 1 ---------- */}
            {step === 'start' && (
              <>
                {PRESET_GROUPS.map((g) => (
                  <Group key={g.id} title={g.label} hint={g.note}>
                    <div className="preset-grid">
                      {presetsByGroup(g.id).map((p) => (
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

                <Group
                  title="Estética base"
                  hint="El acabado sobre tu color y tu tipo. Cambiarla reajusta bordes, sombras y efectos de una vez."
                >
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
              </>
            )}

            {/* ---------- PASO 2 ---------- */}
            {step === 'identity' && (
              <>
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
                        <span
                          key={k}
                          style={{ background: config.palette[k] }}
                          title={config.palette[k]}
                        />
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
                        <span
                          className="opt__label"
                          style={{ fontFamily: t.values.headingFamily }}
                        >
                          {t.name}
                        </span>
                        <span className="opt__note">{t.note}</span>
                      </button>
                    ))}
                  </div>
                </Group>

                {vocab('borders.radius')}
                {vocab('motion')}

                {aestheticNote && (
                  <p className="grp__hint" style={{ margin: '14px 0 0' }}>
                    {aestheticNote}
                  </p>
                )}
              </>
            )}

            {/* ---------- PASO 3 ---------- */}
            {step === 'fine' && (
              <>
                <Group
                  title="Secciones"
                  hint="Muestra u oculta cada bloque y cámbialo de orden. La cabecera y el pie son fijos, pero puedes cambiar su estilo."
                >
                  <FrameRow
                    row={FRAME_ROWS[0]}
                    value={getIn(config, FRAME_ROWS[0].path)}
                    onChange={(v) => onSet(FRAME_ROWS[0].path, v)}
                    onFocus={onFocus}
                    onReveal={onReveal}
                  />
                  {config.sectionOrder.map((type, idx) => {
                    const sec = SECTION_META[type]
                    const isHero = type === 'hero'
                    return (
                      <div className="sec" key={type} {...focusProps(sec.affects, onFocus)}>
                        <div className="sec__bar">
                          {isHero ? (
                            <span className="sec__pin">fija</span>
                          ) : (
                            <span className="sec__move">
                              <button
                                type="button"
                                aria-label={`Subir ${sec.label}`}
                                disabled={idx <= 1}
                                onClick={() => onMoveSection(type, -1)}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                aria-label={`Bajar ${sec.label}`}
                                disabled={idx >= config.sectionOrder.length - 1}
                                onClick={() => onMoveSection(type, 1)}
                              >
                                ↓
                              </button>
                            </span>
                          )}
                          <span className="sec__label">{sec.label}</span>
                          {!isHero && (
                            <button
                              type="button"
                              className="sec__toggle"
                              onClick={() => onToggleSection(type)}
                            >
                              Quitar
                            </button>
                          )}
                        </div>
                        <Affects affects={sec.affects} onReveal={onReveal} />
                        <div className="optlist">
                          {sec.variants.map((v) => (
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
                    )
                  })}

                  <FrameRow
                    row={FRAME_ROWS[1]}
                    value={getIn(config, FRAME_ROWS[1].path)}
                    onChange={(v) => onSet(FRAME_ROWS[1].path, v)}
                    onFocus={onFocus}
                    onReveal={onReveal}
                  />

                  {SECTION_ORDER.some((t) => !config.sectionOrder.includes(t)) && (
                    <div className="sec-hidden">
                      <span className="sec-hidden__title">Ocultas</span>
                      {SECTION_ORDER.filter((t) => !config.sectionOrder.includes(t)).map((type) => (
                        <button
                          key={type}
                          type="button"
                          className="sec-hidden__item"
                          onClick={() => onToggleSection(type)}
                        >
                          <span>{SECTION_META[type].label}</span>
                          <span className="sec-hidden__add">Añadir</span>
                        </button>
                      ))}
                    </div>
                  )}
                </Group>

                {vocab('components.hero.background')}
                {vocab('components.button.fill')}
                {vocab('components.input.variant')}
                {vocab('effects.aurora')}
                {vocab('effects.noise')}
              </>
            )}
          </div>
        </section>

        <StepFoot step={step} onStep={onStep} onContact={onContact} />
      </div>
    </div>
  )
}
