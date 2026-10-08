import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CONFIG } from '../config/schema'
import { normalizeConfigWithGuardrails } from '../config/guardrails'
import { decodeConfig, decodeContent } from '../config/encode'
import { DEFAULT_CONTENT } from '../content/defaults'
import { isStudio } from '../config/mode'
import { PreviewCanvas } from './PreviewCanvas'
import { DemoPage } from './DemoPage'
import { Spotlight } from './Spotlight'

// Corre dentro de preview.html. Recibe { config, content } por postMessage
// desde el configurador, y cae al hash de la URL para que un enlace
// compartido renderice por su cuenta.
export function Preview() {
  const [raw, setRaw] = useState(() => {
    const h = window.location.hash.slice(1).split('~')[0]
    return (h && decodeConfig(h)) || DEFAULT_CONFIG
  })
  const [content, setContent] = useState(() => {
    const h = window.location.hash.slice(1).split('~')[1]
    return (h && decodeContent(h)) || DEFAULT_CONTENT
  })
  const [focus, setFocus] = useState(null)
  const [zipping, setZipping] = useState(false)

  // Cuándo la web está lista para enseñarse: con su tipografía, para que no
  // cambie de letra delante del usuario. La foto no se espera (llega sola y
  // esperarla hacía la carga más lenta) y la letra, como mucho 1,2 s.
  const [firstConfig, setFirstConfig] = useState(false)
  useEffect(() => {
    if (!firstConfig) return undefined
    let done = false
    const finish = () => {
      if (done) return
      done = true
      window.parent?.postMessage({ type: 'preview-painted' }, '*')
    }
    const timer = setTimeout(finish, 1200)
    requestAnimationFrame(() => {
      Promise.resolve(document.fonts?.ready).then(() => requestAnimationFrame(finish))
    })
    return () => clearTimeout(timer)
  }, [firstConfig])

  useEffect(() => {
    function onMessage(event) {
      if (event.data?.type === 'config' && event.data.config) {
        setRaw(event.data.config)
        if (event.data.content) setContent(event.data.content)
        setFirstConfig(true)
      }
      // El panel avisa de qué está tocando el usuario para que el lienzo
      // se explique solo.
      if (event.data?.type === 'focus') {
        setFocus(event.data.affects ?? null)
      }
    }
    window.addEventListener('message', onMessage)
    window.parent?.postMessage({ type: 'preview-ready' }, '*')
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Los guardarraíles corren SIEMPRE justo antes de inyectar, sea cual sea el
  // origen del dato: panel, hash compartido o base de datos. Nada llega al
  // lienzo sin pasar por aquí.
  const config = useMemo(() => normalizeConfigWithGuardrails(raw).config, [raw])

  // Solo en `?studio`: descargar el proyecto de este diseño. El código del
  // export (JSZip incluido) se carga bajo demanda para no engordar el preview
  // que también ven los clientes.
  const download = async () => {
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
    <>
      <PreviewCanvas config={config}>
        <DemoPage content={content} />
      </PreviewCanvas>
      <Spotlight selector={focus?.selector} label={focus?.label} scrollTo={focus?.scrollTo} />

      {isStudio && (
        <button type="button" onClick={download} disabled={zipping} style={studioBtn}>
          {zipping ? 'Empaquetando…' : '⬇ Descargar proyecto (.zip)'}
        </button>
      )}
    </>
  )
}

const studioBtn = {
  position: 'fixed',
  bottom: 16,
  left: 16, // a la izquierda: los botones flotantes del sitio van a la derecha
  zIndex: 99999,
  padding: '10px 16px',
  font: '600 13px/1 system-ui, sans-serif',
  color: '#fff',
  background: '#16171b',
  border: '1px solid #3b3d47',
  borderRadius: 999,
  cursor: 'pointer',
  boxShadow: '0 8px 24px -6px rgba(0,0,0,0.5)',
}
