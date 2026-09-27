# El contenido para redes de Maketa

Reels (1080x1920), carruseles (1080x1350) y sus portadas, a partir de un solo
archivo de ideas. Es un subproyecto con sus propias dependencias (Remotion no
entra en el bundle de la app); `out/` está en `.gitignore`.

```bash
cd video
pnpm install
pnpm crear                          # lista las ideas y cuáles se pueden crear ya
pnpm crear IR-19                    # → out/IR-19-dark-A/  (vídeo, portada, pies y ficha)
pnpm crear IC-21                    # → out/IC-21-light-A/  (el carrusel, con su tema y layout en la carpeta)
pnpm crear IR-19 IC-07 IR-03        # varias a la vez
pnpm crear IC-21 --video            # el carrusel, además, animado: un MP4 por diapositiva
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
  "visual": { "tema": "light", "layout": "C" },   // opcional: si no, oscuro y el layout de la serie (o A)
  "dolor": "¿…?", "pie": "…", "cta": "…", "pieTikTok": "…",   // opcionales: ver "Los pies"
  "bloqueo": "fase-0",            // opcional: se crea, pero no se publica
  "video": "IntroMaketa",         // solo reels, opcional: otra composición en vez del motor (IR-00, el vídeo de marca)
  "pastilla": "…",                // solo reels, opcional: texto propio en la pastilla de la portada
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

`out/<id>-<tema>-<layout>/` (por ejemplo `out/IR-19-dark-A/`) queda listo
para subir. La carpeta lleva el tema y el layout: si cambias el `visual` y lo
vuelves a crear, la versión anterior se conserva para compararlas.

- **reel**: `video.mp4`, `portada.png`, `instagram.txt`, `tiktok.txt` y `ficha.md`
- **carrusel**: `01.png`, `02.png`…, `carrusel.pdf` (LinkedIn), `hoja.png` (para revisar), `instagram.txt`, `linkedin.txt` y `ficha.md`; con `--video`, además `01.mp4`, `02.mp4`…

### Los pies

No se escriben enteros: `lib/textos.mjs` los compone con piezas cortas, así
una idea nueva sale con el suyo sin escribir nada.

1. **Dolor**: una pregunta con el problema del dueño del negocio. Es lo único
   que se ve antes del "más". La de la idea (`dolor`) o, si no, la de la
   plantilla del reel o el gancho del carrusel.
2. **Cuerpo**: una o dos frases. El `pie` de la idea o, si no, el de la
   plantilla del reel o el `concepto` del carrusel.
3. **Maketa**: una línea, solo en reels y si el cuerpo no la nombra ya.
4. **CTA**, por reglas: portada `rejilla` → "Comenta el número"; pilar
   producto → "Comenta WEB y te mando el enlace por privado" (hay que
   contestar rápido); el resto, la de la idea o la de su pilar (guardar o
   compartir).
5. **Hashtags**: de 3 a 5, del sector del cliente (no del mundo del diseño).

TikTok lleva el dolor, "Diséñala tú: maketa.es" y tres hashtags; LinkedIn, lo
mismo que Instagram sin hashtags. Fase 0: nada de precios ni presupuestos;
"gratis y sin registro" sí, porque habla de probar, no de un servicio.

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
| `temas.js` | Los tres temas: **dark** (tinta con halo), **light** (blanco) y **accent** (el azul a sangre, con moderación). Ningún componente elige colores: elige un tema |
| `texto.js` | El titular (Inter 700, el interletraje del intro), el texto corrido, el antetítulo y el resaltado con `*asteriscos*` |
| `formatos.js` | Tamaños, zonas seguras y escalas tipográficas de reel, carrusel, portada y celda del perfil (3:4) |
| `layouts.js` | La geometría de los tres layouts de reel |
| `marca.js` · `fuentes.js` · `animaciones.js` | Los tokens de la landing, Inter y los gestos (entrada, barrido, morph de color…) |

**Tres layouts**, con el mismo sentido en todos los formatos:

| | Reel (vídeo) | Portada |
| --- | --- | --- |
| **A** | La web en su tarjeta | El titular arriba y el icono debajo |
| **B** | La web casi a pantalla completa | Tipográfica: el titular grande, abajo |
| **C** | El gancho se queda arriba mientras la web cambia | El número enorme ("5") y el titular |

La portada de un reel no usa el layout: tiene sus propias variantes
(`src/portadas/PortadaReel.jsx`), que se eligen con `"visual": { "portada": … }`.
Todas comparten el marco (la marca y la serie arriba, el gancho al mismo
tamaño que en el vídeo, el tema) y cambian el cuerpo, que se estira hasta
abajo: no quedan huecos, y todo cae en la franja 3:4 que enseña el perfil.

| Portada | Qué enseña | Su trabajo en el feed |
| --- | --- | --- |
| `pila` (por defecto) | La web y, asomando detrás, sus versiones siguientes, con la pastilla "Color principal · 5 opciones" | La firma: reconocimiento |
| `duelo` | La primera versión frente a la última, con su nombre | Contraste: el antes y el después sin reproducir el vídeo |
| `rejilla` | Cuatro versiones numeradas y "¿Cuál eliges? 1 · 2 · 3 · 4" | Comentarios: se contesta con un número |
| `numero` | "5 colores" en grande y la pila debajo | Escaneo rápido; rima con las portadas C de los carruseles |

Si una variante no tiene sentido para ese reel, se usa la más cercana: la
rejilla necesita cuatro versiones (si no, duelo) y el número, al menos dos (si
no, pila). En `out/` la carpeta lo lleva en el nombre si no es la pila:
`out/IR-07-dark-A-rejilla/`.

En los tres layouts de reel va la **pastilla** que dice qué cambia, con el
mismo icono para cada tipo de cambio: las muestras de color (color, preset),
la rejilla (estilo, portada) o la letra (tipografía, titular). Es la firma de
todos los reels.

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

**En vídeo** (`--video`), cada diapositiva es un MP4 de 5 s, 1080x1350: la
misma diapositiva que la imagen, con los bloques entrando escalonados (icono,
antetítulo, titular, texto y, el último, lo de abajo) con los muelles de la
marca, y el icono meciéndose en un bucle que cierra justo a los 5 s. Lo
decide `src/componentes/Aparece.jsx`; sin él, todo está quieto, así que no hay
dos versiones de ninguna diapositiva.

Dos piezas pensadas para guardar: la **pregunta** de los checklists va en el
azul de marca con letra blanca, y el cierre admite `"guardar": "…"` en vez de
`"cta"`, una tarjeta azul con el marcador y una flecha hacia el botón de
guardar de Instagram (IC-21 la usa).

**Una plantilla nueva** es una función más en `carrusel/plantillas.js` que
devuelva diapositivas con las variantes que ya hay (`portada`, `respuesta`,
`punto`, `caso`, `item`, `lista`, `comparativa`, `cierre`). Solo si ninguna
sirve se añade una variante en `Diapositiva.jsx`, que rellena los huecos del
mismo esqueleto: nunca con tamaños ni posiciones propios.

## Portadas

`src/portadas/Portada.jsx`: un sistema cerrado de **3 layouts × 3 temas**.
Hace la primera diapositiva de un carrusel, la portada de un reel (en 9:16,
con todo dentro de la franja 3:4 que enseña el perfil) y cada celda del feed.
Comparten márgenes, marca, letra y jerarquía; varían composición y color. Las
de los reels son otra pieza, siempre igual: ver arriba.

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
