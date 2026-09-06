import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Tres entradas:
//   index.html    — la landing (HTML estático, sin React).
//   app.html      — el configurador (panel + lienzo).
//   preview.html  — el lienzo aislado que el configurador embebe en un iframe.
export default defineConfig({
  plugins: [react()],
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
