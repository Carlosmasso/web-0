# 30 ideas de reels para el motor

Cada fila es un reel del motor: se convierte en vídeo escribiendo un JSON en
esta carpeta (`{ "plantilla", "negocio", "variantes": "auto" }` y, si hace
falta, `gancho` o `pregunta`) y ejecutando `pnpm reel reels/<nombre>.json`.
Ninguna necesita código nuevo.

Cada una responde a una sola pregunta: **¿qué cambia si modifico X?**
"Auto" significa que el motor elige las variantes más distintas entre sí
(`src/motor/elegir.js`).

Hechas: 1, 8, 14, 20, 21, 26 y 30 (los JSON de esta carpeta).

| # | Plantilla | Negocio | Variable | Gancho | Variantes |
| - | --------- | ------- | -------- | ------ | --------- |
| 1 | `preset` | peluqueria | Preset | "Cinco presets. *Una misma web.*" | auto (5) |
| 2 | `preset` | rural | Preset | "Tu casa rural, *de cinco maneras*." | auto (5) |
| 3 | `preset` | abogados | Preset | "¿Un despacho *tiene que ser serio*?" | Corporativo, Editorial, Neo-brutalismo, SaaS oscuro |
| 4 | `preset` | taller | Preset | "Un taller *que no parece un taller*." | auto (4) |
| 5 | `preset` | obrador | Preset | "El mismo pan, *cinco escaparates*." | auto (5) |
| 6 | `preset` | arquitectura | Preset | "Tu estudio, *con otra piel*." | Inmobiliaria, Editorial, Glassmorfismo, Restauración de mantel |
| 7 | `preset` | fisio | Preset | "De clínica a *marca*." | auto (4) |
| 8 | `estilo` | taller | Estilo | "Mismo diseño. *Otro estilo.*" | auto (5) |
| 9 | `estilo` | dental | Estilo | "Una clínica, *seis acabados*." | los 6 estilos |
| 10 | `estilo` | peluqueria | Estilo | "Del cristal *a la plastilina*." | Glassmorfismo, Claymorfismo, Material, Minimalista |
| 11 | `estilo` | obrador | Estilo | "¿Tu obrador es *brutalista*?" | Neo-brutalismo, Claymorfismo, Minimalista |
| 12 | `estilo` | arquitectura | Estilo | "Menos es más. *¿O no?*" | Minimalista, Neo-brutalismo, Cyberpunk, Material |
| 13 | `estilo` | rural | Estilo | "La misma casa, *otro acabado*." | auto (4) |
| 14 | `color` | dental | Color | "La web de tu clínica, *en cinco colores*." | auto (5) |
| 15 | `color` | peluqueria | Color | "Tu color de marca *lo cambia todo*." | auto (5) |
| 16 | `color` | taller | Color | "¿Azul de taller? *Hay más.*" | Azul, Terracota, Verde, Vino |
| 17 | `color` | abogados | Color | "Un despacho *no tiene por qué ser azul*." | Índigo, Vino, Verde, Ciruela |
| 18 | `color` | fisio | Color | "¿Qué color *transmite calma*?" | Turquesa, Verde, Azul, Índigo |
| 19 | `color` | rural | Color | "Tu casa rural, *en los colores del monte*." | Verde, Terracota, Vino, Turquesa |
| 20 | `color` | obrador | Color | "El mismo obrador. *Cuatro colores.*" | Terracota, Turquesa, Vino, Azul (a mano) |
| 21 | `tipografia` | abogados | Tipografía | "Mismo texto, *cuatro tipografías*." | auto (4) |
| 22 | `tipografia` | obrador | Tipografía | "La letra *también se come*." | Bricolage, Playfair, Archivo Black, Outfit |
| 23 | `tipografia` | arquitectura | Tipografía | "Serif o sin serif: *se nota*." | Newsreader, Inter Tight, Space Grotesk, Source Serif |
| 24 | `tipografia` | peluqueria | Tipografía | "¿Elegante *o cercana*?" | Playfair, Outfit, Sora, Bricolage |
| 25 | `tipografia` | taller | Tipografía | "Una letra *con fuerza*." | Archivo Black, Space Grotesk, Chakra Petch, Inter Tight |
| 26 | `estilo+color` | fisio | Estilo + color | "Otro estilo, *otro color*. La misma web." | auto (4) |
| 27 | `preset+color` | rural | Preset + color | "Cambia el preset *y el color*." | auto (4) |
| 28 | `tipografia+color` | peluqueria | Tipografía + color | "Otra letra, *otro color*." | auto (4) |
| 29 | `preset+color` | dental | Preset + color | "La misma clínica, *irreconocible*." | auto (4) |
| 30 | `tipografia+estilo` | arquitectura | Tipografía + estilo | "La letra y el acabado *lo cambian todo*." | auto (4) |

Nota sobre las combinaciones: solo existen las que producen un cambio que
merece un reel (`src/motor/plantillas.js`). No hay `preset+estilo` ni
`preset+tipografia`: el preset ya fija su estilo y su letra, y pisarlos
enturbia la pregunta.
