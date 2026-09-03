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

## Libertad guiada: el panel en tres capas

El problema no es la falta de opciones, es la parálisis. El panel está ordenado
por **cuánto compromete cada decisión**, no por qué propiedad de CSS toca:

| Capa | Qué decide | Cuántas opciones |
| --- | --- | --- |
| **1 · Punto de partida** | Un preset maestro completo, o el dado 🎲 | 6 tarjetas y un botón |
| **2 · Tu identidad** | Color de marca, tipografía, esquinas, respiración, movimiento | 5 controles, todos con guardarraíl |
| **3 · Ajuste fino** | Acceso crudo a sombras, bordes, efectos y secciones | Plegado por defecto |

`src/registry/vocabulary.js` es la única capa donde vive el lenguaje de cara al
usuario: nadie ve `box-shadow: inset` ni `border-radius: 32px`, ven
**"Táctil / 3D"** y **"Redondeadas"**, cada una con una línea que describe lo que
*comunica*, no lo que hace. Los controles se generan desde ahí, así que la jerga
no puede colarse.

### El motor de restricciones

`normalizeConfigWithGuardrails(userConfig)` (`src/config/guardrails.js`) corre
**siempre** justo antes de inyectar, venga el dato del panel, de un enlace
compartido o de la base de datos. Cuatro tipos de regla:

- **lock** — valores constitutivos de la estética. Neo-brutalismo con esquinas
  redondeadas deja de ser neo-brutalismo: se fuerza a `none`. En el panel, esas
  opciones no se deshabilitan sin más: `ownerOfValue()` busca a qué estética
  pertenecen y la opción se convierte en una **puerta** ("Táctil / 3D · Cambia a
  Claymorfismo"). El usuario expresa una intención y el sistema le lleva donde
  esa intención existe, en vez de negársela.
- **allow** — listas blancas. Glassmorfismo admite suave, amplio o cápsula, no recto.
- **clamp** — rangos numéricos sanos para la intensidad de sombra o el desenfoque.
- **suelo de accesibilidad** — texto ≥ 7:1, texto atenuado ≥ 4.5:1, acento ≥ 3:1.
  Este no lo salta ni el modo Pro.

Devuelve `{ config, violations, audit }`. Las `violations` se muestran en la barra
("3 ajustes automáticos") y en el cajón de exportación, que es lo que convierte
una caja negra frustrante en una herramienta en la que se confía.

El interruptor **"Saltarme las reglas de la estética"** (capa 3) desactiva
`lock` y `allow`. Nunca el suelo de accesibilidad.

### "¿Y esto dónde se ve?"

Cada entrada del vocabulario declara un `affects: { selector, label }`, y hay
**dos gestos para dos intenciones distintas**:

- **Pasar el ratón ilumina, y nunca desplaza.** El panel envía
  `postMessage({ type: 'focus', affects })` al iframe y `Spotlight` atenúa la
  página y dibuja un contorno sobre todos los elementos que ese control cambia.
  Encender lleva 140 ms de retardo, así que barrer el puntero por la lista no
  enciende y apaga el resaltado decenas de veces; apagar es inmediato.
- **Pulsar "Ver" desplaza.** `scrollTo` viaja como marca de tiempo, de modo que
  pulsarlo dos veces vuelve a llevarte allí.

Esa separación es deliberada: si el hover desplazara, mover el ratón por la
columna de controles haría saltar el lienzo sin parar.

Debajo de cada control queda además la línea *"Afecta a: tarjetas, imágenes y
diapositivas"*, que resuelve la misma pregunta sin necesidad de interactuar.

### Catálogo

`src/registry/presets.js`, en dos categorías porque son dos compradores:

- **Negocio** — Salud y bienestar (verde menta / azul clínico, relieve
  imperceptible), Corporativo y legal (azul marino, acento champán, Playfair),
  Hostelería y artesanía (tonos tierra, esquinas orgánicas, grano de papel).
- **Tendencia** — Neo-brutalismo, Glassmorfismo, Claymorfismo.

Estética != preset: tres presets comerciales muy distintos pueden apoyarse en la
misma estética y no parecerse en nada.

### Herramientas de producto

- **🎲 Sorpréndeme** (`src/theme/randomize.js`) — azar *controlado*. Muestrea un
  preset, un tono dentro de familias con carácter, y una tipografía con afinidad
  probada para esa estética. La paleta no se sortea: se **deriva**. Después pasa
  por los guardarraíles, así que no puede salir roto.
- **Color seguro** (`src/theme/color.js`) — `safePalette(primary)` recibe solo el
  color de marca y devuelve fondo, superficie, texto y acento con contraste
  garantizado, moviendo únicamente la luminosidad para que el color siga siendo
  reconocible. El neutro lleva una pizca del tono de marca: es lo que separa una
  paleta *elegida* de una *heredada*.
- **Exportador** (`src/theme/export.js`) — `tailwind.config.js` mapeado a clases
  semánticas (`bg-surface`, `text-ink`, `rounded-brand`, `shadow-brand`),
  `theme.css` con las custom properties en CSS puro, y `design-tokens.json` en
  formato W3C para Figma o Style Dictionary. Portabilidad, no lock-in.

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
