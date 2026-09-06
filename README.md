# Estudio — configurador de webs a medida

Marketplace donde un cliente arma su web eligiendo paleta, tipografía, esquinas,
densidad, iconos, efectos y una variante por sección. La vista previa se
renderiza en vivo; cuando le gusta lo que ve, te contacta y **tú** le entregas
la web construida. El cliente nunca se descarga el proyecto.

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
- **`src/preview/styles/`** — el CSS del sitio, partido por responsabilidad
  (`tokens` · `elements` · `sections` · `aesthetics` · `states`); `demo.css` es
  solo el índice de `@import`. Los bloques `[data-aesthetic="…"]`
  (`aesthetics.css`) no son cosmética: definen qué significa `:active`. En
  neo-brutalismo el botón cae sobre su sombra dura; en cyberpunk un destello
  barre la superficie; en claymorfismo se hunde con sombra interior; en material
  se eleva y aterriza.

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
| `src/configurator/` | El shell: pestañas **Diseño** (`Sidebar`) y **Contenido** (`ContentForm`), historial de deshacer (`useHistory.js`) y, solo en estudio, el selector de proyectos (`projects.js` + `ProjectMenu.jsx`). Persiste en `localStorage`: por proyecto en estudio, en clave única + `?c=` en cliente. |

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

### Dos personas, una instancia

`src/config/mode.js` decide el modo con `isStudio`. La detección es automática;
el cliente no puede forzarla desde la URL. `?studio` existe solo para cuando
trabajas desde otro ordenador.

- **Estudio** — `import.meta.env.DEV`, `localhost` / `127.0.0.1`, o `?studio`.
- **Cliente** — la versión desplegada en Vercel.

### Qué puede hacer el cliente

Todo lo de la venta, nada de la entrega:

| Acción | Dónde |
| --- | --- |
| Elegir diseño: preset, estética, color de marca, tipografía, esquinas, densidad, iconos, efectos, variante por sección | Pestaña **Diseño** (`Sidebar`) |
| Escribir sus textos (opcional) | Pestaña **Contenido**, con el aviso suavizado: *"…si lo prefieres, los pongo yo."* |
| **Deshacer / Rehacer** cualquier cambio de diseño | Botón **Deshacer** en la barra, siempre visible (`⌘Z` / `⇧⌘Z` como extra). "Rehacer" solo aparece si hay algo que rehacer. |
| Ver en escritorio / móvil | Conmutador de la barra |
| Guardar una versión para volver luego | **Copiar enlace** — el `?c=` lleva toda la config en la URL |
| Probar el formulario del sitio | El CTA responde con su mensaje de confirmación (envío de maqueta) |
| **Pedir la web** | **"Quiero esta web"** — el único botón destacado |

Lo que **no** ve: el botón **Código** y su cajón de exportación, el chip de
"ajustes automáticos", el selector de proyectos, ni los botones internos de
Contenido ("Copiar lista para el cliente", "Restablecer").

### Qué puedes hacer tú (estudio / admin)

Todo lo del cliente, más:

| Acción | Dónde |
| --- | --- |
| **Varios proyectos**, uno por cliente, sin que se pisen | Selector en la cabecera del panel: **Nuevo / Duplicar / Renombrar / Borrar**. Cada proyecto guarda su config y su contenido en `localStorage` bajo su propia clave (`src/configurator/projects.js`). En el primer arranque, tu trabajo actual migra a "Proyecto 1". |
| Ver qué han corregido los guardarraíles | Chip *"N ajustes automáticos"* en la barra + detalle en el cajón |
| **Copiar lista para el cliente** — el texto exacto a pedirle según las variantes que eligió | Pestaña **Contenido** |
| **Restablecer** el contenido al relleno de ejemplo | Pestaña **Contenido** |
| Descargar el proyecto o los tokens a mano | Botón **Código** → cajón de exportación |

En estudio, cambiar de proyecto **vacía el historial de deshacer** (no se cruza
entre proyectos) y el `?c=` de la URL se ignora: manda el proyecto activo.

### El cliente pide, tú entregas

1. El cliente pulsa **"Quiero esta web"**. Un modal (`ContactModal.jsx`) le pide
   solo sus datos (nombre, email, teléfono, nota). Nada de jerga a la vista.
2. Al enviar, `submitLead()` (`src/export/contact.js`) manda **por fetch a
   FormSubmit**, sin abrir nada en su pantalla, un correo a `CONTACT_EMAIL` con:
   sus datos, la config y el contenido en texto, y **el proyecto ya empaquetado
   como `.zip` adjunto**. El cliente solo ve *"recibido, te contactamos"*.
3. El cliente te pasa su contenido real. Con **Copiar lista para el cliente**
   tienes la lista exacta a pedir; el formulario de **Contenido** solo muestra
   lo que esa variante usa y marca *pendiente* los huecos. Todo se refleja en
   el preview al instante.
4. Ese `.zip` (el adjunto, o el que bajas del cajón **Código**) es un proyecto
   **React + Vite real**: `src/export/scaffold.js` copia los mismos ficheros
   fuente que corren en el preview (vía `?raw` de Vite; el CSS, ya resuelto en
   un solo archivo, vía `?inline`), así que nunca se desincroniza. `npm install
   && npm run build` y despliegas `dist/` donde quieras. Las otras pestañas del
   cajón (`tailwind.config.js` / `theme.css` / `design-tokens.json`) quedan
   para cuando solo necesitas los tokens sobre un proyecto que ya existe.

> **Puesta en marcha, una sola vez:** el primer envío a `CONTACT_EMAIL`
> (constante en `contact.js`) hace que FormSubmit te mande un correo con un
> enlace *"Activate Form"*. Púlsalo y a partir de ahí llegan todos los envíos.
> Antes de activar, el modal muestra un estado de error con un `mailto:` de
> reserva.

**El cliente nunca se lleva la web construida.** El configurador es una
herramienta de venta; el build lo entregas tú (*"si damos la posibilidad de
descarga, ¿qué gano yo?"*).

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
- Los proyectos de estudio viven en `localStorage`: faltan cuentas y revisiones
  con historial en servidor.
- Importar un `?c=` de cliente como proyecto nuevo en estudio (hoy se ignora).
