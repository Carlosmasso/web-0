import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CONFIG } from '../config/schema'
import { normalizeConfigWithGuardrails } from '../config/guardrails'
import { decodeConfig } from '../config/encode'
import { DEFAULT_CONTENT } from '../content/defaults'
import { PreviewCanvas } from './PreviewCanvas'
import { DemoPage } from './DemoPage'
import { Spotlight } from './Spotlight'

// Corre dentro de preview.html. Recibe { config, content } por postMessage
// desde el configurador, y cae al hash de la URL para que un enlace
// compartido renderice por su cuenta.
export function Preview() {
  const [raw, setRaw] = useState(() => {
    const hash = window.location.hash.slice(1)
    return (hash && decodeConfig(hash)) || DEFAULT_CONFIG
  })
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [focus, setFocus] = useState(null)

  useEffect(() => {
    function onMessage(event) {
      if (event.data?.type === 'config' && event.data.config) {
        setRaw(event.data.config)
        if (event.data.content) setContent(event.data.content)
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
  const config = useMemo(
    () => normalizeConfigWithGuardrails(raw, { unlockAdvanced: raw?.advanced?.unlocked }).config,
    [raw],
  )

  return (
    <>
      <PreviewCanvas config={config}>
        <DemoPage content={content} />
      </PreviewCanvas>
      <Spotlight selector={focus?.selector} label={focus?.label} scrollTo={focus?.scrollTo} />
    </>
  )
}
