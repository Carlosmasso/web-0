---
name: Maketa
description: Diséñala tú. Yo la construyo.
colors:
  azul-tinta: "#3b53d6"
  azul-tinta-claro: "#8ba0ff"
  azul-tinta-panel: "#829dff"
  azul-tinta-relleno: "#4c66e6"
  tinta: "#16171b"
  tinta-suave: "#55575e"
  tinta-tenue: "#6b6d75"
  papel: "#ffffff"
  papel-alt: "#f6f6f4"
  linea: "#e6e6e2"
  noche-fondo: "#131418"
  noche-panel: "#17181c"
  noche-tarjeta: "#23242a"
  noche-campo: "#2e3038"
  noche-linea: "#3b3d47"
  noche-texto: "#eaebef"
  noche-suave: "#989ca7"
  pendiente: "#d5a54e"
  correcto: "#58b98a"
  error: "#f28b82"
typography:
  display:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 1.5rem + 4.4vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.625rem, 1.3rem + 1.2vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.1875rem, 1.1rem + 0.3vw, 1.25rem)"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.1em"
  panel:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
rounded:
  sm: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  gutter: "20px"
  section: "64px"
  max: "1080px"
components:
  button-primary:
    backgroundColor: "{colors.azul-tinta}"
    textColor: "{colors.papel}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.tinta}"
    rounded: "{rounded.sm}"
    padding: "9px 16px"
  card-landing:
    backgroundColor: "{colors.papel-alt}"
    rounded: "{rounded.lg}"
    padding: "28px"
  card-panel:
    backgroundColor: "{colors.noche-tarjeta}"
    textColor: "{colors.noche-texto}"
    rounded: "{rounded.lg}"
  field-panel:
    backgroundColor: "{colors.noche-campo}"
    textColor: "{colors.noche-texto}"
    rounded: "{rounded.sm}"
---

# Design System: Maketa

## Overview

**Creative North Star: "La carta escrita a mano"**

Maketa se presenta como una carta de alguien que te conoce: papel limpio, tinta
azul, una sola voz en primera persona. Nada de despliegue corporativo, nada de
degradados de agencia. La página no intenta impresionar; intenta que el lector
confíe y conteste. Por eso es sobria, de una columna, con la letra del sistema y
un único color con intención.

El sistema vive en dos superficies con la misma tinta. La **landing** es papel
claro (con modo oscuro automático) donde se lee y se decide. El
**configurador** es una mesa oscura y callada: el panel se retira para que la
web del cliente, iluminada en el lienzo, sea lo único que importa. Las webs que
genera Maketa tienen su propio sistema de temas (`src/theme/`) y no siguen este
documento.

El vídeo y los carruseles (`video/src/diseno/marca.js`) usan la misma paleta de
la landing: quien ve un reel y entra en maketa.es reconoce el sitio.

**Key Characteristics:**
- Un solo color de marca, el azul tinta; el resto es tinta sobre papel.
- Letra del sistema en la landing; Inter solo dentro del configurador.
- Una columna de 1080 px que alinea texto e imagen.
- Superficies planas; la sombra solo cuando algo flota de verdad.
- La obra del cliente siempre manda sobre la interfaz.

## Colors

Tinta azul sobre papel cálido, y una versión nocturna de lo mismo.

### Primary
- **Azul tinta** (#3b53d6): botones de acción principal, enlaces y la marca. Es
  la firma de la carta.
- **Azul tinta claro** (#8ba0ff): el mismo azul en fondo oscuro (modo oscuro de
  la landing, acentos de vídeo sobre negro).
- **Azul tinta de panel** (#829dff) y **de relleno** (#4c66e6): en el
  configurador, el primero para líneas, selección y foco; el segundo para
  botones rellenos, donde el blanco encima cumple AA.

### Neutral
- **Tinta** (#16171b): texto principal de la landing.
- **Tinta suave** (#55575e): entradillas y párrafos secundarios.
- **Tinta tenue** (#6b6d75; #8a8c95 en oscuro): notas, pies de imagen, etiquetas. Cumple AA (≥ 4,7:1 también sobre papel alternativo): las notas son texto pequeño y se tienen que leer.
- **Papel** (#ffffff) y **papel alternativo** (#f6f6f4): fondo y tarjetas.
- **Línea** (#e6e6e2): divisores entre secciones y bordes de tarjeta.
- **Noche** (#131418 → #17181c → #23242a → #2e3038): las capas del
  configurador, de lo más hondo (detrás del lienzo) al campo de un formulario.
- **Texto de noche** (#eaebef) y **suave de noche** (#989ca7).

### Estados
- **Pendiente** (#d5a54e), **correcto** (#58b98a) y **error** (#f28b82, ≥ 6:1
  sobre la tarjeta del panel): solo para estados, nunca como decoración.

**The One Ink Rule.** El azul tinta es el único color con intención en la
interfaz de Maketa. Si una pantalla necesita un segundo color para destacar
algo, el problema es de jerarquía, no de paleta.

**The Client's Colour Rule.** El color de la web del cliente nunca se mezcla con
el de Maketa: el panel es neutro para que su elección se lea sin interferencias.

## Typography

**Display Font:** system-ui (con -apple-system, Segoe UI, Roboto)
**Body Font:** system-ui
**Panel Font:** Inter (solo en el configurador)

**Character:** La letra del sistema es la de una carta: la que ya tienes, sin
pose. La personalidad viene del peso y del interletrado apretado en los
titulares, no de una fuente de marca.

### Hierarchy
La landing usa **seis tamaños y ninguno más**, como tokens en `public/landing.css`
(`--text-sm` … `--text-3xl`). Un tamaño nuevo sale de esa escala o no entra.

- **Display** (`3xl`, 700, 40–64 px, 1.05, −0.035em, `text-wrap: balance`): el titular del hero, uno por página.
- **Headline** (`xl`, 700, 26–34 px, 1.2, −0.025em): el título de cada sección. "Hola, soy Carlos" sube a `2xl` (32–44 px).
- **Title** (`lg`, 700, 19–20 px): pasos, tarjetas, titulares de ejemplo y el precio, que va a la altura del título que tiene al lado.
- **Body** (`base`, 400, 17–18 px, 1.65): todo el texto corrido y los botones. Las entradillas van a `lg` con 1.55 de interlineado, en tinta suave, con 46–62ch de ancho.
- **Small** (`sm`, 15 px): notas, pies de imagen, navegación y pie, en tinta tenue.
- **Label** (700, 0.75rem, 0.1em, mayúsculas): rótulos pequeños como "Sí / No", en tinta tenue.

**The Letter Voice Rule.** Los titulares se escriben como frases de una
persona ("Diseña tu web tú mismo. Yo la construyo."), en caja de oración,
nunca en mayúsculas de cartel.

## Layout

Una sola columna de contenido de **1080 px** con **20 px** de margen lateral;
el texto y la captura del configurador comparten exactamente ese ancho. Las
secciones se separan con **64 px** de aire y una línea fina arriba (la primera,
sin línea). A partir de **860 px**, los grupos de tres (pasos, compromisos) se
ponen en tres columnas iguales y el bloque de precio en dos (1fr / 1.1fr);
debajo, todo cae a una columna.

El configurador es una aplicación a pantalla completa: panel lateral oscuro y
lienzo con la web en un iframe; en móvil, el panel pasa a una hoja inferior.

**The Shared Width Rule.** Si un bloque de texto es más estrecho o más ancho
que la imagen que lo acompaña, está mal. Texto e imagen caen a la misma
anchura.

## Elevation & Depth

Plano por defecto. La profundidad se cuenta con tonos (papel / papel
alternativo; las cuatro capas de noche del panel) y con líneas finas. La sombra
aparece solo en lo que flota de verdad: la captura del configurador en la
landing y los elementos elevados del panel.

### Shadow Vocabulary
- **Captura** (`0 40px 80px -40px rgba(22,23,27,0.45), 0 10px 24px -14px rgba(22,23,27,0.25)`): la imagen del configurador; al pasar por encima sube 3 px y la sombra crece un poco.
- **Elevación del panel** (`0 1px 2px rgba(0,0,0,0.25), 0 1px 1px rgba(0,0,0,0.16)`): tarjetas y botones del configurador sobre su fondo.

**The Flat Paper Rule.** El papel no tiene sombra. Si una tarjeta de la landing
necesita sombra para distinguirse, cambia su fondo a papel alternativo.

## Shapes

Esquinas suavemente redondeadas y constantes: **10 px** en botones y campos,
**14 px** en tarjetas e imágenes, y la píldora (999 px) solo para insignias
circulares como los números de los pasos. Bordes de 1 px en línea o, en el
panel, en línea de noche.

## Components

### Buttons
Discretos y precisos: dicen lo que hacen y no compiten con la web del cliente.
- **Shape:** suavemente redondeado (10 px).
- **Primary:** azul tinta con texto blanco, 600, cuerpo (17–18 px), 14 × 26 px.
- **Hover / Active:** brillo +7 % al pasar; baja 1 px al pulsar (120 ms).
- **Ghost:** sin fondo, borde de línea, texto tinta, 9 × 16 px; el borde pasa a azul tinta al pasar.

### Cards / Containers
- **Corner Style:** 14 px.
- **Background:** papel alternativo en la landing; tarjeta de noche en el panel.
- **Shadow Strategy:** ninguna en la landing; la elevación mínima en el panel.
- **Border:** 1 px de línea.
- **Internal Padding:** 28 px en la tarjeta de precio.

### Inputs / Fields
- **Style:** fondo de campo de noche, radio 10 px, borde de línea de noche.
- **Focus:** borde y anillo en azul tinta de panel.
- **Error:** texto en el rojo de error, debajo del campo.

### Navigation
- La palabra "Maketa" a la izquierda (700, `lg`, −0.02em) y, a la derecha,
  un enlace en tinta suave y un botón fantasma "Abrir el configurador". Sin
  menú hamburguesa: la landing es corta.

### Step Marker
Número en un círculo de 30 px, papel alternativo con borde de línea, 700: la
única forma circular de la landing, para los tres pasos de "Cómo funciona".

## Do's and Don'ts

### Do:
- **Do** usar el azul tinta (#3b53d6) solo en la acción principal, los enlaces y la marca.
- **Do** alinear texto e imagen al mismo ancho de 1080 px.
- **Do** escribir titulares en caja de oración y en primera persona.
- **Do** separar secciones con 64 px y una línea fina, no con fondos de colores.
- **Do** respetar `prefers-reduced-motion`: la captura no entra ni sube.
- **Do** mantener el panel del configurador neutro para que el color del cliente se lea limpio.

### Don't:
- **Don't** introducir un segundo color de marca ni degradados de acento.
- **Don't** poner sombra al papel de la landing.
- **Don't** usar mayúsculas de cartel en titulares; solo en rótulos pequeños.
- **Don't** enseñar precios fuera de la tarjeta "desde 249 €" de la landing.
- **Don't** aplicar este sistema a las webs generadas: tienen el suyo en `src/theme/`.
