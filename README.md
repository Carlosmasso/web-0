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

| Capa | Qué decide | Cómo |
| --- | --- | --- |
| **1 · Punto de partida** | El mundo entero | Presets comerciales/tendencia · 6 chips de estética base · el dado 🎲 |
| **2 · Tu identidad** | Color de marca, tipografía, esquinas, densidad, movimiento | Controles libres con recomendación |
| **3 · Ajuste fino** | Cada knob suelto (sombras, bordes, efectos, secciones) | Plegado por defecto |

`src/registry/vocabulary.js` es la única capa donde vive el lenguaje de cara al
usuario: nadie ve `box-shadow: inset` ni `border-radius: 32px`, ven
**"Táctil / 3D"** y **"Redondeadas"**, cada una con una línea que describe lo que
*comunica*, no lo que hace.

### El motor de restricciones

**Regla de oro:** en las capas 2 y 3, cada control hace *exactamente* lo que dice.
Nunca bloquea una opción, nunca teletransporta a otra estética, nunca salta a la
siguiente. Si eliges "Suaves" en Esquinas, sales con esquinas suaves — aunque no
sea lo que "pega" con la estética activa. El guardarraíl **guía, no encierra**:
marca el valor recomendado con una etiqueta discreta y ya.

Cambiar de mundo entero se hace **arriba**, en la capa 1: los 6 chips de estética
base aplican un juego coherente de bordes, sombras y efectos de una vez
(`src/registry/aesthetics.js`).

`normalizeConfigWithGuardrails(userConfig)` (`src/config/guardrails.js`) corre
**siempre** justo antes de inyectar, y solo hace lo que el usuario no puede ver
que hace falta:

- **clamp** — acota los sliders (intensidad de sombra, desenfoque) a rangos sanos.
- **scheme** — cyberpunk fuerza fondo oscuro: el neón sobre blanco es ilegible.
- **coherence** — "portada con aurora" enciende las luces si estaban apagadas.
- **suelo de accesibilidad** — texto ≥ 7:1, atenuado ≥ 4.5:1, acento ≥ 3:1,
  moviendo solo la luminosidad. Innegociable.

Devuelve `{ config, violations, audit }`. Las `violations` (siempre correcciones
objetivas, nunca "no te dejo") se muestran en la barra y en el cajón de exportación.

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

**El cliente decide, no se lleva nada construido.** El configurador es una
herramienta de venta: quien lo tiene abierto elige UX/UI en la pestaña
**Diseño**, y cuando le gusta lo que ve pulsa **"Quiero esta web"** — el único
botón destacado de la barra. Se abre un modal (`ContactModal.jsx`) que pide
solo sus datos (nombre, email, teléfono, nota). Al enviar, `submitLead()`
(`src/export/contact.js`) manda por **fetch a FormSubmit** —sin que se abra
nada en su pantalla— tu correo con: sus datos, la config y el contenido en
texto, y **el proyecto ya empaquetado como `.zip` adjunto**. El cliente ve
solo un "recibido, te contactamos". Nada de jerga de diseño a la vista, nada
descargable para él.

> **Puesta en marcha, una sola vez:** el primer envío a `CONTACT_EMAIL`
> (constante en `contact.js`) hace que FormSubmit te mande un correo con un
> enlace *"Activate Form"*. Púlsalo y a partir de ahí llegan todos los envíos.
> Antes de activar, el modal muestra el estado de error con un `mailto:` de
> reserva.

Cuando el encargo ya es tuyo, la entrega:

1. El cliente te pasa su contenido real (por el canal que sea).
2. En la pestaña **Contenido**, **Copiar contenido** te da la lista exacta a
   pedir según las variantes que eligió, y el formulario solo pide lo que esa
   variante realmente muestra — los huecos vacíos salen marcados *pendiente*.
   Todo se refleja en el preview al instante.
3. Ese `.zip` (el que te llegó adjunto, o el que descargas a mano desde el
   cajón **Código**) es un proyecto React + Vite real —
   `src/export/scaffold.js` copia los mismos ficheros fuente que corren en el
   preview (vía `?raw` de Vite), así que nunca se desincroniza de lo que
   viste. `npm install && npm run build` y despliegas `dist/` donde quieras.
   Las otras pestañas del cajón (`tailwind.config.js` / `theme.css` /
   `design-tokens.json`) siguen ahí para cuando solo necesitas los tokens
   sobre un proyecto que ya existe.

El preview vive en un **iframe** aparte (dos entradas en `vite.config.js`) para
que el responsive del sitio responda al ancho del lienzo, no al del navegador,
y para que los estilos de la demo no toquen los del panel.

## Qué falta

- Subida de imágenes (hoy los campos de imagen son por URL).
- Selectores de color libres en el panel (el contrato ya guarda valores; falta la UI).
- Editor de degradados (paradas y ángulo) en vez de solo lo que traen las plantillas.
- Almacén con selectores (Zustand) en lugar de contexto, cuando el panel crezca.
- Validación del contrato con Zod al leer de base de datos y al recibir del panel.
- Combos curados (no toda paleta pega con toda tipografía y estética).
- Toggle de secciones on/off y reordenado.
- Más secciones (equipo, estadísticas) y más variantes de las 8 actuales.
- Cuentas, propuestas guardadas, revisiones.
