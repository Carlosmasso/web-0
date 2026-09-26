# MAKETA — CONTENT & FEED SYSTEM

Quiero construir para **maketa.es** un sistema completo de generación de contenido para redes sociales.

El sistema debe permitir generar:

* Reels
* Carruseles
* Portadas
* Copy
* Variaciones de contenido

La generación de vídeo se realiza actualmente con **Remotion**.

El objetivo NO es crear piezas aisladas.

Quiero construir un **sistema de contenido escalable**, donde contenido, diseño, Reels, carruseles y feed compartan un mismo lenguaje visual.

---

# 1. OBJETIVO PRINCIPAL

Maketa debe poder producir contenido de forma sistemática sin que cada nueva pieza requiera diseñar o programar desde cero.

La arquitectura conceptual debe ser:

```text
CONTENT
   ↓
CONTENT DATA
   ↓
VISUAL SYSTEM
   ↓
┌──────────────┬───────────────┐
│              │               │
REEL        CAROUSEL       OTHER FORMAT
│              │               │
MP4           PNGs
```

Pero todos los formatos deben compartir:

* branding
* tipografía
* colores
* espaciado
* componentes
* jerarquía visual
* tratamiento de imágenes
* estilo
* tono

---

# 2. ANTES DE PROGRAMAR

Primero analiza completamente el proyecto existente.

Especialmente:

* maketa.es
* sistema de diseño
* componentes
* colores
* tipografías
* presets
* estilos
* tipos
* categorías
* componentes visuales
* sistema de Remotion
* compositions
* sistema de renderizado
* assets
* datos existentes

No inventes funcionalidades.

No crees una arquitectura paralela si ya existe una solución reutilizable.

Primero entiende cómo está construido Maketa.

Después propón la arquitectura.

---

# 3. PRINCIPIO FUNDAMENTAL

Quiero que pienses en Maketa como una **marca editorial**, no como una aplicación que publica contenido aleatoriamente.

El contenido debe tener:

**CONSISTENCIA + VARIEDAD**

No quiero:

* posts idénticos
* plantillas repetidas constantemente
* feed excesivamente rígido
* colores aleatorios
* estilos que parezcan de marcas diferentes

Tampoco quiero que todo tenga exactamente el mismo diseño.

La sensación buscada es:

> "Hay un sistema visual detrás de todo esto."

---

# 4. EL FEED ES UNA COMPOSICIÓN

Esta es una regla fundamental.

No diseñes cada publicación únicamente pensando en ella misma.

El feed completo debe considerarse una composición.

Cada publicación debe funcionar individualmente, pero también debe tener relación visual con las publicaciones cercanas.

---

# 5. ESTRUCTURA BASE DEL FEED

La estructura inicial que quiero probar es:

```text
REEL → CAROUSEL → REEL
```

Cada grupo de 3 publicaciones debe funcionar como una pequeña unidad visual.

Ejemplo:

```text
┌─────────────┬─────────────┬─────────────┐
│             │             │             │
│    REEL     │  CAROUSEL   │    REEL     │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

Después:

```text
┌─────────────┬─────────────┬─────────────┐
│             │             │             │
│    REEL     │  CAROUSEL   │    REEL     │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

Esta estructura NO significa que todos los posts tengan que ser iguales.

El grupo debe tener coherencia visual, pero variedad interna.

---

# 6. REGLA DE ARMONÍA

Al generar una nueva publicación debes tener en cuenta:

* últimas publicaciones
* color dominante
* nivel de contraste
* densidad de texto
* composición
* tipo de contenido
* Reel vs carrusel
* layout utilizado
* tema

Evita:

```text
DARK
DARK
DARK
```

o:

```text
LIGHT
LIGHT
LIGHT
```

o:

```text
SAME LAYOUT
SAME LAYOUT
SAME LAYOUT
```

o:

```text
SAME COLOR
SAME COLOR
SAME COLOR
```

Busca alternancia y ritmo.

---

# 7. CONSISTENCIA VISUAL

Crear un Design System específico para contenido.

Debe definir:

### Tipografía

* font family
* pesos
* tamaños
* line heights
* letter spacing
* jerarquía

### Color

* background
* foreground
* brand
* accent
* muted
* neutral

### Espaciado

* margins
* padding
* gaps
* grid

### Formas

* borders
* radius
* líneas
* bloques
* contenedores

### Iconografía

* estilo
* tamaño
* stroke
* tratamiento

### Imágenes

* crop
* radius
* sombras
* bordes
* tratamiento

Todo debe reutilizarse entre Reels y carruseles.

---

# 8. SISTEMA DE VARIANTES VISUALES

No quiero infinitos diseños.

Quiero un número pequeño de variantes controladas.

Por ejemplo:

```text
Layout A
Layout B
Layout C
```

para Reels.

Y:

```text
Layout A
Layout B
Layout C
```

para carruseles.

Además:

```text
Theme:
- dark
- light
- neutral
- accent
```

y:

```text
Density:
- minimal
- standard
- information
```

El sistema puede combinar estas variables, pero siempre respetando las reglas de marca.

---

# 9. REELS

Los Reels se generan con **Remotion**.

Quiero mantener una arquitectura basada en templates reutilizables.

Inicialmente:

```text
PresetSwitch
StyleSwitch
ColorSwitch
TypeSwitch
```

Cada Reel debe aceptar datos.

Ejemplo conceptual:

```ts
{
  template: "preset-switch",
  category: "...",
  variants: [...]
}
```

No quiero crear una composición diferente para cada Reel.

Quiero:

```text
TEMPLATE + DATA = REEL
```

---

# 10. CARRUSELES

Los carruseles deben utilizar el mismo lenguaje visual.

Formato:

**1080 × 1350 — 4:5**

También quiero que puedan ser generados mediante un sistema basado en templates + datos.

Inicialmente:

```text
Question
Mistakes
Checklist
Comparison
MythReality
Explanation
Decision
```

No es necesario implementar todos inmediatamente.

Comenzar con:

```text
Question
Mistakes
Checklist
```

---

# 11. CONTENIDO EDUCATIVO

El contenido de Maketa debe ayudar a una persona a entender mejor el mundo de las webs.

Temas:

* contratar una web
* presupuestos
* precios
* errores
* diseño
* UX
* SEO
* hosting
* dominio
* mantenimiento
* ecommerce
* WordPress
* CMS
* seguridad
* rendimiento
* conversión
* contenido
* proceso de creación
* relación cliente/agencia
* propiedad
* accesos
* proveedores

---

# 12. PILARES DE CONTENIDO

Clasifica cada pieza dentro de uno de estos pilares:

### EDUCATION

Explicar algo.

### PROBLEM

Mostrar un problema habitual.

### MISTAKES

Errores comunes.

### INSPIRATION

Inspiración visual.

### PRODUCT

Mostrar Maketa.

### TRUST

Demostrar conocimiento.

### DECISION

Ayudar a tomar una decisión informada.

No quiero que todo sea promoción de Maketa.

---

# 13. PROPORCIÓN DE CONTENIDO

Como punto de partida:

```text
40% visual / inspiración
30% educación
20% problemas / errores
10% producto
```

Esta proporción es inicial y puede modificarse según los datos reales de rendimiento.

---

# 14. SERIES

Quiero que el contenido pueda pertenecer a series reconocibles.

Ejemplos:

```text
MAKETA / 01

ANTES DE CONTRATAR / 01

ERRORES WEB / 01

WEB BASICS / 01

MAKETA TIP / 01
```

Las series deben compartir diseño.

Esto permite que la audiencia reconozca rápidamente el tipo de contenido.

---

# 15. EJEMPLO DE FILA

Una fila podría ser:

```text
REEL
"5 estilos para el mismo diseño"

CAROUSEL
"¿Qué hace que una web parezca profesional?"

REEL
"El mismo diseño en 5 colores"
```

Los tres pertenecen al mismo universo visual.

Otra:

```text
REEL
"3 cambios que transforman una web"

CAROUSEL
"5 errores al contratar una web"

REEL
"Antes → después"
```

---

# 16. PORTADAS

Las portadas son especialmente importantes.

Deben funcionar:

1. individualmente
2. dentro del perfil
3. junto a las publicaciones cercanas

No quiero portadas diseñadas al azar.

Crear un sistema cerrado de portadas.

Por ejemplo:

```text
REEL COVER A
REEL COVER B
REEL COVER C

CAROUSEL COVER A
CAROUSEL COVER B
CAROUSEL COVER C
```

El sistema decide cuál utilizar.

---

# 17. REGLAS PARA ELEGIR PORTADA

Al generar una portada nueva:

Analiza las últimas publicaciones.

Si las últimas son:

```text
DARK
DARK
```

prioriza:

```text
LIGHT / NEUTRAL
```

Si las últimas son:

```text
LIGHT
LIGHT
```

prioriza:

```text
DARK / ACCENT
```

Si se ha utilizado repetidamente un layout:

```text
A
A
A
```

prioriza:

```text
B
```

La selección debe buscar ritmo visual.

---

# 18. IMPORTANTE: NO HACER UN FEED DEMASIADO PERFECTO

No quiero un feed que parezca una cuadrícula artificial.

No queremos:

```text
A B C
A B C
A B C
```

de forma rígida.

Queremos:

```text
A B A
C A B
B C A
```

pero manteniendo coherencia.

La armonía debe venir del Design System, no de repetir exactamente las mismas posiciones.

---

# 19. COPY

El contenido debe ser:

* directo
* útil
* claro
* profesional
* humano
* fácil de entender

Evitar:

* clickbait vacío
* miedo artificial
* lenguaje de gurú
* exageraciones
* afirmaciones absolutas
* frases genéricas

Un buen hook debe crear curiosidad porque existe una información útil detrás.

---

# 20. CTA

No todos los posts necesitan vender.

Utilizar CTA según el objetivo.

Educación:

> "Guárdalo para cuando pidas presupuestos."

Problema:

> "Compártelo con alguien que esté haciendo una web."

Producto:

> "Descúbrelo en maketa.es"

Engagement:

> "¿Cuál elegirías?"

---

# 21. CONTENT DATA

Quiero separar completamente:

```text
CONTENT
```

de:

```text
PRESENTATION
```

Ejemplo:

```ts
{
  id: "CR-2026-001",
  type: "carousel",
  pillar: "education",
  topic: "contratar-web",
  series: "antes-de-contratar",
  template: "mistakes",
  title: "...",
  slides: [...]
}
```

El template debe encargarse de presentarlo.

---

# 22. CONTENT ID

Cada pieza debe tener un identificador único.

Formato:

```text
RL-2026-001
RL-2026-002

CR-2026-001
CR-2026-002
```

No utilizar el título como identificador.

---

# 23. STATUS

Cada contenido debe poder tener:

```text
idea
draft
generated
review
ready
scheduled
published
archived
```

---

# 24. PUBLICACIÓN

Separar contenido de publicación.

El contenido:

```text
qué estamos diciendo
```

La publicación:

```text
dónde
cuándo
```

Una pieza puede publicarse en varias plataformas.

Por ejemplo:

```text
Instagram
LinkedIn
TikTok
```

sin duplicar el contenido base.

---

# 25. CALENDARIO INICIAL

Como punto de partida:

```text
LUNES
REEL

MIÉRCOLES
CAROUSEL

VIERNES
REEL

DOMINGO
CAROUSEL
```

Pero el calendario puede modificarse según rendimiento.

La prioridad es mantener:

**ritmo + variedad + armonía visual.**

---

# 26. REGLA DE GRUPO

Cada tres publicaciones forman una unidad:

```text
POST 1
POST 2
POST 3
```

El grupo debe tener:

* relación temática o conceptual
* contraste visual
* coherencia cromática
* variedad de layouts

Ejemplo:

```text
REEL
visual

CAROUSEL
educational

REEL
visual
```

---

# 27. BIBLIOTECA DE IDEAS

Crear inicialmente:

### 50 ideas de Reels

### 50 ideas de carruseles

Cada idea debe tener:

```text
id
format
pillar
topic
series
template
hook
concept
CTA
```

Evitar ideas repetitivas.

---

# 28. GENERACIÓN DE CONTENIDO

El sistema debe permitir posteriormente algo parecido a:

```text
Generate 10 reels
topic = "styles"
```

o:

```text
Generate 5 carousels
topic = "contratar-web"
pillar = "education"
```

Pero también:

```text
Generate next post
```

y el sistema debe analizar el feed actual para decidir:

* formato
* template
* layout
* color
* tema
* densidad
* serie

de forma que la nueva publicación encaje visualmente con las anteriores.

---

# 29. FEED-AWARE GENERATION

Esta es una funcionalidad importante.

Quiero que el sistema pueda conocer las últimas publicaciones.

Por ejemplo:

```ts
[
  {
    type: "reel",
    theme: "dark",
    layout: "A"
  },
  {
    type: "carousel",
    theme: "light",
    layout: "B"
  },
  {
    type: "reel",
    theme: "dark",
    layout: "C"
  }
]
```

Y utilizar esa información para seleccionar la siguiente variante.

No quiero que dos publicaciones consecutivas sean visualmente demasiado parecidas.

---

# 30. REMOTION

Para vídeo:

Utilizar la infraestructura actual de Remotion.

Reutilizar:

* Composition
* Sequence
* interpolate
* spring
* useCurrentFrame
* useVideoConfig
* inputProps

cuando sea apropiado.

No crear un segundo sistema de vídeo.

---

# 31. CARRUSELES Y REMOTION

Investiga si podemos utilizar Remotion también para generar los carruseles estáticos.

Si técnicamente encaja bien, prefiero compartir:

* componentes
* fuentes
* colores
* layouts
* assets
* sistema de diseño

entre vídeo y carrusel.

El carrusel debe poder exportarse como imágenes individuales:

```text
01.png
02.png
03.png
04.png
...
```

---

# 32. CALIDAD

Antes de considerar una pieza terminada:

### Visual

* comprobar overflow
* comprobar márgenes
* comprobar tipografía
* comprobar contraste
* comprobar jerarquía
* comprobar alineación
* comprobar consistencia

### Contenido

* comprobar claridad
* comprobar que responde realmente a una duda
* eliminar texto innecesario
* evitar afirmaciones sin fundamento

### Feed

* comprobar publicaciones anteriores
* comprobar color
* comprobar layout
* comprobar densidad
* comprobar variedad

---

# 33. REGLA DE ORO

Cuando haya conflicto entre:

```text
contenido
```

y:

```text
armonía del feed
```

gana el contenido.

No quiero sacrificar una buena pieza únicamente para mantener una cuadrícula perfecta.

La armonía debe ser una consecuencia del sistema, no una cárcel.

---

# 34. MVP

No intentes construir todo inmediatamente.

Primero:

### Reels

* PresetSwitch
* StyleSwitch
* ColorSwitch

### Carruseles

* Question
* Mistakes
* Checklist

### Visual System

* 3 layouts Reel
* 3 layouts Carousel
* 4 temas cromáticos
* sistema tipográfico
* sistema de espaciado
* sistema de portada

### Content

* 20 ideas de Reel
* 20 ideas de Carousel

### Feed

Implementar lógica básica para analizar las últimas publicaciones y evitar repetición visual.

---

# 35. ORDEN DE TRABAJO

Antes de tocar código:

1. Analiza el proyecto.
2. Analiza Maketa.
3. Analiza Remotion.
4. Identifica componentes reutilizables.
5. Identifica el Design System actual.
6. Propón la arquitectura.
7. Propón el sistema visual.
8. Propón los templates.
9. Propón ejemplos.
10. Después implementa.

No empieces creando componentes sin entender primero lo que ya existe.

---

# RESULTADO FINAL

Quiero que el resultado sea un sistema que permita pensar:

```text
IDEA
 ↓
CONTENT
 ↓
TEMPLATE
 ↓
VISUAL VARIANT
 ↓
FEED CHECK
 ↓
RENDER
 ↓
READY TO PUBLISH
```

y que permita producir contenido de Maketa de forma constante manteniendo una identidad visual reconocible.

El objetivo final no es simplemente generar Reels y carruseles.

El objetivo es construir un **sistema editorial y visual propio de Maketa**.
