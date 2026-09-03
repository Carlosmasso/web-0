# Estudio — configurador de webs a medida

Prototipo de un marketplace donde un cliente arma su web eligiendo paleta,
tipografía, esquinas, densidad, iconos, efectos y una variante por sección.
La vista previa se renderiza en vivo y el resultado se exporta como una
configuración (JSON) que sirve de brief para el build final.

## Arranque

```bash
npm install
npm run dev      # http://localhost:5173
```

- `/` — el configurador (panel + lienzo).
- `/preview.html#<config>` — la vista previa sola, para compartir por enlace.

## El motor de estilos: dos canales

Todo gira alrededor de **un contrato serializable** (`src/config/schema.js`). Cada
decisión pertenece a uno de dos canales y viaja por una vía distinta:

| Canal | Qué contiene | Cómo viaja | Coste |
| --- | --- | --- | --- |
| **Cosmético** | `palette` `typography` `borders` `shadows` `gradients` `effects` `layout` | Custom properties escritas por `ref` sobre un solo nodo | 0 re-renders |
| **Estructural** | `aesthetic` `motion` `iconSet` `sections` `components` | Contexto de React con identidad estable | Solo el componente afectado |

```jsonc
{
  "version": 1,
  "aesthetic": "glassmorphism",     // neo-brutalism | glassmorphism | claymorphism
                                    // cyberpunk | minimalist-flat | material-clean
  "palette":  { "primary": "#7c3aed", "neutralBg": "#0f0b2e", "textPrimary": "#f3f0ff", … },
  "borders":  { "radius": "round", "width": "thin", "style": "solid", "color": "auto" },
  "shadows":  { "style": "soft-elevation", "color": "auto", "intensity": 1.5 },
  "gradients": { "primaryGradient": { "type": "linear", "angle": 118, "stops": [...] },
                 "backgroundGradient": { "type": "radial", "position": "…", "stops": [...] } },
  "components": { "hero": { "background": "aurora" },
                  "button": { "shape": "pill", "fill": "gradient" }, … }
}
```

El contrato guarda **valores** (hex, familias), no identificadores de preset: es
portable y autodescriptivo. `meta` solo registra de qué preset salieron para que el
panel marque la opción activa; el motor lo ignora.

- **`src/theme/resolve.js`** — función pura `resolveTheme(config)` → mapa de
  `--theme-*`. Recetas de sombra parametrizadas por intensidad, degradados
  lineal/radial/cónico, derivación de color con `color-mix()` nativo (cero librerías).
- **`src/preview/PreviewCanvas.jsx`** — escribe las propiedades con `setProperty` en un
  `useLayoutEffect`. Los hijos **no reciben la config**: leen `var(--theme-*)` desde CSS.
  Por eso cambiar un color no reconcilia ni un nodo.
- **`demo.css`** — los bloques `[data-aesthetic="…"]` no son cosmética: definen qué
  significa `:active`. En neo-brutalismo el botón cae sobre su sombra dura; en cyberpunk
  un destello barre la superficie; en claymorfismo se hunde con sombra interior; en
  material se eleva y aterriza.

**Dos niveles de elección**: las 6 *estéticas* (`registry/aesthetics.js`) parchean solo
el acabado sobre la paleta que el cliente ya eligió; las *plantillas*
(`registry/presets.js`) fijan una configuración entera de golpe.

| Pieza | Rol |
| --- | --- |
| `src/config/` | El contrato (`schema.js`), sus utilidades inmutables (`patch.js`) y la codificación para enlaces (`encode.js`). |
| `src/theme/` | `resolve.js` traduce el contrato a custom properties; `fonts.js` carga familias de Google bajo demanda, una vez por documento. |
| `src/registry/` | Catálogo del marketplace: paletas, emparejamientos tipográficos, las 6 estéticas, las plantillas completas y el mapa sección→componente. |
| `src/content/` | Capa de contenido, separada del diseño. `defaults.js` es el relleno; `fields.js` define qué campos pide cada sección según su variante (fuente única); `checklist.js` deriva de ahí la lista a pedir al cliente. |
| `src/preview/` | El sitio (componentes de producción). `PreviewCanvas.jsx` inyecta los tokens y provee el canal estructural; cada sección lee `useStructure()` y `useContent()`. |
| `src/configurator/` | El shell con dos pestañas: **Diseño** (`Sidebar`, cara al cliente) y **Contenido** (`ContentForm`, cara a ti). `App` persiste config y contenido en `localStorage`, y la config también en `?c=`. |

## El flujo de trabajo

1. El cliente te pasa su contenido.
2. El cliente elige el UX/UI en la pestaña **Diseño**. La config viaja en `?c=` y en el enlace de preview.
3. En la pestaña **Contenido**, **Copiar contenido** te da la lista exacta a pedir al cliente según las variantes elegidas (para mandársela por correo).
4. Rellenas los campos del cliente. El formulario se genera a partir de `fields.js` y solo pide lo que la variante elegida realmente muestra; los huecos vacíos salen marcados como *pendiente*. Todo se refleja en el preview al instante.
5. **Copiar spec** exporta `{ config, content }` con el contenido real. `npm run build` y publicas.

El preview vive en un **iframe** aparte (dos entradas en `vite.config.js`) para
que el responsive del sitio responda al ancho del lienzo, no al del navegador,
y para que los estilos de la demo no toquen los del panel.

## Qué falta

- Export que genere un proyecto autónomo listo para desplegar (hoy exporta `{ config, content }`).
- Subida de imágenes (hoy los campos de imagen son por URL).
- Selectores de color libres en el panel (el contrato ya guarda valores; falta la UI).
- Editor de degradados (paradas y ángulo) en vez de solo lo que traen las plantillas.
- Almacén con selectores (Zustand) en lugar de contexto, cuando el panel crezca.
- Validación del contrato con Zod al leer de base de datos y al recibir del panel.
- Combos curados (no toda paleta pega con toda tipografía y estética).
- Toggle de secciones on/off y reordenado.
- Más secciones (precios, logos, FAQ) y más variantes.
- Cuentas, propuestas guardadas, revisiones.
