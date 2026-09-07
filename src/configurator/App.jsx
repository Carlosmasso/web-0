import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { DEFAULT_CONFIG, SECTION_ORDER } from '../config/schema'
import { isStudio, STUDIO_QUERY } from '../config/mode'
import { track } from '../config/analytics'
import { normalizeConfigWithGuardrails } from '../config/guardrails'
import { useHistory } from './useHistory'
import {
  ensureSeeded,
  readProject,
  writeProject,
  createProject,
  renameProject,
  deleteProject,
  listProjects,
  setActiveId,
} from './projects'
import { ProjectMenu } from './ProjectMenu'
import { Tour, TOUR_STEPS, isTourDone, markTourDone } from './Tour'
import { ErrorBoundary } from '../ErrorBoundary'
import { deepMerge, setIn } from '../config/patch'
import { encodeConfig, decodeConfig, encodeContent } from '../config/encode'
import { DEFAULT_CONTENT } from '../content/defaults'
import { getTypePairing } from '../registry/fonts'
import { getAesthetic } from '../registry/aesthetics'
import { safePalette } from '../theme/color'
import { randomConfig } from '../theme/randomize'
import { Sidebar } from './Sidebar'
import { ContentForm } from './ContentForm'
import { ContactModal } from './ContactModal'
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
  // En estudio, la config y el contenido salen del proyecto activo. En cliente,
  // de las claves planas de siempre (+ ?c= en la URL). El cliente no ve proyectos.
  const [projectId, setProjectId] = useState(() => (isStudio ? ensureSeeded() : null))
  const [, bumpRegistry] = useReducer((n) => n + 1, 0)

  const {
    state: raw,
    set: setRaw,
    reset: resetHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory(() => (isStudio ? readProject(projectId).config : loadConfig()))
  const [content, setContent] = useState(() =>
    isStudio ? readProject(projectId).content : loadContent(),
  )
  const [mode, setMode] = useState('design')
  const [device, setDevice] = useState('desktop')
  const [zipping, setZipping] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showTour, setShowTour] = useState(false)
  const [mnote, setMnote] = useState(() => {
    try {
      return sessionStorage.getItem('web0.mnote') !== '1'
    } catch {
      return true
    }
  })
  const [copied, setCopied] = useState(null)
  const copiedTimer = useRef(null)
  const frameRef = useRef(null)

  // El panel edita la configuración CRUDA, pero muestra y envía la NORMALIZADA.
  // Así el usuario ve al instante lo que los guardarraíles han corregido, en vez
  // de que su elección se revierta en silencio al llegar al lienzo.
  const { config, violations } = useMemo(() => normalizeConfigWithGuardrails(raw), [raw])

  const encoded = useMemo(() => encodeConfig(config), [config])

  useEffect(() => {
    if (isStudio && projectId) {
      writeProject(projectId, { config: raw, content })
    } else {
      try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(raw))
        localStorage.setItem(CONTENT_KEY, JSON.stringify(content))
      } catch {
        /* ignore */
      }
    }
    const url = new URL(window.location.href)
    url.searchParams.set('c', encoded)
    window.history.replaceState(null, '', url)
  }, [raw, content, encoded, projectId])

  useEffect(() => () => {
    clearTimeout(copiedTimer.current)
    clearTimeout(focusTimer.current)
  }, [])

  useEffect(() => {
    if (!isStudio) track('configurator_opened')
  }, [])

  // Tour de bienvenida: la primera vez que se abre (en cualquier modo), tras un
  // respiro para que el preview haya cargado. Una vez visto, no vuelve solo;
  // el botón "¿Cómo funciona?" o `?tour` lo relanzan.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('tour')) {
      setShowTour(true)
      return undefined
    }
    if (isTourDone()) return undefined
    const t = setTimeout(() => setShowTour(true), 700)
    return () => clearTimeout(t)
  }, [])

  const closeTour = useCallback(() => {
    setShowTour(false)
    markTourDone()
  }, [])

  // Deshacer / rehacer con teclado. Solo sobre el diseño: si el foco está en un
  // campo de texto, se cede el atajo al deshacer nativo del propio campo.
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'z') return
      const t = e.target
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      e.preventDefault()
      if (e.shiftKey) redo()
      else undo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  /* ---- edición ---- */

  const set = useCallback((path, value) => setRaw((prev) => setIn(prev, path, value)), [])
  const merge = useCallback((patch) => setRaw((prev) => deepMerge(prev, patch)), [])

  const applyPreset = useCallback((preset) => {
    setRaw(structuredClone(preset.config))
    if (!isStudio) track('preset_applied', { preset: preset.id })
  }, [])

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

  /* ---- secciones: visibilidad y orden ---- */

  const toggleSection = useCallback((type) => {
    if (type === 'hero') return
    setRaw((prev) => {
      const order = prev.sectionOrder?.length ? prev.sectionOrder : SECTION_ORDER
      const next = order.includes(type)
        ? order.filter((t) => t !== type)
        : [...order, type]
      return setIn(prev, 'sectionOrder', next)
    })
  }, [])

  const moveSection = useCallback((type, dir) => {
    setRaw((prev) => {
      const order = [...(prev.sectionOrder?.length ? prev.sectionOrder : SECTION_ORDER)]
      const i = order.indexOf(type)
      const j = i + dir
      // el hero (índice 0) no se cruza
      if (i < 1 || j < 1 || j >= order.length) return prev
      ;[order[i], order[j]] = [order[j], order[i]]
      return setIn(prev, 'sectionOrder', order)
    })
  }, [])

  /* ---- proyectos (solo estudio) ---- */

  const switchProject = useCallback(
    (id) => {
      const p = readProject(id)
      setActiveId(id)
      setProjectId(id)
      resetHistory(p.config)
      setContent(p.content)
    },
    [resetHistory],
  )

  const newProject = useCallback(() => {
    const id = createProject(`Proyecto ${listProjects().length + 1}`, {
      config: structuredClone(DEFAULT_CONFIG),
      content: structuredClone(DEFAULT_CONTENT),
    })
    switchProject(id)
  }, [switchProject])

  const duplicateProject = useCallback(() => {
    const current = listProjects().find((p) => p.id === projectId)
    const id = createProject(`${current?.name ?? 'Proyecto'} (copia)`, { config: raw, content })
    switchProject(id)
  }, [projectId, raw, content, switchProject])

  // Renombrar solo toca localStorage; el bump fuerza el re-render para que el
  // menú muestre el nombre nuevo.
  const renameCurrent = useCallback(
    (name) => {
      renameProject(projectId, name)
      bumpRegistry()
    },
    [projectId],
  )

  const deleteCurrent = useCallback(() => {
    const rest = listProjects().filter((p) => p.id !== projectId)
    if (!rest.length) return
    deleteProject(projectId)
    switchProject(rest[0].id)
  }, [projectId, switchProject])

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

  // El enlace lleva diseño + contenido (textos, secciones, imágenes por URL).
  // Las imágenes subidas se quedan fuera: un data URI no cabe en una URL.
  const previewLink = useMemo(
    () => `${window.location.origin}/preview.html#${encoded}~${encodeContent(content)}`,
    [encoded, content],
  )

  // Para ti: abre el preview de ese diseño en modo estudio, con el botón de
  // "Descargar proyecto (.zip)". Lleva config + contenido (imágenes subidas no).
  const editLink = useMemo(
    () =>
      `${window.location.origin}/preview.html${STUDIO_QUERY}#${encoded}~${encodeContent(content)}`,
    [encoded, content],
  )

  const copyLink = async () => {
    await navigator.clipboard.writeText(previewLink)
    flash('link')
  }

  const dismissMnote = () => {
    setMnote(false)
    try {
      sessionStorage.setItem('web0.mnote', '1')
    } catch {
      /* ignore */
    }
  }

  // Solo estudio. El código del export (JSZip incluido) se carga bajo demanda.
  const downloadZip = async () => {
    setZipping(true)
    try {
      const [{ buildProjectFiles }, { downloadProjectZip }] = await Promise.all([
        import('../export/scaffold'),
        import('../export/zip'),
      ])
      const { files, projectName } = buildProjectFiles(config, content)
      await downloadProjectZip(files, projectName)
    } finally {
      setZipping(false)
    }
  }


  return (
    <div className="shell">
      <aside className="shell__panel">
        {mnote && (
          <div className="shell__mnote">
            <span>El configurador va mejor desde un ordenador.</span>
            <button type="button" onClick={copyLink}>
              {copied === 'link' ? 'Enlace copiado' : 'Copiar enlace para seguir'}
            </button>
            <button
              type="button"
              className="shell__mnote-x"
              onClick={dismissMnote}
              aria-label="Cerrar aviso"
            >
              ✕
            </button>
          </div>
        )}
        <div className="shell__brand">
          {isStudio ? (
            <ProjectMenu
              projectId={projectId}
              onSwitch={switchProject}
              onNew={newProject}
              onDuplicate={duplicateProject}
              onRename={renameCurrent}
              onDelete={deleteCurrent}
            />
          ) : (
            <span className="shell__logo">Maqueta</span>
          )}
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
          <button
            type="button"
            className="design shell__help"
            onClick={() => {
              setMode('design')
              setShowTour(true)
            }}
          >
            ¿Cómo funciona?
          </button>
        </div>

        <ErrorBoundary
          fallback={(retry) => (
            <div className="panel-error">
              <p>Este panel ha fallado.</p>
              <button type="button" onClick={retry}>
                Reintentar
              </button>
            </div>
          )}
        >
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
              onToggleSection={toggleSection}
              onMoveSection={moveSection}
            />
          ) : (
            <ContentForm
              config={config}
              content={content}
              onChange={setContent}
              onReset={() => setContent(DEFAULT_CONTENT)}
            />
          )}
        </ErrorBoundary>

        <footer className="shell__legal">
          <a href="/aviso-legal.html" target="_blank" rel="noopener noreferrer">Aviso legal</a>
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">Privacidad</a>
          <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookies</a>
        </footer>
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

          {isStudio && violations.length > 0 && (
            <p className="shell__violations" title={violations.map((v) => v.reason).join('\n')}>
              {violations.length} ajuste{violations.length > 1 ? 's' : ''} automático
              {violations.length > 1 ? 's' : ''}
            </p>
          )}

          <div className="shell__actions">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="shell__undo"
              title="Deshacer (⌘Z)"
            >
              <Icon set="tabler" name="undo" size={15} />
              Deshacer
            </button>
            {canRedo && (
              <button
                type="button"
                onClick={redo}
                className="shell__redo"
                aria-label="Rehacer"
                title="Rehacer (⇧⌘Z)"
              >
                <Icon set="tabler" name="redo" size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setRaw(DEFAULT_CONFIG)}
              className="shell__reset"
              title="Vuelve al diseño por defecto (se puede deshacer)"
            >
              <Icon set="tabler" name="refresh" size={15} />
              Reiniciar
            </button>
            <button onClick={copyLink} type="button" className="shell__ghost">
              {copied === 'link' ? 'Copiado' : 'Copiar enlace'}
            </button>
            {isStudio && (
              <button
                onClick={downloadZip}
                type="button"
                className="shell__ghost shell__dl"
                disabled={zipping}
              >
                {zipping ? 'Empaquetando…' : 'Descargar .zip'}
              </button>
            )}
            <button
              onClick={() => {
                setShowContact(true)
                if (!isStudio) track('contact_opened')
              }}
              type="button"
              className="shell__cta"
            >
              Pedir presupuesto
            </button>
          </div>
        </div>

        <div className="shell__stage-row">
          <PreviewFrame ref={frameRef} config={config} content={content} device={device} />
        </div>
      </main>

      <ContactModal
        open={showContact}
        onClose={() => setShowContact(false)}
        content={content}
        previewLink={previewLink}
        editLink={editLink}
      />

      <Tour steps={TOUR_STEPS} open={showTour} onClose={closeTour} />
    </div>
  )
}
