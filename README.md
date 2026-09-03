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
| `src/content/` | Capa de contenido, separada del diseño. `defaults.js` es el contenido de relleno con la forma que leen todos los componentes; `fields.js` define qué campos pide cada sección según su variante (fuente única); `checklist.js` deriva de ahí la lista a pedir al cliente. |
| `src/preview/` | El sitio de demo (componentes de producción). `Preview.jsx` corre dentro del iframe, recibe `{ config, content }` por `postMessage` y cae al hash de la URL si se abre suelto. Cada sección lee el contenido con `useContent()`. |
| `src/configurator/` | El shell con dos pestañas: **Diseño** (`Sidebar`, cara al cliente) y **Contenido** (`ContentForm`, cara a ti; marca los campos vacíos como *pendiente* y copia la lista a pedir al cliente). `App` persiste config y contenido en `localStorage`, y la config también en `?c=`. |

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
- Combos curados (no toda paleta pega con toda fuente y variante).
- Toggle de secciones on/off y reordenado.
- Más secciones (precios, logos, FAQ) y más variantes.
- Cuentas, propuestas guardadas, revisiones.
