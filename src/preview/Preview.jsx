import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DEFAULT_CONFIG } from '../config/schema'
import { decodeConfig } from '../config/encode'
import { applyTokens } from '../tokens/applyTokens'
import { DEFAULT_CONTENT } from '../content/defaults'
import { DemoPage } from './DemoPage'

// Runs inside preview.html. Receives config by postMessage from the
// configurator, and falls back to the URL hash so a shared link renders
// standalone.
export function Preview() {
  const [config, setConfig] = useState(() => {
    const hash = window.location.hash.slice(1)
    return (hash && decodeConfig(hash)) || DEFAULT_CONFIG
  })
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const rootRef = useRef(null)

  useEffect(() => {
    function onMessage(event) {
      if (event.data?.type === 'config' && event.data.config) {
        setConfig(event.data.config)
        if (event.data.content) setContent(event.data.content)
      }
    }
    window.addEventListener('message', onMessage)
    window.parent?.postMessage({ type: 'preview-ready' }, '*')
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useLayoutEffect(() => {
    if (rootRef.current) {
      applyTokens(rootRef.current, config, document)
      document.body.dataset.mode = config.mode
    }
  }, [config])

  return (
    <div className="preview-root" ref={rootRef}>
      <DemoPage config={config} content={content} />
    </div>
  )
}
