import { Component } from 'react'

// Boundary de React (tiene que ser clase). Si algo revienta —un componente de
// sección con contenido raro, una config vieja de un enlace— el usuario ve un
// aviso con salida, no una pantalla en blanco.
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[Maqueta] error capturado por ErrorBoundary:', error, info?.componentStack)
  }

  retry = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback) return this.props.fallback(this.retry)

    return (
      <div
        role="alert"
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100%',
          padding: 24,
          font: '14px/1.5 system-ui, sans-serif',
          color: '#eaebef',
          background: '#131418',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 320 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Algo ha ido mal aquí.</p>
          <p style={{ margin: '0 0 16px', color: '#989ca7' }}>
            Puedes reintentar; si sigue fallando, recarga la página.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button type="button" onClick={this.retry} style={btn(true)}>
              Reintentar
            </button>
            <button type="button" onClick={() => window.location.reload()} style={btn(false)}>
              Recargar
            </button>
          </div>
        </div>
      </div>
    )
  }
}

const btn = (primary) => ({
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 8,
  border: primary ? 'none' : '1px solid #3b3d47',
  color: primary ? '#fff' : '#eaebef',
  background: primary ? '#4c66e6' : 'transparent',
  cursor: 'pointer',
})
