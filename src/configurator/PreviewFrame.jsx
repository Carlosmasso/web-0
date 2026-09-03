import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Puente hacia el lienzo aislado. Envía { config, content } en cada cambio y
// expone `focus()` para que el panel pueda señalar en el sitio qué toca cada
// control.
export const PreviewFrame = forwardRef(function PreviewFrame({ config, content, device }, ref) {
  const frameRef = useRef(null)
  const readyRef = useRef(false)
  const dataRef = useRef({ config, content })
  dataRef.current = { config, content }

  const send = (message) => frameRef.current?.contentWindow?.postMessage(message, '*')

  useEffect(() => {
    function onMessage(event) {
      if (event.data?.type === 'preview-ready') {
        readyRef.current = true
        post()
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function post() {
    const { config, content } = dataRef.current
    send({ type: 'config', config, content })
  }

  useEffect(() => {
    if (readyRef.current) post()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, content])

  useImperativeHandle(ref, () => ({
    focus: (affects) => send({ type: 'focus', affects: affects ?? null }),
  }))

  return (
    <div className={`stage stage--${device}`}>
      <div className="stage__device">
        <iframe ref={frameRef} src="/preview.html" title="Vista previa de la web" />
      </div>
    </div>
  )
})
