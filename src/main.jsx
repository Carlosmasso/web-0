import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './configurator/App'
import './styles/reset.css'
import './configurator/shell.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
