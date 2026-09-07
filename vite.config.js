import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Tres entradas:
//   index.html    — la landing (HTML estático, sin React).
//   app.html      — el configurador (panel + lienzo).
//   preview.html  — el lienzo aislado que el configurador embebe en un iframe.
export default defineConfig({
  plugins: [react()],
  // Vite solo expone `VITE_*` a `import.meta.env` del cliente. Añadimos `REACT_`
  // para `REACT_STUDIO_KEY` (la clave del modo estudio). Ojo: sigue siendo
  // público — acaba en el bundle igual que una `VITE_*`.
  envPrefix: ['VITE_', 'REACT_'],
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        preview: resolve(__dirname, 'preview.html'),
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
    // Procesa el CSS de verdad: el test del scaffold necesita ver el contenido
    // que `?raw` / `?inline` meten en el .zip.
    css: true,
  },
})
