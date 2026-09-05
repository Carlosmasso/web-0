// ============================================================
// EL PROYECTO DESCARGABLE
//
// No es una reimplementación estática del sitio: son los MISMOS ficheros
// fuente que corren en el preview, copiados verbatim vía `?raw` de Vite. Si
// mañana cambias un componente, el export lo lleva sin que nadie tenga que
// acordarse de actualizar una plantilla en paralelo.
//
// Solo entra el árbol de RUNTIME (lo que pinta el sitio). El configurador
// —guardarraíles, registries de presets, formulario de contenido— se queda
// fuera: ese es el trabajo de Estudio, no del sitio entregado.
// ============================================================

import previewCanvas from '../preview/PreviewCanvas.jsx?raw'
import demoPage from '../preview/DemoPage.jsx?raw'
import chrome from '../preview/Chrome.jsx?raw'
import reveal from '../preview/Reveal.jsx?raw'
import icon from '../preview/Icon.jsx?raw'
import ui from '../preview/ui.jsx?raw'
import demoCss from '../preview/demo.css?raw'
import resetCss from '../styles/reset.css?raw'
import schema from '../config/schema.js?raw'
import sectionsRegistry from '../registry/sections.js?raw'
import contentContext from '../content/context.js?raw'
import contentDefaults from '../content/defaults.js?raw'
import resolveTheme from '../theme/resolve.js?raw'
import fonts from '../theme/fonts.js?raw'

import heroSrc from '../preview/sections/Hero.jsx?raw'
import logosSrc from '../preview/sections/Logos.jsx?raw'
import featuresSrc from '../preview/sections/Features.jsx?raw'
import carouselSrc from '../preview/sections/Carousel.jsx?raw'
import pricingSrc from '../preview/sections/Pricing.jsx?raw'
import testimonialSrc from '../preview/sections/Testimonial.jsx?raw'
import faqSrc from '../preview/sections/Faq.jsx?raw'
import ctaSrc from '../preview/sections/Cta.jsx?raw'

import { familyOf } from '../theme/fonts'
import pkgJson from '../../package.json?raw'

const RUNTIME_FILES = {
  'src/preview/PreviewCanvas.jsx': previewCanvas,
  'src/preview/DemoPage.jsx': demoPage,
  'src/preview/Chrome.jsx': chrome,
  'src/preview/Reveal.jsx': reveal,
  'src/preview/Icon.jsx': icon,
  'src/preview/ui.jsx': ui,
  'src/preview/demo.css': demoCss,
  'src/preview/sections/Hero.jsx': heroSrc,
  'src/preview/sections/Logos.jsx': logosSrc,
  'src/preview/sections/Features.jsx': featuresSrc,
  'src/preview/sections/Carousel.jsx': carouselSrc,
  'src/preview/sections/Pricing.jsx': pricingSrc,
  'src/preview/sections/Testimonial.jsx': testimonialSrc,
  'src/preview/sections/Faq.jsx': faqSrc,
  'src/preview/sections/Cta.jsx': ctaSrc,
  'src/styles/reset.css': resetCss,
  'src/config/schema.js': schema,
  'src/registry/sections.js': sectionsRegistry,
  'src/content/context.js': contentContext,
  'src/content/defaults.js': contentDefaults,
  'src/theme/resolve.js': resolveTheme,
  'src/theme/fonts.js': fonts,
}

const slugify = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // diacríticos sueltos tras la normalización
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sitio'

function googleFontsHref(config) {
  const families = [config.typography.headingFamily, config.typography.bodyFamily]
    .map(familyOf)
    .filter(Boolean)
  const unique = [...new Set(families)]
  if (unique.length === 0) return null
  const query = unique
    .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;500;600;700;800`)
    .join('&')
  return `https://fonts.googleapis.com/css2?${query}&display=swap`
}

function packageJson(name) {
  const { dependencies } = JSON.parse(pkgJson)
  return JSON.stringify(
    {
      name,
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
      dependencies,
      devDependencies: { '@vitejs/plugin-react': '^4.3.4', vite: '^6.0.7' },
    },
    null,
    2,
  )
}

function viteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`
}

function indexHtml({ brandName, description, fontsHref }) {
  const fontLinks = fontsHref
    ? `\n    <link rel="preconnect" href="https://fonts.googleapis.com" />\n` +
      `    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n` +
      `    <link rel="stylesheet" href="${fontsHref}" />`
    : ''

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:," />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${brandName}</title>
    <meta name="description" content="${description}" />${fontLinks}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`
}

function mainJsx() {
  return `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PreviewCanvas } from './preview/PreviewCanvas'
import { DemoPage } from './preview/DemoPage'
import { SITE_CONFIG, SITE_CONTENT } from './site.config'
import './styles/reset.css'
import './preview/demo.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreviewCanvas config={SITE_CONFIG}>
      <DemoPage content={SITE_CONTENT} />
    </PreviewCanvas>
  </StrictMode>,
)
`
}

function siteConfigJs(config, content) {
  return `// Generado por Estudio a partir de tu configuración. Es JSON plano: puedes
// seguir afinando colores, tipografía o textos aquí a mano, sin volver al
// configurador.

export const SITE_CONFIG = ${JSON.stringify(config, null, 2)}

export const SITE_CONTENT = ${JSON.stringify(content, null, 2)}
`
}

function readme(brandName) {
  return `# ${brandName}

Generado con Estudio. Es un proyecto de React + Vite normal, sin dependencia
del configurador: los componentes de \`src/preview/\` son los mismos que
viste en la vista previa.

## Arranque

\`\`\`bash
npm install
npm run dev       # http://localhost:5173
npm run build      # genera dist/, listo para subir a cualquier hosting estático
\`\`\`

## Qué tocar

- **Colores, tipografía, bordes, sombras** → \`src/site.config.js\`, objeto \`SITE_CONFIG\`.
- **Textos e imágenes** → \`src/site.config.js\`, objeto \`SITE_CONTENT\`.
- **Estructura de cada sección** (qué variante, o el propio maquetado) → los
  componentes en \`src/preview/sections/\`.
- **Qué secciones aparecen y en qué orden** → \`src/preview/DemoPage.jsx\`
  y \`SECTION_ORDER\` en \`src/config/schema.js\`.
`
}

function gitignore() {
  return 'node_modules\ndist\n.DS_Store\n'
}

/**
 * @param {object} config  configuración normalizada (post guardarraíles)
 * @param {object} content contenido del cliente
 * @returns {{ files: Record<string,string>, projectName: string }}
 */
export function buildProjectFiles(config, content) {
  const brandName = content?.brand?.name || 'Mi sitio'
  const projectName = slugify(brandName)
  const description = content?.hero?.subtitle || `${brandName}, construido con Estudio.`
  const fontsHref = googleFontsHref(config)

  const files = {
    ...RUNTIME_FILES,
    'package.json': packageJson(projectName),
    'vite.config.js': viteConfig(),
    'index.html': indexHtml({ brandName, description, fontsHref }),
    'src/main.jsx': mainJsx(),
    'src/site.config.js': siteConfigJs(config, content),
    'README.md': readme(brandName),
    '.gitignore': gitignore(),
  }

  return { files, projectName }
}
