import { useEffect, useRef } from 'react'

// Bridges config into the isolated preview iframe. Waits for the frame to
// announce itself, then pushes on every change.
export function PreviewFrame({ config, device }) {
  const frameRef = useRef(null)
  const readyRef = useRef(false)

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
    frameRef.current?.contentWindow?.postMessage({ type: 'config', config }, '*')
  }

  useEffect(() => {
    if (readyRef.current) post()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  return (
    <div className={`stage stage--${device}`}>
      <div className="stage__device">
        <iframe ref={frameRef} src="/preview.html" title="Vista previa de la web" />
      </div>
    </div>
  )
}
