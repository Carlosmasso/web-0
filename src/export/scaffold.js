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
// fuera: ese es el trabajo de Maqueta, no del sitio entregado.
// ============================================================

import previewCanvas from '../preview/PreviewCanvas.jsx?raw'
import demoPage from '../preview/DemoPage.jsx?raw'
import chrome from '../preview/Chrome.jsx?raw'
import reveal from '../preview/Reveal.jsx?raw'
import icon from '../preview/Icon.jsx?raw'
import ui from '../preview/ui.jsx?raw'
// `?inline` en vez de `?raw`: demo.css es solo un índice de @import, y así el
// export recibe el CSS ya resuelto en un único archivo, sin tener que listar
// cada parcial aquí.
import demoCss from '../preview/demo.css?inline'
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

const IMG_EXT = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

/**
 * Saca las imágenes SUBIDAS (data URIs) del contenido a archivos en
 * `public/img/` y deja la ruta en su lugar (`/img/hero-image.webp`). Vite sirve
 * `public/` en la raíz y lo copia a `dist/`, así que quedan como imágenes
 * normales, reemplazables. Las imágenes puestas por URL no se tocan.
 *
 * @returns {{ content: object, assets: Record<string, {base64: string}> }}
 */
function extractImages(content) {
  const assets = {}
  const used = new Set()

  const nameFor = (path, ext) => {
    const base =
      path
        .replace(/\.(items|quotes|plans|groups)\./g, '.')
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase() || 'imagen'
    let name = `${base}.${ext}`
    for (let i = 2; used.has(name); i++) name = `${base}-${i}.${ext}`
    used.add(name)
    return name
  }

  const walk = (node, path) => {
    if (typeof node === 'string') {
      const m = /^data:(image\/[a-z.+-]+);base64,(.+)$/is.exec(node)
      if (!m) return node
      const file = nameFor(path, IMG_EXT[m[1].toLowerCase()] || 'bin')
      assets[`public/img/${file}`] = { base64: m[2] }
      return `/img/${file}`
    }
    if (Array.isArray(node)) return node.map((v, i) => walk(v, `${path}.${i}`))
    if (node && typeof node === 'object') {
      const out = {}
      for (const [k, v] of Object.entries(node)) out[k] = walk(v, path ? `${path}.${k}` : k)
      return out
    }
    return node
  }

  return { content: walk(content, ''), assets }
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
  return `// Generado por Maqueta a partir de tu configuración. Es JSON plano: puedes
// seguir afinando colores, tipografía o textos aquí a mano, sin volver al
// configurador.

export const SITE_CONFIG = ${JSON.stringify(config, null, 2)}

export const SITE_CONTENT = ${JSON.stringify(content, null, 2)}
`
}

function readme(brandName) {
  return `# ${brandName}

Generado con Maqueta. Es un proyecto de React + Vite normal, sin dependencia
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
- **Textos** → \`src/site.config.js\`, objeto \`SITE_CONTENT\`.
- **Imágenes** → \`public/img/\` (reemplaza el archivo por el tuyo), o cambia la
  ruta en \`SITE_CONTENT\` por una URL.
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
  const description = content?.hero?.subtitle || `${brandName}, construido con Maqueta.`
  const fontsHref = googleFontsHref(config)

  // Las imágenes subidas salen del JSON a archivos en public/img/.
  const { content: cleanContent, assets } = extractImages(content)

  const files = {
    ...RUNTIME_FILES,
    ...assets,
    'package.json': packageJson(projectName),
    'vite.config.js': viteConfig(),
    'index.html': indexHtml({ brandName, description, fontsHref }),
    'src/main.jsx': mainJsx(),
    'src/site.config.js': siteConfigJs(config, cleanContent),
    'README.md': readme(brandName),
    '.gitignore': gitignore(),
  }

  return { files, projectName }
}
