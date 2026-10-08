import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

/** La web montándose por piezas mientras el lienzo carga. */
function StageLoading() {
  return (
    <div className="stage__loading" aria-hidden="true">
      <div className="sk">
        <div className="sk__nav">
          <i className="sk__logo" />
          <i className="sk__link" />
          <i className="sk__link" />
          <i className="sk__pill" />
        </div>
        <div className="sk__hero">
          <i className="sk__kicker" />
          <i className="sk__title" />
          <i className="sk__title sk__title--short" />
          <i className="sk__text" />
          <div className="sk__ctas">
            <i className="sk__btn" />
            <i className="sk__btn sk__btn--ghost" />
          </div>
        </div>
        <div className="sk__cards">
          <i className="sk__card" />
          <i className="sk__card" />
          <i className="sk__card" />
        </div>
      </div>
      <p className="sk__label">Montando tu web…</p>
    </div>
  )
}

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
      }
      // El lienzo avisa cuando ya tiene su letra y su foto: hasta entonces se
      // ve la web montándose, no una página a medio cargar.
      if (event.data?.type === 'preview-painted') setPainted(true)
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
        <StageLoading />
      </div>
    </div>
  )
})
