import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Preview } from './preview/Preview'
import './styles/reset.css'
import './preview/demo.css'

createRoot(document.getElementById('preview')).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
)
