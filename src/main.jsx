import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './configurator/App'
import { ErrorBoundary } from './ErrorBoundary'
import './styles/reset.css'
import './configurator/shell.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
