# CLAUDE.md

Guía para trabajar en este repositorio. **Maketa** (maketa.es): un configurador donde un
cliente arma su web —landing de una sola página— eligiendo preset, estética, paleta,
tipografía y una variante por sección, con vista previa en vivo. Cuando le gusta, pide
presupuesto y el estudio le entrega la web construida. **El cliente nunca se descarga el
proyecto.**

## Antes de empezar

- **Lee `PLAN.md`**: estado real, prioridades (P0/P1/P2), decisiones cerradas y la sección
  "Lo que NO hacemos". No reabras lo que ahí está descartado. Al cerrar una tarea,
  actualízalo (tachar, anotar lo aprendido, corregir decisiones en sitio).
- `README.md` es la documentación larga de arquitectura y producto; `SETUP.md`, el montaje
  de producción (Google Sheet + Apps Script, Resend, variables de Vercel).
- Todo en **español**: respuestas, copy, comentarios y documentos.
- **No hagas commits** sin visto bueno explícito de Carlos, cada vez.

## Comandos

Gestor de paquetes: **pnpm** (nunca npm ni npx; `pnpm dlx` en lugar de `npx`).

```bash
pnpm install
pnpm dev                 # http://localhost:5173 (modo estudio automático en local)
pnpm build               # vite build de las tres entradas a dist/
pnpm test                # vitest run (src/**/*.test.js, entorno node)
pnpm vitest run src/theme/resolve.test.js   # un solo archivo
pnpm verify:export       # genera un proyecto desde un preset, install + build reales (~40 s)
```

Ejecuta `verify:export` tras tocar cualquier cosa de `src/preview/` o `src/export/`: el
`.zip` copia esos fuentes tal cual. `/api/lead` no corre con `pnpm dev` (hace falta
`pnpm dlx vercel dev` o un deploy de preview).

## Arquitectura

Tres entradas en `vite.config.js`:

| Ruta | Qué es |
| --- | --- |
| `/` → `index.html` + `public/landing.css` | Landing estática, sin React |
| `/app.html` → `src/main.jsx` | El configurador (panel + lienzo). `?c=` lleva el diseño |
| `/preview.html` → `src/preview-main.jsx` | El sitio aislado en un iframe. Hash `#<config>~<contenido>` |

El preview vive en un iframe para que el responsive responda al ancho del lienzo y sus
estilos no toquen los del panel. Panel e iframe hablan por `postMessage`.

### El contrato y los dos canales

Todo gira alrededor de un objeto serializable (`src/config/schema.js`, `DEFAULT_CONFIG`,
`normalizeConfig`). Guarda **valores** resueltos (hex, familias), no ids de preset; `meta`
solo sirve al panel para marcar la opción activa.

- **Cosmético** (`palette`, `typography`, `borders`, `shadows`, `gradients`, `effects`,
  `layout`): `resolveTheme()` (`src/theme/resolve.js`, función pura) lo convierte en
  custom properties `--theme-*`, y `PreviewCanvas.jsx` las escribe con `setProperty` en un
  `useLayoutEffect`. Los componentes **no reciben la config**: leen `var(--theme-*)` desde
  CSS. Cero re-renders al cambiar un color — no rompas eso pasando valores cosméticos por
  props o contexto.
- **Estructural** (`aesthetic`, `motion`, `iconSet`, `sections`, `sectionOrder`,
  `components`): contexto de React (`useStructure()`); cambia el DOM que se monta.

El panel nunca muta: usa `setIn` / `deepMerge` de `src/config/patch.js`.
`normalizeConfigWithGuardrails()` (`src/config/guardrails.js`) corre **siempre** antes de
inyectar: acota rangos, fuerza fondo oscuro en cyberpunk, corrige incoherencias y garantiza
contraste WCAG. Regla: en los pasos 2 y 3 cada control hace exactamente lo que dice; el
guardarraíl recomienda, no bloquea ni cambia de estética.

### Mapa de carpetas

| Carpeta | Contenido |
| --- | --- |
| `src/config/` | Contrato, parches inmutables, `encode.js` (base64 url-safe para enlaces), guardarraíles, `mode.js` (estudio vs cliente), `analytics.js` |
| `src/theme/` | `resolve.js`, `color.js` (`safePalette`, contraste), `fonts.js` (Google Fonts bajo demanda), `randomize.js` (el dado), `export.js` (tokens, sin UI) |
| `src/registry/` | Catálogo: paletas, tipografías, las 6 estéticas, presets (`category`: `commercial` / `trend`), `sections.js` (tipo+variante → componente) y `vocabulary.js` (**único** sitio del lenguaje de cara al usuario, con `affects` para el resaltado) |
| `src/content/` | Contenido separado del diseño: `defaults.js`, `fields.js` (qué campos pide cada variante; fuente única), `checklist.js`, `image.js` (compresión a data URI), `sectores.js` (contenido de demostración por preset de sector) |
| `src/preview/` | El sitio real: `PreviewCanvas`, `DemoPage`, `Chrome` (nav + scroll a sección), `sections/*`, `nav-targets.js`, `Spotlight`. CSS en `styles/` (`tokens`, `elements`, `sections`, `aesthetics`, `states`); `demo.css` solo es el índice de `@import` |
| `src/configurator/` | El shell: `App.jsx`, `Sidebar` (pestaña Diseño, pasos en `DESIGN_STEPS`), `ContentForm` (pestaña Contenido), `useHistory`, `projects.js` + `ProjectMenu` + `incoming.js` (guardado en `localStorage`), `ContactModal`, `Tour` |
| `src/export/` | `scaffold.js` construye el `.zip` con los **mismos fuentes** del preview vía `?raw` (CSS resuelto con `?inline`); `contact.js` → `submitLead()` |
| `api/lead.js` | Función serverless de Vercel: filtro anti-spam, fila en Google Sheet, aviso por Resend |
| `apps-script/` | El script de la Sheet de leads |
| `scripts/social/` | Catálogos de los reels: negocios, formatos (gancho, frases y cambios de cada reel, como datos) y la cola de publicación |
| `video/` | Subproyecto de Remotion con sus propias dependencias (`cd video && pnpm install`): la plantilla maestra de reels (`src/plantilla/`, con el sitio real en una tarjeta flotante), el vídeo de marca y `pnpm reels N` para renderizar una semana. Ver su README |

Si añades un componente al runtime del sitio, regístralo también en `scaffold.js`; el test
`export-integrity` comprueba que cada import relativo del `.zip` cierra y que nada arrastra
el configurador. Una sección nueva requiere entrada en `registry/sections.js`,
`SECTION_META` (`registry/options.js`), `DEFAULT_CONFIG` y `content/fields.js`.

### Modo estudio y modo cliente

`isStudio` (`src/config/mode.js`): automático en dev/localhost; en el deploy solo con
`?studio=<REACT_STUDIO_KEY>` exacta (expuesta por `envPrefix: ['VITE_', 'REACT_']`; es
ofuscación, no seguridad). El estudio añade proyectos sin tope, descarga del `.zip`, chip de
ajustes automáticos y utilidades de Contenido. El cliente ve **versiones** (máximo tres) en
vez de proyectos; se le reencuadra el lenguaje pero no se le recortan funciones que el
estudio tiene salvo las de entrega.

Regla del enlace entrante (`incoming.js`): un `?c=` **nunca pisa lo guardado**; si coincide
por huella con una versión existente se abre esa, si no entra como "Diseño recibido".

Contenido de demostración (`sectores.js`): al aplicar un preset de sector, el contenido solo
se sustituye si sigue siendo uno de los de demostración; en cuanto el usuario escribe algo
suyo, el preset solo cambia el diseño.

## Reglas de producto que condicionan el código

- La web **no vende ni cobra**: el contacto es una petición de lead. Nada de precios,
  pagos ni `LocalBusiness` en el JSON-LD.
- Las webs generadas son **una sola página**: el menú baja a secciones (`navTargets()` +
  `goToSection`, por JS porque un ancla nativa borraría el diseño del hash). Ningún enlace
  puede quedarse muerto.
- El panel de cliente se mantiene **mínimo**: lo que solo importa dentro de una estética lo
  fija el preset, no un control nuevo. Los controles de cliente van como botón con texto
  visible, no como atajo de teclado o icono suelto.
- Imágenes de stock: Pexels, enlazadas por URL (sin descargar archivos).
- `og:image` debe ser URL absoluta; `og.png` se regenera capturando `public/og.html` a 1200×630.

## Reels y vídeo

Los reels de Instagram y TikTok salen de la plantilla de Remotion de `video/src/plantilla/`,
con el acabado del vídeo de marca `IntroMaketa`. Es una decisión tomada tras dos correcciones;
antes de proponer otro estilo, lee `video/README.md` ("Tres reglas de acabado"):

- Tres escenas: gancho sobre fondo tinta, demo con la web **real** en una tarjeta y la pastilla
  que dice qué cambia, y el cierre del intro. Los cambios de la web se funden, no saltan.
- Los muelles de `video/src/marca.js`, Inter 700 y el azul de la marca como único acento. Nada de
  subtítulos en mayúsculas con contorno, amarillos ni rebotes.
- Voz en primera persona: "Diséñala tú. Yo la construyo."
- Un reel nuevo es **datos**: un formato en `scripts/social/lib/formatos.mjs` o una copia de
  `video/src/plantilla/ejemplo.js`. `cd video && pnpm reels N` renderiza la semana N.

## Tests

Vitest en entorno `node` con `css: true` (el test del scaffold necesita el CSS real). Cubren
`encode`/`decode`, `normalizeConfig`, guardarraíles (todos los presets cumplen WCAG),
`resolveTheme`, proyectos y enlace entrante, `nav-targets`, el anti-spam de `/api/lead`,
contenido por sector y la integridad del `.zip`. `export-build.test.js` solo corre con
`verify:export`.
