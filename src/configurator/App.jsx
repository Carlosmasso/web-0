import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_CONFIG, normalizeConfig } from '../config/schema'
import { deepMerge, setIn } from '../config/patch'
import { encodeConfig, decodeConfig } from '../config/encode'
import { DEFAULT_CONTENT } from '../content/defaults'
import { paletteValues } from '../registry/palettes'
import { getTypePairing } from '../registry/fonts'
import { getAesthetic } from '../registry/aesthetics'
import { Sidebar } from './Sidebar'
import { ContentForm } from './ContentForm'
import { PreviewFrame } from './PreviewFrame'
import { Icon } from '../preview/Icon'

const CONFIG_KEY = 'web0.config.v1'
const CONTENT_KEY = 'web0.content'

function loadConfig() {
  const fromUrl = new URLSearchParams(window.location.search).get('c')
  if (fromUrl) {
    const decoded = decodeConfig(fromUrl)
    if (decoded) return decoded
  }
  try {
    const saved = localStorage.getItem(CONFIG_KEY)
    if (saved) return normalizeConfig(JSON.parse(saved))
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
  const [config, setConfig] = useState(loadConfig)
  const [content, setContent] = useState(loadContent)
  const [mode, setMode] = useState('design') // design | content
  const [device, setDevice] = useState('desktop')
  const [copied, setCopied] = useState(null)
  const copiedTimer = useRef(null)

  const encoded = useMemo(() => encodeConfig(config), [config])

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href)
    url.searchParams.set('c', encoded)
    window.history.replaceState(null, '', url)
  }, [config, encoded])

  useEffect(() => {
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(content))
    } catch {
      /* ignore */
    }
  }, [content])

  useEffect(() => () => clearTimeout(copiedTimer.current), [])

  /* ---- edición del contrato ---- */

  const set = useCallback((path, value) => {
    setConfig((prev) => setIn(prev, path, value))
  }, [])

  const merge = useCallback((patch) => {
    setConfig((prev) => deepMerge(prev, patch))
  }, [])

  const applyPalette = useCallback(
    (id, paletteMode) => {
      merge({ palette: paletteValues(id, paletteMode), meta: { paletteId: id, mode: paletteMode } })
    },
    [merge],
  )

  const applyType = useCallback(
    (id) => {
      merge({ typography: getTypePairing(id).values, meta: { typeId: id } })
    },
    [merge],
  )

  const applyAesthetic = useCallback(
    (id) => {
      const { patch } = getAesthetic(id)
      merge({ aesthetic: id, ...patch, meta: { aestheticId: id } })
    },
    [merge],
  )

  const applyPreset = useCallback((preset) => {
    setConfig(normalizeConfig(preset.config))
  }, [])

  /* ---- exportación ---- */

  const flash = (key) => {
    setCopied(key)
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(null), 1600)
  }

  const copySpec = async () => {
    await navigator.clipboard.writeText(JSON.stringify({ config, content }, null, 2))
    flash('json')
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
            onApplyPalette={applyPalette}
            onApplyType={applyType}
            onApplyAesthetic={applyAesthetic}
            onApplyPreset={applyPreset}
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
          <div className="shell__actions">
            <button onClick={copySpec} type="button">
              {copied === 'json' ? 'Copiado' : 'Copiar spec'}
            </button>
            <button onClick={copyLink} type="button">
              {copied === 'link' ? 'Copiado' : 'Copiar enlace'}
            </button>
            <button
              onClick={() => setConfig(DEFAULT_CONFIG)}
              type="button"
              className="shell__reset"
              aria-label="Reiniciar diseño"
            >
              <Icon set="tabler" name="close" size={16} />
            </button>
          </div>
        </div>
        <PreviewFrame config={config} content={content} device={device} />
      </main>
    </div>
  )
}
