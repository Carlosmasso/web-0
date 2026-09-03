import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_CONFIG } from '../config/schema'
import { normalizeConfigWithGuardrails } from '../config/guardrails'
import { deepMerge, setIn } from '../config/patch'
import { encodeConfig, decodeConfig } from '../config/encode'
import { DEFAULT_CONTENT } from '../content/defaults'
import { getTypePairing } from '../registry/fonts'
import { getAesthetic } from '../registry/aesthetics'
import { safePalette } from '../theme/color'
import { randomConfig } from '../theme/randomize'
import { Sidebar } from './Sidebar'
import { ContentForm } from './ContentForm'
import { ExportPanel } from './ExportPanel'
import { PreviewFrame } from './PreviewFrame'
import { Icon } from '../preview/Icon'

const CONFIG_KEY = 'web0.config.v2'
const CONTENT_KEY = 'web0.content'

function loadConfig() {
  const fromUrl = new URLSearchParams(window.location.search).get('c')
  if (fromUrl) {
    const decoded = decodeConfig(fromUrl)
    if (decoded) return decoded
  }
  try {
    const saved = localStorage.getItem(CONFIG_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    /* ignore */
  }
  return DEFAULT_CONFIG
}

function loadContent() {
  try {
    const saved = localStorage.getItem(CONTENT_KEY)
    if (saved) return { ...DEFAULT_CONTENT, ...JSON.parse(saved) }
  } catch {
    /* ignore */
  }
  return DEFAULT_CONTENT
}

export function App() {
  const [raw, setRaw] = useState(loadConfig)
  const [content, setContent] = useState(loadContent)
  const [mode, setMode] = useState('design')
  const [device, setDevice] = useState('desktop')
  const [showExport, setShowExport] = useState(false)
  const [copied, setCopied] = useState(null)
  const copiedTimer = useRef(null)
  const frameRef = useRef(null)

  // El panel edita la configuración CRUDA, pero muestra y envía la NORMALIZADA.
  // Así el usuario ve al instante lo que los guardarraíles han corregido, en vez
  // de que su elección se revierta en silencio al llegar al lienzo.
  const { config, violations } = useMemo(
    () => normalizeConfigWithGuardrails(raw, { unlockAdvanced: raw?.advanced?.unlocked }),
    [raw],
  )

  const encoded = useMemo(() => encodeConfig(config), [config])

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(raw))
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href)
    url.searchParams.set('c', encoded)
    window.history.replaceState(null, '', url)
  }, [raw, encoded])

  useEffect(() => {
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(content))
    } catch {
      /* ignore */
    }
  }, [content])

  useEffect(() => () => {
    clearTimeout(copiedTimer.current)
    clearTimeout(focusTimer.current)
  }, [])

  /* ---- edición ---- */

  const set = useCallback((path, value) => setRaw((prev) => setIn(prev, path, value)), [])
  const merge = useCallback((patch) => setRaw((prev) => deepMerge(prev, patch)), [])

  const applyPreset = useCallback((preset) => setRaw(structuredClone(preset.config)), [])

  const applyType = useCallback(
    (id) => merge({ typography: getTypePairing(id).values, meta: { typeId: id } }),
    [merge],
  )

  /** MÓDULO 4.2 en acción: el usuario solo elige el color de marca. */
  const setBrandColor = useCallback(
    (hex, nextMode) => {
      const scheme = nextMode ?? (raw?.meta?.mode === 'dark' ? 'dark' : 'light')
      merge({ palette: safePalette(hex, { scheme }), meta: { mode: scheme } })
    },
    [merge, raw],
  )

  const surprise = useCallback(() => setRaw(randomConfig()), [])

  /** Cambia solo el acabado, conservando paleta, tipografía y estructura. */
  const switchAesthetic = useCallback(
    (id) => {
      const { patch } = getAesthetic(id)
      merge({ aesthetic: id, ...patch, meta: { aestheticId: id } })
    },
    [merge],
  )

  /**
   * Señala en el lienzo qué parte del sitio toca el control que se está mirando.
   *
   * Con retardo al encender: barrer el puntero por la lista de controles
   * encendería y apagaría el foco decenas de veces. Apagar es inmediato, para
   * que salir del panel no deje el resaltado colgando.
   *
   * Iluminar NUNCA desplaza el lienzo. Ir hasta allí es `revealInPreview`,
   * que solo se dispara con un clic deliberado.
   */
  const focusTimer = useRef(null)
  const revealLock = useRef(0)

  const focusInPreview = useCallback((affects) => {
    // Un "Ver" reciente manda: al pulsarlo, el puntero acaba encima de otros
    // controles mientras el panel se recoloca, y esos hover robaban o apagaban
    // el resaltado que el usuario acababa de pedir a propósito.
    if (Date.now() < revealLock.current) return
    clearTimeout(focusTimer.current)
    if (!affects) {
      frameRef.current?.focus(null)
      return
    }
    focusTimer.current = setTimeout(() => frameRef.current?.focus(affects), 140)
  }, [])

  const revealInPreview = useCallback((affects) => {
    clearTimeout(focusTimer.current)
    // Cubre la duración del desplazamiento suave.
    revealLock.current = Date.now() + 900
    frameRef.current?.focus({ ...affects, scrollTo: Date.now() })
  }, [])

  /* ---- exportación ---- */

  const flash = (key) => {
    setCopied(key)
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(null), 1600)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/preview.html#${encoded}`)
    flash('link')
  }

  return (
    <div className="shell">
      <aside className="shell__panel">
        <div className="shell__brand">
          <span className="shell__logo">Estudio</span>
          <div className="shell__tabs">
            <button
              type="button"
              className={mode === 'design' ? 'is-active' : ''}
              onClick={() => setMode('design')}
            >
              Diseño
            </button>
            <button
              type="button"
              className={mode === 'content' ? 'is-active' : ''}
              onClick={() => setMode('content')}
            >
              Contenido
            </button>
          </div>
        </div>

        {mode === 'design' ? (
          <Sidebar
            config={config}
            onSet={set}
            onApplyPreset={applyPreset}
            onApplyType={applyType}
            onBrandColor={setBrandColor}
            onSurprise={surprise}
            onFocus={focusInPreview}
            onReveal={revealInPreview}
            onSwitchAesthetic={switchAesthetic}
          />
        ) : (
          <ContentForm
            config={config}
            content={content}
            onChange={setContent}
            onReset={() => setContent(DEFAULT_CONTENT)}
          />
        )}
      </aside>

      <main className="shell__stage-wrap">
        <div className="shell__bar">
          <div className="shell__devices">
            <button
              className={device === 'desktop' ? 'is-active' : ''}
              onClick={() => setDevice('desktop')}
              type="button"
            >
              Escritorio
            </button>
            <button
              className={device === 'mobile' ? 'is-active' : ''}
              onClick={() => setDevice('mobile')}
              type="button"
            >
              Móvil
            </button>
          </div>

          {violations.length > 0 && (
            <p className="shell__violations" title={violations.map((v) => v.reason).join('\n')}>
              {violations.length} ajuste{violations.length > 1 ? 's' : ''} automático
              {violations.length > 1 ? 's' : ''}
            </p>
          )}

          <div className="shell__actions">
            <button
              onClick={() => setShowExport((v) => !v)}
              type="button"
              className={showExport ? 'is-active' : ''}
            >
              Exportar código
            </button>
            <button onClick={copyLink} type="button">
              {copied === 'link' ? 'Copiado' : 'Copiar enlace'}
            </button>
            <button
              onClick={() => setRaw(DEFAULT_CONFIG)}
              type="button"
              className="shell__reset"
              aria-label="Reiniciar diseño"
            >
              <Icon set="tabler" name="close" size={16} />
            </button>
          </div>
        </div>

        <div className="shell__stage-row">
          <PreviewFrame ref={frameRef} config={config} content={content} device={device} />
          <ExportPanel
            config={config}
            violations={violations}
            open={showExport}
            onClose={() => setShowExport(false)}
          />
        </div>
      </main>
    </div>
  )
}
