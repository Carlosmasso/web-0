# Vídeos e imágenes con Remotion

Todo el contenido para redes de Maketa: los reels (1080x1920, 30 fps), el
vídeo de marca y los carruseles (imágenes de 1080x1350). Es un subproyecto
aparte, con sus propias dependencias: Remotion no entra en el bundle de la
app. `out/` está en `.gitignore`.

```bash
cd video
pnpm install
pnpm studio                         # editor en el navegador: todo lo de abajo
pnpm reel reels/color01.json        # un reel suelto   → out/reels/color01/
pnpm reels                          # el calendario de la cola semanal
pnpm reels 1                        # la semana 1      → out/semana-01/
pnpm carrusel carruseles/x.json     # un carrusel      → out/carruseles/x/
pnpm intro                          # el vídeo de marca → out/intro-maketa.mp4
pnpm fotos                          # hoja para revisar las fotos de los negocios
```

## Cómo está organizado

```
video/
  reels/          un JSON por reel suelto, e IDEAS.md
  carruseles/     un JSON por carrusel, e IDEAS.md
  datos/          los catálogos: negocios, fotos, secciones propias, formatos y la cola
  src/
    motor/        el motor de reels (una sola composición para todos)
    carrusel/     los carruseles
    intro/        el vídeo de marca
    componentes/  lo compartido: la web real, texto palabra a palabra, tarjeta,
                  pastilla, cierre y barra de progreso
    animaciones.js, marca.js, fuentes.js, Logo.jsx, Root.jsx
  reel.mjs · publicar.mjs · carrusel.mjs   los comandos
  render.mjs · textos.mjs · webpack.mjs    lo que comparten los comandos
```

## El motor de reels

Todos los reels, sueltos o de la cola, salen de **una sola composición**
(`src/motor/Reel.jsx`) con el acabado del vídeo de marca: gancho sobre fondo
tinta → la web real de un negocio en una tarjeta, transformándose → cierre
"Diséñala tú. Yo la construyo.". Cada reel responde a una pregunta: **¿qué
cambia si modifico X?** Duran de 9 a 13 s según cuántas variantes enseñen.

Un reel es un JSON:

```json
{ "plantilla": "color", "negocio": "dental", "variantes": "auto", "cantidad": 5 }
```

Opcionales: `variantes` como lista (`[{ "color": "#1d4ed8" }, …]`), `gancho`,
`pregunta` (la del cierre), `base` (ajustes del configurador antes de las
variantes), `pie` y `pieTikTok`. Cada JSON de `reels/` aparece solo en el
studio como `Reel-<nombre>`, y `pnpm reel` deja en su carpeta el vídeo, los
dos pies y la ficha de publicación.

### Plantillas

| Plantilla | Qué enseña |
| --- | --- |
| `preset` | La misma web con varios presets |
| `estilo` | Solo el acabado: bordes, sombras, efectos |
| `color` | El color de marca, transformando la web entera en su sitio |
| `tipografia` | El mismo texto con otra letra |
| `portada` | Dividida, centrada, con foto |
| `titular` | El titular tecleándose, y luego otra letra |
| `recorrido` | La web entera de arriba abajo |
| `preset+color`, `estilo+color`, `tipografia+estilo`, `tipografia+color` | Las combinaciones que merecen un reel |

No hay `preset+estilo` ni `preset+tipografia`: el preset ya fija las dos cosas
y pisarlas enturbia la pregunta. Ideas pendientes en [`reels/IDEAS.md`](reels/IDEAS.md).

### Piezas

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Plantillas | `src/motor/plantillas.js` | Qué ejes cambia cada una, su movimiento, gancho, pregunta, pies y ficha |
| Ejes | `src/motor/ejes.js` | Cada variable: cómo se aplica (el mismo parche que el configurador), cómo se nombra y su transición |
| Selección | `src/motor/elegir.js` | Con `"auto"`, las N variantes más distintas entre sí, por muestreo del punto más lejano con distancias explícitas |
| Resolutor | `src/motor/resolver.js` | JSON → pasos (fotograma, config, etiqueta), movimiento y duración |
| Punto de partida | `src/motor/web.js` | El preset, la portada y el contenido de cada negocio |
| Escenas | `src/motor/EscenaGancho.jsx`, `EscenaVariantes.jsx`, `WebEnCambio.jsx` | Lo que se ve |

**Dos transiciones, según lo que cambie.** El color hace *morph*: la paleta
del contrato se interpola fotograma a fotograma y la web entera se transforma,
porque sombras, degradados y contraste se derivan de ella. Lo discreto
(preset, estilo, letra, portada) hace *barrido*: la variante nueva se pinta de
arriba abajo con una línea de luz. Nunca es un fundido entre capturas.

### Reglas de acabado

Salen de dos correcciones y conviene no deshacerlas:

- **Nada salta.** Sin golpes de escala ni rebotes en la tarjeta; los muelles
  son los de `src/marca.js`, como en el intro.
- **Tipografía y color de la marca.** Inter 700 con el interletraje del intro
  y el azul de maketa.es como único acento. Nada de subtítulos en mayúsculas
  con contorno ni colores de reclamo: se probó y parecía un vídeo cualquiera.
- **Voz en primera persona**, como la landing: "Yo la construyo".

### La web real dentro de la tarjeta

[`src/componentes/Escenario.jsx`](src/componentes/Escenario.jsx) pinta
`PreviewCanvas` + `DemoPage` de `../src/preview/`, con el mismo CSS y los
mismos guardarraíles que el configurador. Cuatro decisiones:

- **Va dentro de un iframe de 410 px, ampliado x2.** El CSS del sitio usa
  media queries de ventana; sin iframe saldría la versión de escritorio.
- **Transiciones y animaciones CSS del sitio apagadas, y `motion: 'none'`.**
  Van por reloj, no por fotograma, y saldrían a medias.
- **Fuentes e imágenes se precargan antes del primer fotograma** (`delayRender`).
- **Una sola copia de React** ([`webpack.mjs`](webpack.mjs)): los componentes
  de `../src/` la resolverían desde la raíz y los hooks fallarían. También
  relaja la exigencia de extensiones, porque la raíz declara `"type": "module"`.

## La cola semanal

`pnpm reels N` renderiza lo que toca publicar la semana N. No tiene vídeo
propio: cada pieza es un reel del motor.

- [`datos/cola.mjs`](datos/cola.mjs) decide el orden: se cruzan 5 formatos y 8
  negocios con `formato[i % 5]` y `negocio[(i * 3) % 8]`. Como 3 es invertible
  módulo 8, no se repite ninguna combinación hasta la pieza 40, y un formato no
  vuelve hasta 5 piezas después ni un negocio hasta 8: catorce semanas a tres
  por semana. `revisar()` aborta si al tocar los catálogos la cola se pisa.
- [`datos/formatos.mjs`](datos/formatos.mjs) dice con qué plantilla del motor
  sale cada formato: `rafaga` → estilo, `identidad` → color, `portada`,
  `escribir` → titular, `recorrido`.

**El inventario es finito**: 40 piezas. Pasadas, la salida no es estirar la
cola sino meter ejes nuevos (clientes reales, antes/después, consejos).

## Los negocios

[`datos/negocios.mjs`](datos/negocios.mjs): ocho negocios, cada uno con su
preset, su contenido (nombre, titular, menú), su foto y `quien` ("tu casa
rural"), que es como le habla el gancho. Su web se monta en tres capas: el
contenido de demostración del sector de su preset; encima, sus secciones
propias ([`datos/secciones.mjs`](datos/secciones.mjs)) cuando ese sector no le
casa (hoy, casa rural, fisio, peluquería y taller); y encima, su marca y su
portada. **Un negocio nuevo cuyo preset no sea de su sector necesita su
entrada en `secciones.mjs`**, con fotos de Pexels comprobadas a ojo.

Las fotos están en [`datos/imagenes.json`](datos/imagenes.json), enlazadas a
Pexels y nunca descargadas: el recorte se pide por parámetros al CDN. Para
cambiar una, se pega otra URL base y se revisa con `pnpm fotos`. No todas las
fotos siguen el patrón `pexels-photo-<id>.jpeg`: conviene comprobar la URL.

## Carruseles para Instagram y LinkedIn

Carruseles educativos (1080x1350, 4:5) sobre cómo encargar, tener y mejorar
una web. **Mismo universo visual que los reels, mismo motor**: Remotion
también renderiza imágenes fijas, así que los carruseles comparten las
fuentes, los colores de `marca.js`, el logo, el empaquetado y el render.

```bash
pnpm carrusel carruseles/pregunta-dominio.json   # → out/carruseles/pregunta-dominio/
pnpm carrusel carruseles/*.json                  # todos
pnpm carrusel carruseles/pruebas/*.json          # los de resistencia (3, 5, 9 diapositivas, textos al límite)
```

Cada carrusel deja en su carpeta `01.png`, `02.png`… (Instagram),
`carrusel.pdf` (LinkedIn publica los carruseles como documento), `hoja.png`
(todas en pequeño, para revisar el ritmo de un vistazo) y `pie.txt` si el
JSON trae `pie`. En `pnpm studio` cada JSON aparece como `Carrusel-<nombre>`,
una diapositiva por segundo.

### Cómo está montado

```
carruseles/x.json      CONTENIDO con sentido: pregunta y casos, errores, comprobaciones
        ↓
plantillas.js          la NARRATIVA: qué diapositivas salen, en qué orden y con qué variante
        ↓
Diapositiva.jsx        el DISEÑO: un solo esqueleto; cada variante rellena sus huecos
        ↓
Carrusel.jsx           un fotograma por diapositiva → carrusel.mjs captura PNG, PDF y hoja
```

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Datos | `carruseles/*.json` | Un carrusel. Se registran solos como composiciones |
| Plantillas | `src/carrusel/plantillas.js` | `pregunta`, `errores`, `checklist`: contenido → diapositivas, con errores legibles si falta un campo |
| Esqueleto y variantes | `src/carrusel/Diapositiva.jsx` | Una sola retícula; las variantes (`portada`, `respuesta`, `punto`, `caso`, `item`, `lista`, `cierre`) solo rellenan sus huecos |
| Piezas | `src/carrusel/piezas.jsx` | Titular, texto con `*acento*`, antetítulo, iconos, casilla, tarjeta, pastilla |
| Formato | `src/carrusel/formato.js` | Tamaño, márgenes, la escala tipográfica fija y los espacios de la retícula |
| Comprobación | `src/carrusel/Cabe.jsx` | Que el texto quepa sin cambiar de tamaño (ver abajo) |
| Composiciones | `src/carrusel/Carrusel.jsx` | `Carrusel` (una diapositiva por fotograma) y `CarruselHoja` |
| Exportación | `carrusel.mjs` | PNG por diapositiva, PDF y hoja de contactos |

**El JSON describe contenido, no diapositivas.** Dice "estos son los casos"
o "estos son los errores", y la plantilla decide cómo se cuentan. Por eso
mañana el mismo JSON puede alimentar una plantilla de reel (gancho con la
portada, un caso por escena, el cierre de siempre) sin reescribirse: las
diapositivas ya son componentes de Remotion, y animarlas es envolverlas con
los gestos de `animaciones.js`.

### Las tres plantillas

Todas empiezan con la **portada** (fondo tinta con el halo, como el gancho de
los reels) y acaban con el **cierre** (fondo blanco, la llamada a la acción en
la pastilla y la marca con "Diséñala tú. Yo la construyo.", como el cierre del
intro). Lo que va `*entre asteriscos*` sale en el azul de marca. Campos comunes:
`portada { icono, antetitulo, titulo, texto }`, `cierre { icono, antetitulo,
titulo, texto, cta }`, y `tema`, `nivel` y `pie` para organizarlos.

```jsonc
// pregunta: portada → la respuesta corta ("Depende.") y de qué depende → un caso
// por diapositiva (si… → entonces…) → [resumen] → cierre
{ "plantilla": "pregunta",
  "respuesta": { "titulo": "Depende.", "texto": "Sobre todo, de…" },
  "casos": [{ "icono": "capas", "si": "Si tu web usa *WordPress*", "resumen": "Si usa un gestor",
              "entonces": "Necesita actualizaciones…", "texto": "…" }],
  "resumen": { "titulo": "Antes de contratarlo, *pregunta*:", "lista": ["¿Qué incluye?"] } }

// errores: portada → un error por diapositiva (número, qué pasa, "mejor así")
// → [preguntas] → cierre
{ "plantilla": "errores",
  "puntos": [{ "icono": "dominio", "titulo": "…", "texto": "…", "mejor": "…" }],
  "preguntas": { "titulo": "Pregunta *esto*:", "lista": ["…"] } }

// checklist: portada → una comprobación por diapositiva, con la lista en
// casillas que se van marcando → la lista entera para guardar → cierre
{ "plantilla": "checklist",
  "items": [{ "icono": "dominio", "titulo": "El dominio, a tu nombre", "corto": "El dominio está a mi nombre",
              "texto": "…", "pregunta": "¿A nombre de quién…?" }] }
```

Los iconos son conceptos (`dominio`, `hosting`, `accesos`, `movil`, `seo`,
`mantenimiento`, `seguridad`…; la lista entera en `ICONOS` de `piezas.jsx`)
dibujados con Phosphor, la misma familia que el sitio.

### Una sola retícula

Todas las diapositivas de todos los carruseles tienen el mismo esqueleto, de
arriba abajo: la marca y el contador; el icono en un cuadrado de 120 px; el
antetítulo; el titular; el texto; y, pegado al pie, el bloque de la variante
(el resalte, la lista, la firma). Solo cambia el fondo: tinta en la portada,
claro en el contenido y blanco en el cierre, como las tres escenas de los
reels.

La escala es **fija** (`TIPO` en `formato.js`): 96 px el titular de la
portada, 72 el de las demás, 40 el texto, 36 lo que va en tarjetas y 26 los
antetítulos. Ningún tamaño depende de lo largo que sea el texto ni de la
plantilla, así que el titular está a la misma altura y mide lo mismo en todas.

Por eso **lo que se adapta es el texto**. Cuando las fuentes han cargado,
`Cabe` mide la zona de contenido y, si algo se sale, el render falla diciendo
qué diapositiva, qué texto y cuántos píxeles sobran. Como orientación
(`pruebas/limites.json` está en el límite): el titular, dos o tres líneas; el
texto, unas cuatro; el resalte, dos; una lista, siete filas de una línea; la
llamada a la acción, una línea.

### Una plantilla nueva

Una función más en `plantillas.js` que devuelva diapositivas con las variantes
que ya hay. Solo si ninguna sirve (la comparación a dos columnas, el árbol de
decisión) se añade una variante en `Diapositiva.jsx`, que rellena los huecos
del mismo esqueleto con las piezas de `piezas.jsx`: nunca con tamaños ni
posiciones propios. Las siete plantillas que faltan y
las 100 ideas están en [`carruseles/IDEAS.md`](carruseles/IDEAS.md).

## El vídeo de marca (`IntroMaketa`)

15 s para fijar en el perfil: el problema, una web simulada que cambia de
color, letra y secciones, y el cierre. `pnpm intro` lo renderiza; la foto de
perfil sale con `pnpm exec remotion still src/index.jsx AvatarInstagram
out/avatar-instagram.png`.

| Archivo | Qué |
| --- | --- |
| `src/intro/IntroMaketa.jsx` | Las tres escenas encadenadas con `TransitionSeries` |
| `src/intro/Problema.jsx` | 0-4 s: "Crear una landing page no debería tomar días.", se tacha "días" y entra la marca |
| `src/intro/Demo.jsx` | 4-11 s: la web simulada y la pastilla que dice qué cambia |
| `src/componentes/Cierre.jsx` | 11-15 s: la marca y "Diséñala tú. Yo la construyo." (lo comparten los reels) |
| `src/marca.js` | Colores de la landing, las paletas de la demo y los muelles |
| `src/AvatarInstagram.jsx` | Foto de perfil: el favicon a sangre sobre el azul de marca |
| `src/Logo.jsx` | El dibujo del favicon; su último bloque "se coloca" al aparecer |

**Nada se mueve en línea recta**: todo sale de `spring()` con los tres muelles
de `marca.js`. **El cierre no promete autoservicio**: el cliente diseña y la
web la monta Carlos (PLAN.md, "Lo que NO hacemos").

`Logo.jsx` no se llama `Marca.jsx` a propósito: en macOS, que no distingue
mayúsculas, chocaría con `marca.js` al resolver `import '../Marca'`.
