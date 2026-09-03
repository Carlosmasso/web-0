import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_CONFIG, normalizeConfig } from '../config/schema'
import { encodeConfig, decodeConfig } from '../config/encode'
import { DEFAULT_CONTENT } from '../content/defaults'
import { Sidebar } from './Sidebar'
import { PreviewFrame } from './PreviewFrame'
import { ChecklistPanel } from './ChecklistPanel'
import { Icon } from '../preview/Icon'

const STORAGE_KEY = 'web0.config'

function loadInitial() {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('c')
  if (fromUrl) {
    const decoded = decodeConfig(fromUrl)
    if (decoded) return decoded
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return normalizeConfig(JSON.parse(saved))
  } catch {
    /* ignore */
  }
  return DEFAULT_CONFIG
}

export function App() {
  const [config, setConfig] = useState(loadInitial)
  const [device, setDevice] = useState('desktop')
  const [showChecklist, setShowChecklist] = useState(false)
  const [copied, setCopied] = useState(null)
  const copiedTimer = useRef(null)

  const encoded = useMemo(() => encodeConfig(config), [config])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href)
    url.searchParams.set('c', encoded)
    window.history.replaceState(null, '', url)
  }, [config, encoded])

  useEffect(() => () => clearTimeout(copiedTimer.current), [])

  const update = useCallback((patch) => {
    setConfig((prev) => ({ ...prev, ...patch, sections: { ...prev.sections, ...patch.sections } }))
  }, [])

  const setSection = useCallback((type, variant) => {
    setConfig((prev) => ({ ...prev, sections: { ...prev.sections, [type]: variant } }))
  }, [])

  const flash = (key) => {
    setCopied(key)
    clearTimeout(copiedTimer.current)
    copiedTimer.current = setTimeout(() => setCopied(null), 1600)
  }

  const copyJson = async () => {
    // The spec: the client's design choices plus a content skeleton to fill in.
    const spec = { config, content: DEFAULT_CONTENT }
    await navigator.clipboard.writeText(JSON.stringify(spec, null, 2))
    flash('json')
  }

  const copyLink = async () => {
    const link = `${window.location.origin}/preview.html#${encoded}`
    await navigator.clipboard.writeText(link)
    flash('link')
  }

  const reset = () => setConfig(DEFAULT_CONFIG)

  return (
    <div className="shell">
      <aside className="shell__panel">
        <div className="shell__brand">
          <span className="shell__logo">Estudio</span>
          <p>Configura la web y compártela como propuesta.</p>
        </div>
        <Sidebar config={config} onUpdate={update} onSection={setSection} />
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
            <button
              onClick={() => setShowChecklist((v) => !v)}
              type="button"
              className={showChecklist ? 'is-active' : ''}
            >
              Contenido a pedir
            </button>
            <button onClick={copyJson} type="button">
              {copied === 'json' ? 'Copiado' : 'Copiar configuración'}
            </button>
            <button onClick={copyLink} type="button">
              {copied === 'link' ? 'Copiado' : 'Copiar enlace'}
            </button>
            <button onClick={reset} type="button" className="shell__reset" aria-label="Reiniciar">
              <Icon set="tabler" name="close" size={16} />
            </button>
          </div>
        </div>
        <div className="shell__stage-row">
          <PreviewFrame config={config} device={device} />
          <ChecklistPanel
            config={config}
            open={showChecklist}
            onClose={() => setShowChecklist(false)}
          />
        </div>
      </main>
    </div>
  )
}
