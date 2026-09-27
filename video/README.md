# El contenido para redes de Maketa

Reels (1080x1920), carruseles (1080x1350) y sus portadas, a partir de un solo
archivo de ideas. Es un subproyecto con sus propias dependencias (Remotion no
entra en el bundle de la app); `out/` está en `.gitignore`.

```bash
cd video
pnpm install
pnpm crear                          # lista las ideas y cuáles se pueden crear ya
pnpm crear IR-19                    # → out/IR-19/  (vídeo o imágenes, portada, pies y ficha)
pnpm crear IR-19 IC-07 IR-03        # varias a la vez
pnpm crear feed IR-03 IC-07 IR-19   # borrador del feed con esas, en orden de publicación → out/feed.png
pnpm studio                         # el editor de Remotion: cada idea, su portada y el feed
pnpm test                           # valida ideas.json y comprueba que los textos caben
pnpm intro                          # el vídeo de marca → out/intro-maketa.mp4
```

Cuándo sale cada pieza lo decides tú: esto solo la fabrica.

## Cómo está organizado

```text
video/
  contenido/
    ideas.json      TODAS las ideas: cada una es la pieza entera (texto, plantilla, visual)
    sistema.mjs     pilares (y su CTA), series, temas y layouts válidos
  crear.mjs         el comando
  lib/              lógica sin React: modelo de una idea, props, render, pies y fichas
  src/              presentación
    diseno/           el sistema de diseño: temas, texto, formatos, layouts, marca, fuentes, animaciones
    componentes/      piezas compartidas: web real, tarjeta, pastilla, marco, cierre, "que quepa"…
    motor/            reels
    carrusel/         carruseles
    portadas/         el sistema de portadas
    feed/             el borrador del feed
    intro/            el vídeo de marca y la foto de perfil
  datos/            los negocios que enseñan los reels (y sus fotos; se revisan con `node lib/fotos.mjs`)
  test/             tests de las ideas y carruseles de resistencia
```

## Una idea

```jsonc
{
  "id": "IC-22",                  // IR-xx un reel · IC-xx un carrusel
  "formato": "carrusel",
  "gancho": "…",                  // la frase de portada; *así* va en azul
  "pilar": "mistakes",            // opcional: da la CTA por defecto
  "serie": "errores-web",         // opcional: "ERRORES WEB · 05" en la portada
  "tema": "contratar-web",        // opcional: de qué va (sale en las etiquetas)
  "visual": { "tema": "neutral", "layout": "C" },   // opcional: si no, oscuro y el layout de la serie (o A)
  "cta": "…", "pie": "…", "pieTikTok": "…",           // opcionales
  "bloqueo": "fase-0",            // opcional: se crea, pero no se publica
  "carrusel": { "plantilla": "errores", "portada": {…}, "puntos": […], "cierre": {…} },
  // o, en un reel:
  "reel": { "plantilla": "color", "negocio": "dental", "cantidad": 5 }
}
```

Un reel se puede crear siempre. Un carrusel, cuando tiene escritas sus
diapositivas (la lista de su plantilla: `puntos`, `casos`, `items`…); hasta
entonces `pnpm crear` lo marca con `·`. La serie se numera por el orden del
archivo. Todo se valida al leer: si algo está mal escrito, el comando para y
dice qué.

`out/<id>/` queda listo para subir:

- **reel**: `video.mp4`, `portada.png`, `instagram.txt`, `tiktok.txt` y `ficha.md`
- **carrusel**: `01.png`, `02.png`…, `carrusel.pdf` (LinkedIn), `hoja.png` (para revisar), `instagram.txt`, `linkedin.txt` y `ficha.md`

### Reglas de contenido

Una idea por pantalla. Nada inventado: ni cifras ni porcentajes sin fuente.
Sin miedo artificial ni tono de gurú ("depende" vale si se explica de qué).
Honesto con lo que es Maketa: el configurador para diseñarla y verla en vivo,
webs de una sola página, que la construye Carlos y que queda del cliente.
**Fase 0 (PLAN.md): nada de dinero**; lo que hable de precios lleva
`"bloqueo": "fase-0"`. Las 100 ideas de carrusel del banco antiguo siguen en
el historial de git (`video/carruseles/IDEAS.md`, commit 116192b).

## El sistema visual

Un solo sistema de diseño (`src/diseno/`) para reels, carruseles y portadas:

| Pieza | Qué centraliza |
| --- | --- |
| `temas.js` | Los cuatro temas: **dark** (tinta con halo), **light** (blanco), **neutral** (el gris de la landing) y **accent** (el azul a sangre, con moderación). Ningún componente elige colores: elige un tema |
| `texto.js` | El titular (Inter 700, el interletraje del intro), el texto corrido, el antetítulo y el resaltado con `*asteriscos*` |
| `formatos.js` | Tamaños, zonas seguras y escalas tipográficas de reel, carrusel, portada y celda del perfil (3:4) |
| `layouts.js` | La geometría de los tres layouts de reel |
| `marca.js` · `fuentes.js` · `animaciones.js` | Los tokens de la landing, Inter y los gestos (entrada, barrido, morph de color…) |

**Tres layouts**, con el mismo sentido en todos los formatos:

| | Reel (vídeo) | Portada |
| --- | --- | --- |
| **A** | La web en su tarjeta con la pastilla encima | La pieza visual manda: la web (reel) o el icono (carrusel) |
| **B** | La web casi a pantalla completa | Tipográfica: el titular grande, abajo |
| **C** | El gancho se queda arriba mientras la web cambia | El número enorme ("5") y el titular |

### Reglas de acabado

Salen de dos correcciones y conviene no deshacerlas:

- **Nada salta.** El color se transforma en continuo (la paleta se interpola);
  lo discreto entra con un barrido. Sin rebotes en la tarjeta ni golpes de
  escala. Los muelles son los de `marca.js`, como en el intro.
- **Tipografía y color de la marca.** Nada de subtítulos en mayúsculas con
  contorno ni colores de reclamo: se probó y parecía un vídeo cualquiera.
- **Voz en primera persona**, como la landing: "Diséñala tú. Yo la construyo."

### Escala fija: lo que se adapta es el texto

Ningún tamaño depende de lo largo que sea el texto ni de la plantilla
(`TIPO` y `TIPO_PORTADA` en `formatos.js`): el titular está a la misma altura
y mide lo mismo en todas las diapositivas. Cuando las fuentes han cargado,
`componentes/Cabe.jsx` mide la zona de contenido y, si algo se sale, **el
render falla** diciendo qué texto, cuántos píxeles sobran y las medidas de la
zona. Como orientación (`test/carruseles/limites.json` está en el límite): el
titular, dos o tres líneas; el texto, unas cuatro; el resalte, dos; una lista,
siete filas de una línea; la llamada a la acción, una línea.

## Reels

Una sola composición (`src/motor/Reel.jsx`): gancho → la web real de un
negocio transformándose → cierre. Cada reel responde a "¿qué cambia si
modifico X?".

| Plantilla | Qué enseña |
| --- | --- |
| `preset` · `estilo` · `color` · `tipografia` | Una variable del configurador |
| `portada` | Dividida, centrada, con foto |
| `titular` | El titular tecleándose, y luego otra letra |
| `recorrido` | La web entera de arriba abajo |
| `preset+color` · `estilo+color` · `tipografia+estilo` · `tipografia+color` | Las combinaciones con sentido |

- **La web es la real**: `componentes/Escenario.jsx` pinta los componentes de
  `../src/preview/` en un iframe de móvil, con los mismos guardarraíles que el
  configurador. Cada variante se aplica con el mismo parche que la
  herramienta (`motor/ejes.js`).
- **Variantes automáticas** (`"variantes": "auto"`): las N más distintas
  entre sí, por muestreo del punto más lejano con distancias explícitas
  (`motor/elegir.js`).
- **Los negocios** (`datos/negocios.mjs`) se montan en tres capas: el
  contenido del sector de su preset, sus secciones propias
  (`datos/secciones.mjs`) si ese sector no les casa, y su marca y portada. Un
  negocio nuevo cuyo preset no sea de su sector necesita su entrada ahí, con
  fotos de Pexels comprobadas a ojo (`node lib/fotos.mjs`).
- **Una sola copia de React** (`webpack.mjs`): los componentes de `../src/` la
  resolverían desde la raíz y los hooks fallarían.

## Carruseles

Una composición con un fotograma por diapositiva (`src/carrusel/`). El JSON
describe **contenido con sentido**, no diapositivas; la plantilla decide la
narrativa y todas las diapositivas comparten esqueleto.

| Plantilla | Datos | Narrativa |
| --- | --- | --- |
| `pregunta` | `respuesta`, `casos` | La respuesta corta y un caso por diapositiva |
| `errores` | `puntos`, `preguntas` | Un error por diapositiva y "mejor así" |
| `checklist` | `items` | Una comprobación por diapositiva y la lista para marcar |
| `comparacion` | `lados`, `criterios` | Un criterio por diapositiva, en dos columnas |
| `mito` | `mitos` | El mito y, abajo, la realidad |
| `explicacion` | `partes` | Una idea por diapositiva |
| `decision` | `opciones` | Cuándo elegir cada opción |
| `costes` | `factores` | De qué depende (sin cifras; serie bloqueada en fase 0) |
| `antes-despues` | `pares` | Antes y después en columnas |
| `pasos` | `pasos` | Un paso por diapositiva y la lista para marcar |

Todas aceptan `resumen` (una lista final) y un `cierre` con CTA. La portada es
la del sistema de portadas, con el tema y el layout de la pieza; las
diapositivas interiores van en claro, que se leen mejor.

**Una plantilla nueva** es una función más en `carrusel/plantillas.js` que
devuelva diapositivas con las variantes que ya hay (`portada`, `respuesta`,
`punto`, `caso`, `item`, `lista`, `comparativa`, `cierre`). Solo si ninguna
sirve se añade una variante en `Diapositiva.jsx`, que rellena los huecos del
mismo esqueleto: nunca con tamaños ni posiciones propios.

## Portadas

`src/portadas/Portada.jsx`: un sistema cerrado de **3 layouts × 4 temas**.
Hace la primera diapositiva de un carrusel, la portada de un reel (en 9:16,
con todo dentro de la franja 3:4 que enseña el perfil) y cada celda del feed.
Comparten márgenes, marca, letra y jerarquía; varían composición y color.

## El borrador del feed

`pnpm crear feed IR-03 IC-07 IR-19 …` pinta esas ideas como las verá quien
entre en el perfil: lo más reciente arriba a la izquierda, cada portada
recortada a 3:4 como hace Instagram, y debajo su id, formato, serie, tema y
layout. Sirve para mirarlas juntas antes de subirlas: si una fila se ve igual,
si hay demasiado oscuro seguido. Si algo no encaja, se cambia su `visual` en
`ideas.json` y se vuelve a pintar.

## El vídeo de marca

`src/intro/`: 15 s para fijar en el perfil (`pnpm intro`) y la foto de perfil
(`AvatarInstagram`). El cierre es el mismo componente que el de los reels.

`componentes/Logo.jsx` no se llama `Marca.jsx` a propósito: en macOS, que no
distingue mayúsculas, chocaría con `diseno/marca.js`.
