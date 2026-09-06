import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Two entry points: the configurator shell (index.html) and the
// isolated preview canvas (preview.html) that the shell embeds in an iframe.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
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
