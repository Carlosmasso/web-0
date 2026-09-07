import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

// Puente hacia el lienzo aislado. Envía { config, content } en cada cambio y
// expone `focus()` para que el panel pueda señalar en el sitio qué toca cada
// control.
export const PreviewFrame = forwardRef(function PreviewFrame({ config, content, device }, ref) {
  const frameRef = useRef(null)
  const readyRef = useRef(false)
  const dataRef = useRef({ config, content })
  dataRef.current = { config, content }
  // Tapa el iframe hasta que ha recibido la primera config: si no, se ve un
  // fogonazo del demo con el tema por defecto antes de saltar al real.
  const [painted, setPainted] = useState(false)

  const send = (message) => frameRef.current?.contentWindow?.postMessage(message, '*')

  useEffect(() => {
    function onMessage(event) {
      if (event.data?.type === 'preview-ready') {
        readyRef.current = true
        post()
        // Un frame para que el lienzo pinte la config recién recibida.
        requestAnimationFrame(() => requestAnimationFrame(() => setPainted(true)))
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
    <div className={`stage stage--${device}`} data-painted={painted}>
      <div className="stage__device">
        <iframe ref={frameRef} src="/preview.html" title="Vista previa de la web" />
        {!painted && <div className="stage__loading" aria-hidden="true" />}
      </div>
    </div>
  )
})
