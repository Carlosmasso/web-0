import { useEffect, useState } from 'react'
import { DEFAULT_CONFIG, normalizeConfig } from '../config/schema'
import { decodeConfig } from '../config/encode'
import { DEFAULT_CONTENT } from '../content/defaults'
import { PreviewCanvas } from './PreviewCanvas'
import { DemoPage } from './DemoPage'

// Corre dentro de preview.html. Recibe { config, content } por postMessage
// desde el configurador, y cae al hash de la URL para que un enlace
// compartido renderice por su cuenta.
export function Preview() {
  const [config, setConfig] = useState(() => {
    const hash = window.location.hash.slice(1)
    return (hash && decodeConfig(hash)) || DEFAULT_CONFIG
  })
  const [content, setContent] = useState(DEFAULT_CONTENT)

  useEffect(() => {
    function onMessage(event) {
      if (event.data?.type === 'config' && event.data.config) {
        setConfig(normalizeConfig(event.data.config))
        if (event.data.content) setContent(event.data.content)
      }
    }
    window.addEventListener('message', onMessage)
    window.parent?.postMessage({ type: 'preview-ready' }, '*')
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <PreviewCanvas config={config}>
      <DemoPage content={content} />
    </PreviewCanvas>
  )
}
