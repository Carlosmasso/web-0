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

## Cómo encaja

Todo gira alrededor de **una config serializable** (`src/config/schema.js`):

```jsonc
{
  "palette": "grafito", "mode": "light", "font": "space-grotesk",
  "radius": "md", "density": "normal", "iconSet": "phosphor", "effects": "subtle",
  "sections": { "hero": "split", "features": "grid", "carousel": "peek",
                "testimonial": "quote", "cta": "boxed" }
}
```

| Pieza | Rol |
| --- | --- |
| `src/registry/` | Catálogo del marketplace: paletas, fuentes, opciones y el mapa sección→componente. Añadir una variante es añadir una entrada aquí. |
| `src/tokens/applyTokens.js` | Traduce la config a CSS custom properties sobre un elemento raíz. Ningún componente tiene colores fijos. |
| `src/content/` | Capa de contenido, separada del diseño. `defaults.js` es el contenido de relleno con la forma que leen todos los componentes; `schema.js` dice qué campos pide cada sección según su variante; `checklist.js` genera, a partir de una config, la lista de contenido a pedir al cliente. |
| `src/preview/` | El sitio de demo (componentes de producción). `Preview.jsx` corre dentro del iframe, recibe `{ config, content }` por `postMessage` y cae al hash de la URL si se abre suelto. Cada sección lee el contenido con `useContent()`. |
| `src/configurator/` | El shell: `Sidebar` edita la config (cara al cliente), `ChecklistPanel` muestra el contenido a pedir (cara a ti), `App` persiste en `localStorage` y en `?c=`. |

## El flujo de trabajo

1. El cliente te pasa su contenido.
2. El cliente elige el UX/UI en el configurador. La config viaja en `?c=` y en el enlace de preview.
3. Abres **Contenido a pedir** para ver exactamente qué necesitas del cliente según las variantes que eligió (y lo copias en texto si falta algo).
4. Sustituyes `src/content/defaults.js` (o los trozos por sección) por lo del cliente. Los componentes ya son los de producción.
5. `npm run build` y publicas.

"Copiar configuración" exporta `{ config, content }`: las decisiones de diseño más el esqueleto de contenido listo para rellenar.

El preview vive en un **iframe** aparte (dos entradas en `vite.config.js`) para
que el responsive del sitio responda al ancho del lienzo, no al del navegador,
y para que los estilos de la demo no toquen los del panel.

## Qué falta

- Modo "rellenar contenido" dentro de la herramienta: pegar los textos del cliente y ver la web final antes de exportar (usa el mismo preview vía el campo `content` del `postMessage`, que ya está cableado).
- Export que genere un proyecto autónomo listo para desplegar (hoy exporta `{ config, content }`).
- Combos curados (no toda paleta pega con toda fuente y variante).
- Toggle de secciones on/off y reordenado.
- Más secciones (precios, logos, FAQ) y más variantes.
- Cuentas, propuestas guardadas, revisiones.
# web-0
