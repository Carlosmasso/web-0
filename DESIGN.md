---
name: Maketa
description: Diséñala tú. Yo la construyo.
colors:
  azul-tinta: "#3b53d6"
  azul-velo: "#eef1ff"
  azul-trazo: "#c9d2ff"
  azul-tinta-claro: "#8ba0ff"
  azul-tinta-panel: "#829dff"
  azul-tinta-relleno: "#4c66e6"
  tinta: "#16171b"
  tinta-suave: "#5c5e66"
  tinta-tenue: "#6b6d75"
  papel: "#fbfaf8"
  blanco: "#ffffff"
  mesa: "#f6f5f2"
  linea: "#e8e6e1"
  linea-suave: "#efeee9"
  borde-control: "#d9d7d0"
  noche-fondo: "#131418"
  noche-panel: "#17181c"
  noche-tarjeta: "#23242a"
  noche-campo: "#2e3038"
  noche-linea: "#3b3d47"
  noche-texto: "#eaebef"
  noche-suave: "#989ca7"
  noche-tenue: "#8a8e9a"
  pendiente: "#d5a54e"
  correcto: "#58b98a"
  error: "#f28b82"
typography:
  display:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(44px, 6.6vw, 96px)"
    fontWeight: 760
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(42px, 6vw, 88px)"
    fontWeight: 760
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  statement:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(28px, 3.3vw, 48px)"
    fontWeight: 740
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  title:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "24px"
    fontWeight: 720
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(18px, 1.4vw, 20px)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 650
    letterSpacing: "-0.01em"
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.14em"
  panel:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
rounded:
  control: "10px"
  button: "14px"
  panel: "20px"
  card: "22px"
  frame: "26px"
  window: "28px"
  stage: "32px"
  pill: "999px"
spacing:
  gutter: "24px"
  section: "120px"
  max: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.blanco}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "0 26px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.azul-tinta}"
    textColor: "{colors.blanco}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    padding: "0 26px"
    height: "52px"
  button-white:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    padding: "0 26px"
    height: "52px"
  chip:
    backgroundColor: "{colors.blanco}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.blanco}"
  card-landing:
    backgroundColor: "{colors.blanco}"
    rounded: "{rounded.card}"
    padding: "34px 36px"
  card-soft:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.card}"
    padding: "34px"
  price-card:
    backgroundColor: "{colors.papel}"
    rounded: "{rounded.frame}"
    padding: "40px"
  card-panel:
    backgroundColor: "{colors.noche-tarjeta}"
    textColor: "{colors.noche-texto}"
    rounded: "{rounded.button}"
  field-panel:
    backgroundColor: "{colors.noche-campo}"
    textColor: "{colors.noche-texto}"
    rounded: "{rounded.control}"
---

# Design System: Maketa

## Overview

**Creative North Star: "El taller a la vista"**

Maketa enseña cómo se hace la web en lugar de describirla. La landing es un
taller luminoso con la puerta abierta: piezas sueltas que flotan en los
márgenes, una demo que se toca en la primera pantalla, un carrusel de webs a
medio montar y, al final, la mesa de trabajo con su cuadrícula. Quien entra ve
el oficio antes de leer una promesa, y la voz sigue siendo la de una persona
concreta que firma "Un abrazo, Carlos".

El sistema vive en dos superficies con la misma tinta. La **landing** es papel
cálido y claro, con titulares grandes y apretados, bandas que alternan papel y
blanco, y microinteracciones que responden al momento. El **configurador** es
una mesa oscura y callada: el panel se retira para que la web del cliente,
iluminada en el lienzo, sea lo único que importa. Las webs que genera Maketa
tienen su propio sistema de temas (`src/theme/`) y no siguen este documento.

El vídeo y los carruseles (`video/src/diseno/marca.js`) usan la misma paleta de
la landing: quien ve un reel y entra en maketa.es reconoce el sitio.

**Key Characteristics:**
- Un solo color de marca, el azul tinta; el resto es tinta sobre papel cálido.
- Titulares enormes y compactos (760, −0,04 em); el cuerpo, tranquilo y legible a 18 px.
- El producto a la vista: demo, plantillas y piezas, no capturas ni promesas.
- Movimiento corto y con respuesta inmediata; nada que haga esperar al botón.
- La obra del cliente siempre manda sobre la interfaz.

## Colors

Tinta azul sobre papel cálido, y una versión nocturna de lo mismo para el
configurador.

### Primary
- **Azul tinta** (#3b53d6): la acción que importa, los enlaces, la segunda línea
  del titular ("Yo la construyo."), la barra de progreso y el relleno que sube
  por el botón principal al pasar el ratón.
- **Velo azul** (#eef1ff) y **trazo azul** (#c9d2ff): el mismo azul diluido para
  fondos de números de paso, el subrayado a mano del titular y las piezas
  decorativas. Nunca para texto.
- **Azul tinta claro** (#8ba0ff): el azul sobre negro (vídeo, piezas del cierre).
- **Azul tinta de panel** (#829dff) y **de relleno** (#4c66e6): en el
  configurador, el primero para líneas, selección y foco; el segundo para
  botones rellenos, donde el blanco encima cumple AA.

### Neutral
- **Tinta** (#16171b): titulares, texto principal, el botón principal en reposo
  y la caja oscura del cierre.
- **Tinta suave** (#5c5e66): entradillas y párrafos secundarios (≥ 6:1 sobre papel).
- **Tinta tenue** (#6b6d75): notas, pies y etiquetas pequeñas (≥ 4,7:1 sobre
  papel y mesa). Las notas son texto pequeño y se tienen que leer.
- **Papel** (#fbfaf8): el fondo de la página y de las tarjetas suaves.
- **Blanco** (#ffffff): las bandas alternas (plantillas, "Para quién es",
  precio), las tarjetas de pasos y el contenedor de la demo.
- **Mesa** (#f6f5f2): el panel de controles de la demo.
- **Línea** (#e8e6e1), **línea suave** (#efeee9) y **borde de control**
  (#d9d7d0): bordes de tarjeta, separación entre bandas y contorno de botones
  silenciosos y fichas.
- **Noche** (#131418 → #17181c → #23242a → #2e3038): las capas del
  configurador, de lo más hondo (detrás del lienzo) al campo de un formulario.
- **Texto de noche** (#eaebef), **suave de noche** (#989ca7) y **tenue de noche** (#8a8e9a, ≥ 4,7:1 sobre la tarjeta del panel).

### Estados
- **Pendiente** (#d5a54e), **correcto** (#58b98a) y **error** (#f28b82, ≥ 6:1
  sobre la tarjeta del panel): solo para estados del configurador, nunca como
  decoración.

**The One Ink Rule.** El azul tinta es el único color con intención en la
interfaz de Maketa. Si una pantalla necesita un segundo color para destacar
algo, el problema es de jerarquía, no de paleta.

**The Client's Colour Rule.** Los colores de las webs de ejemplo (el verde de la
clínica, el rosa del restaurante neón) pertenecen a esas webs y viven solo
dentro de su marco: la demo, las tarjetas del carrusel o el lienzo. Nunca se
filtran a la interfaz de Maketa.

## Typography

**Display Font:** system-ui (con -apple-system, Segoe UI, Roboto)
**Body Font:** system-ui, también en el configurador

**Character:** La letra del sistema, sin pose; la personalidad la ponen el peso
(720–760) y el interletrado apretado de los titulares, que contrastan con un
cuerpo amplio y calmado.

### Hierarchy
- **Display** (760, 44–96 px, 0.98, −0,04 em): el titular del hero, uno por página, con la segunda frase en azul tinta.
- **Headline** (760, 42–88 px, 0.98, −0,04 em, `text-wrap: balance`): el título de cada sección. "Hola, soy Carlos" usa 42–76 px y el cierre 44–96 px.
- **Statement** (740, 28–48 px, 1.18, −0,035 em): la frase de convicción de "Para quién es", hasta 1080 px de ancho.
- **Title** (720, 24–26 px, −0,02 em): pasos, tarjetas suaves y el nombre de la oferta.
- **Lead** (400, 18–20 px, 1.6): entradillas en tinta suave, hasta 560–660 px de ancho. La entrada de "Soy Carlos" sube a 22 px y 600.
- **Body** (400, 18 px, 1.6): todo el texto corrido.
- **Button** (650, 17 px, −0,01 em): botones grandes; los pequeños, 15 px.
- **Label** (700, 13 px, 0,14 em, mayúsculas): rótulos en azul tinta, como "PRUÉBALO AQUÍ".

**The Letter Voice Rule.** Los titulares se escriben como frases de una
persona ("Diseña tu web tú mismo. Yo la construyo."), en caja de oración,
nunca en mayúsculas de cartel.

**The Tracking Floor Rule.** Ningún titular baja de −0,04 em ni pasa de 96 px:
más apretado, las letras se tocan; más grande, deja de leerse como una frase.

## Layout

Contenedor de **1200 px** con **24 px** de margen lateral. Las secciones
respiran mucho (**110–130 px** arriba y abajo) y se distinguen alternando
bandas de papel y blanco con una línea suave entre ellas, no con colores. La
demo del hero y el cierre oscuro son las dos piezas más anchas (1200–1240 px).

"Cómo funciona" y "Lo que te llevas" reparten el espacio en dos columnas
(texto a un lado, tarjetas o precio al otro) y caen a una columna en móvil. El
carrusel de plantillas ocupa todo el ancho y se recorta por los lados.

Por debajo de **1180 px** desaparecen las piezas decorativas, porque los
titulares ocupan los márgenes. Por debajo de **760 px** la web de ejemplo de la
demo pasa encima de sus controles y la fila de negocios se desliza en
horizontal con el borde difuminado; por debajo de **640 px** la navegación se
queda en la marca y el botón, y por debajo de **560 px** los botones del hero se
apilan a todo el ancho (hasta 340 px).

El configurador es una aplicación a pantalla completa: panel lateral oscuro y
lienzo con la web en un iframe; en móvil, el panel pasa a una hoja inferior.

**The Margin Pieces Rule.** Las piezas decorativas viven en los márgenes y
nunca tocan una línea de texto. Si no caben, se quitan; no se encogen ni se
apartan a medias.

## Elevation & Depth

Plano por defecto, con profundidad por tono (papel, blanco, mesa; las cuatro
capas de noche del panel) y líneas finas. La sombra se reserva para lo que es
"producto en la mesa": el contenedor de la demo, las tarjetas del carrusel y la
respuesta al pasar el ratón por un botón.

### Shadow Vocabulary
- **Mesa de la demo** (`0 50px 100px -40px rgba(22,23,27,0.25)`): el contenedor de "Pruébalo aquí".
- **Plantilla** (`0 0 0 1px var(--edge), 0 40px 80px -30px rgba(22,23,27,0.35)`): las tarjetas del carrusel; la del centro sube 8 px y oscurece la sombra al pasar por encima.
- **Respuesta del botón** (`0 14px 30px rgba(59,83,214,0.28)`): el botón principal al pasar el ratón, junto con 2 px de elevación.
- **Elevación del panel** (`0 1px 2px rgba(0,0,0,0.25), 0 1px 1px rgba(0,0,0,0.16)`): tarjetas y botones del configurador sobre su fondo.

**The Product-Only Shadow Rule.** Solo proyecta sombra lo que es producto (la
demo, una plantilla) o lo que responde a la mano (un botón bajo el ratón). Las
tarjetas de texto son planas.

## Shapes

Esquinas generosas que crecen con el tamaño de la pieza: **10 px** en fichas y
campos, **14 px** en botones, **20 px** en el panel de controles, **22 px** en
tarjetas, **26 px** en la tarjeta de precio y la foto, **28 px** en la demo y
**32 px** en el cierre oscuro. La píldora (999 px) queda para la insignia del
hero y los nombres de negocio de "Para quién es"; el círculo, para los colores y
los botones redondos del carrusel. Bordes de 1–1,5 px en línea o borde de
control.

El configurador usa la misma lógica a escala de herramienta: **8 px** para los
botones dentro de un grupo, **10 px** para controles y **14 px** para tarjetas. Los
interiores son 2 px más pequeños que su grupo, para que las curvas sean
concéntricas.

**The Growing Radius Rule.** Cuanto más grande es la pieza, más redondas sus
esquinas; dos piezas del mismo tamaño nunca llevan radios distintos.

## Components

### Buttons
Firmes y con respuesta inmediata.
- **Shape:** 14 px de radio, 52 px de alto (42 px en pequeño).
- **Primary:** tinta con texto blanco; al pasar el ratón, el azul tinta sube
  desde abajo como un relleno, el botón se eleva 2 px y gana la sombra azul. La
  flecha avanza 4 px.
- **Quiet:** sin fondo, contorno interior de 1,5 px en borde de control que pasa
  a tinta al pasar el ratón.
- **White:** blanco sobre el cierre oscuro.
- **Press:** `scale` a 0,97 en 80 ms, que se suma a la elevación del hover; al
  soltar vuelve en 160 ms. Con movimiento reducido no hay elevación ni escala.
- **En el configurador:** "Quiero esta web" usa el azul de relleno (#4c66e6) y la
  misma flecha que la landing, que avanza 3 px al pasar el ratón; es lo que une
  la acción principal de las dos superficies.

### Panel del configurador
- **Cabecera:** el logo de la landing (28 px), enlazado a la portada, junto al
  nombre de la versión.
- **Títulos de paso:** 16 px, 720, −0,02 em, la voz de los títulos de tarjeta de
  la landing a escala de herramienta.

### Chips (demo)
- **Style:** blanco, borde claro de 1,5 px, 10 px de radio, 40 px de alto, 14 px y 600; el borde pasa a tinta al pasar el ratón.
- **State:** el elegido pasa a tinta con texto blanco. Los colores son círculos
  de 36 px; el elegido lleva un doble anillo (mesa + tinta).

### Cards / Containers
- **Corner Style:** 22 px (tarjetas), 26 px (precio).
- **Background:** blanco en los pasos; papel en las tarjetas suaves y el precio.
- **Shadow Strategy:** ninguna; ver Elevation & Depth.
- **Border:** 1 px de línea.
- **Internal Padding:** 34–36 px; 40 px en el precio.
- **Hover:** ninguno. Una tarjeta que no se puede pulsar no se mueve.

### Inputs / Fields
- **Style:** fondo de campo de noche, radio 10 px, borde de línea de noche (configurador).
- **Focus:** borde y anillo en azul tinta de panel.
- **Error:** texto en el rojo de error, debajo del campo.

### Navigation
- Barra fija arriba, papel al 94 % con una línea casi invisible debajo. La marca
  a la izquierda; a la derecha, tres enlaces en tinta suave (15 px, 550) con un
  subrayado que se dibuja de izquierda a derecha, y el botón principal pequeño.
  Por debajo de 640 px quedan la marca y el botón.

### Demo "Pruébalo aquí"
La pieza que define la landing: una web de ejemplo dibujada (no una captura)
dentro de una ventana de navegador, con los controles en una mesa a su lado.
Cambiar de negocio funde el contenido con un leve desenfoque y desplazamiento;
el color, la letra y el fondo cambian en continuo. El botón "Seguir en el
configurador" abre el sector que se está viendo.

### Carrusel de plantillas
Siete webs dibujadas en 3D, la central de frente y las laterales giradas y
veladas. Avanza solo cada 4,2 s, se para al pasar el ratón, al enfocar, fuera de
pantalla y con movimiento reducido, y se arrastra con el dedo con inercia.

## Do's and Don'ts

### Do:
- **Do** usar el azul tinta (#3b53d6) solo en la acción principal, los enlaces, la marca y el subrayado del titular.
- **Do** enseñar el producto funcionando (demo, plantillas) antes que describirlo.
- **Do** escribir titulares en caja de oración y en primera persona, con `text-wrap: balance`.
- **Do** separar secciones alternando papel y blanco con una línea suave, no con fondos de color.
- **Do** tener el botón principal a la vista en menos de medio segundo; las entradas del hero duran ~0,6 s.
- **Do** respetar `prefers-reduced-motion`: fuera bucles, desplazamientos y escalas; se quedan los fundidos y los cambios de color.
- **Do** mantener el panel del configurador neutro para que el color del cliente se lea limpio.

### Don't:
- **Don't** introducir un segundo color de marca ni degradados de acento.
- **Don't** dejar que una pieza decorativa toque un titular o un párrafo.
- **Don't** apretar los titulares por debajo de −0,04 em ni pasar de 96 px.
- **Don't** dar hover de elevación a algo que no se puede pulsar.
- **Don't** usar mayúsculas de cartel en titulares; solo en rótulos pequeños.
- **Don't** enseñar precios fuera de la tarjeta "desde 249 €" de la landing.
- **Don't** aplicar este sistema a las webs generadas: tienen el suyo en `src/theme/`.
