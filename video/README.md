# Vídeos con Remotion

Los vídeos, en 1080x1920 a 30 fps; los carruseles, imágenes de 1080x1350.
Es un subproyecto aparte, con sus propias dependencias: Remotion no entra en
el bundle de la app. `out/` está en `.gitignore`.

```bash
cd video
pnpm install
pnpm studio      # editor en el navegador: PlantillaReel, las 40 piezas, el intro
pnpm reels       # el calendario de publicación
pnpm reels 1     # renderiza la semana 1 → out/semana-01/…/video.mp4 + pies + ficha
pnpm carrusel carruseles/x.json   # un carrusel → out/carruseles/x/ (PNG, PDF, hoja)
```

## El motor de reels: "¿qué cambia si modifico X?"

Reels de 9 a 12 s que enseñan **una variable** del configurador sobre la web
real de un negocio: preset, estilo, color, tipografía o una combinación. Cada
reel es un JSON en [`reels/`](reels/); la composición es siempre la misma.

```bash
pnpm reel reels/color01.json           # → out/reels/color01.mp4
pnpm reel reels/*.json                 # todos
```

```json
{ "plantilla": "color", "negocio": "dental", "variantes": "auto", "cantidad": 5 }
```

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Datos | `reels/*.json` | Un reel: plantilla, negocio, variantes (o `"auto"`), y opcionalmente `gancho`, `pregunta` y `base`. Se registran solos como composiciones `Reel-<nombre>` |
| Plantillas | `src/motor/plantillas.js` | Qué ejes cambia cada una, su gancho, su pregunta final y sus ajustes de base. `preset`, `estilo`, `color`, `tipografia` y las combinaciones con sentido |
| Ejes | `src/motor/ejes.js` | Cómo se aplica cada variable (el mismo parche que el configurador), cómo se nombra y su transición |
| Selección automática | `src/motor/elegir.js` | Las N variantes más distintas entre sí, por muestreo del punto más lejano con distancias explícitas (estética, modo, tono, clase de letra) |
| Resolutor | `src/motor/resolver.js` | JSON → pasos (fotograma, config, etiqueta) y duración |
| Composición | `src/motor/Reel.jsx` | Gancho → variantes → cierre, con el acabado del intro |
| Animaciones | `src/animaciones.js` | Entrada, salida, texto palabra a palabra, barrido y mezcla de colores y configs. Compartidas con la plantilla de la cola |

**Dos transiciones, según lo que cambie.** El color hace *morph*: la paleta del
contrato se interpola fotograma a fotograma y la web entera se transforma en
su sitio, porque sombras, degradados y contraste se derivan de ella. Lo
discreto (preset, estilo, letra) hace *barrido*: la variante nueva se pinta
de arriba abajo sobre la anterior, con una línea de luz. En ningún caso es un
fundido entre capturas.

Las ideas pendientes están en [`reels/IDEAS.md`](reels/IDEAS.md).

## Carruseles para Instagram y LinkedIn

Carruseles educativos (1080x1350, 4:5) sobre cómo encargar, tener y mejorar
una web. **Mismo universo visual que los reels, mismo motor**: Remotion
también renderiza imágenes fijas, así que los carruseles comparten las
fuentes, los colores de `marca.js`, el logo, el empaquetado y el render.

```bash
pnpm carrusel carruseles/pregunta-dominio.json   # → out/carruseles/pregunta-dominio/
pnpm carrusel carruseles/*.json                  # todos
pnpm carrusel carruseles/pruebas/*.json          # los de resistencia (3, 5, 9 diapositivas, textos largos)
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
Diapositiva.jsx        el DISEÑO: siete variantes genéricas hechas con piezas.jsx
        ↓
Carrusel.jsx           un fotograma por diapositiva → carrusel.mjs captura PNG, PDF y hoja
```

| Pieza | Archivo | Qué hace |
| --- | --- | --- |
| Datos | `carruseles/*.json` | Un carrusel. Se registran solos como composiciones |
| Plantillas | `src/carrusel/plantillas.js` | `pregunta`, `errores`, `checklist`: contenido → diapositivas, con errores legibles si falta un campo |
| Variantes | `src/carrusel/Diapositiva.jsx` | `portada`, `respuesta`, `punto`, `caso`, `item`, `lista`, `cierre` |
| Piezas | `src/carrusel/piezas.jsx` | Titular, texto con `*acento*`, antetítulo, iconos, casilla, tarjeta, pastilla |
| Formato | `src/carrusel/formato.js` | Tamaño, márgenes y escala tipográfica |
| Ajuste | `src/carrusel/Ajustar.jsx` | Que el texto quepa (ver abajo) |
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
`portada { antetitulo, titulo, texto }`, `cierre { antetitulo, titulo, texto,
cta, ctaIcono }`, y `tema`, `nivel` y `pie` para organizarlos.

```jsonc
// pregunta: portada → la respuesta corta ("Depende.") y de qué depende → un caso
// por diapositiva (si… → entonces…) → [resumen] → cierre
{ "plantilla": "pregunta",
  "respuesta": { "titulo": "Depende.", "texto": "Sobre todo, de…" },
  "casos": [{ "icono": "capas", "si": "Tu web usa *WordPress*", "resumen": "Si usa un gestor",
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

### Que el texto quepa

Todos los tamaños se escriben con `px()`, que multiplica por `--k`. Cuando las
fuentes han cargado, `Ajustar` mide la zona de contenido y, si algo se sale,
baja `--k` hasta que quepa: el bloque entero encoge en proporción y la
jerarquía se mantiene. Si ni al 62 % cabe, **el render falla** diciendo qué
diapositiva y qué texto; es preferible a publicar una frase cortada. Los
titulares largos empiezan además más pequeños (`tamanoTitular`), para que un
titular corto no encoja por culpa del texto de debajo.

### Una plantilla nueva

Una función más en `plantillas.js` que devuelva diapositivas con las variantes
que ya hay. Solo si ninguna sirve (la comparación a dos columnas, el árbol de
decisión) se añade una variante en `Diapositiva.jsx`, con las piezas de
`piezas.jsx` y nunca con estilos propios. Las siete plantillas que faltan y
las 100 ideas están en [`carruseles/IDEAS.md`](carruseles/IDEAS.md).

## La plantilla de los reels de la cola

[`src/plantilla/PlantillaReel.jsx`](src/plantilla/PlantillaReel.jsx): 15 s
(450 fotogramas) con **la misma estructura y el mismo acabado que el vídeo de
marca**, para que la cuenta entera parezca de una sola mano:

| Escena | Archivo | Qué se ve |
| --- | --- | --- |
| Gancho (100 f) | `EscenaGancho.jsx` | Fondo tinta con el halo azul; una frase grande que entra palabra a palabra, subiendo y enfocándose |
| Demo (290 f) | `EscenaDemo.jsx` | Fondo claro. Arriba, la pastilla del intro dice qué cambia ("Estilo · Cyberpunk", "Color principal · #0F766E"…); en medio, la web real en una tarjeta que se transforma; debajo, una frase |
| Cierre (90 f) | `../escenas/Cierre.jsx` | El mismo del intro: la marca y "Diséñala tú. Yo la construyo." |

Entre escenas, el deslizamiento y el fundido del intro. Encima de todo, una
línea fina de progreso en el azul de marca.

Tres reglas de acabado, que salen de una corrección y conviene no deshacer:

- **La web no salta.** Cada cambio de diseño se funde en un tercio de segundo
  (dos capas de la web, la anterior y la nueva), como hacen los colores en el
  propio configurador. Sin golpes de escala ni rebotes en la tarjeta.
- **Los mismos muelles que el intro** (`MUELLE.suave`, `vivo` y `pop` de
  `src/marca.js`). El rebote solo está en detalles pequeños, como el valor de la
  pastilla.
- **Tipografía y color de la marca.** Inter 700 con el interletraje del intro,
  acento en el azul de maketa.es. Nada de subtítulos en mayúsculas con contorno
  ni colores de reclamo (amarillo): se probó y el vídeo parecía uno cualquiera.

### Dónde se edita cada cosa

- **Un reel suelto**: copia el objeto de
  [`src/plantilla/ejemplo.js`](src/plantilla/ejemplo.js): el gancho, qué va en
  la tarjeta y qué cambia en cada fotograma, las frases de debajo
  `[desde, hasta, 'texto']` y el cierre. Lo que va `*entre asteriscos*` sale en
  azul. En `pnpm studio` se ve en vivo y se puede tocar desde el panel de props.
- **Los reels de la cola**: los textos y tiempos de cada formato están en
  [`scripts/social/lib/formatos.mjs`](../scripts/social/lib/formatos.mjs); el
  cierre, el del ejemplo.
- **Imagen o vídeo en vez de la web**: `pantalla: { tipo: 'imagen', src: 'captura.png' }`
  o `{ tipo: 'video', src: 'clip.mp4' }`, con el archivo en `video/public/`.

### La web real dentro de la tarjeta

[`src/plantilla/Escenario.jsx`](src/plantilla/Escenario.jsx) pinta
`PreviewCanvas` + `DemoPage` de `../src/preview/`, con el mismo CSS y los
mismos guardarraíles que el configurador. Cada cambio (`estetica`, `color`,
`tipografia`, `portada`) se aplica con el mismo parche que usa la herramienta
([`web.js`](src/plantilla/web.js)): es el producto de verdad. Cuatro
decisiones que no conviene deshacer sin pensarlo:

- **Va dentro de un iframe de 410 px, ampliado x2.** El CSS del sitio usa
  media queries de ventana; sin iframe saldría la versión de escritorio.
- **Transiciones y animaciones CSS del sitio apagadas, y `motion: 'none'`.**
  Van por reloj, no por fotograma, y saldrían a medias. El ritmo lo pone la
  plantilla.
- **Fuentes e imágenes se precargan antes del primer fotograma**
  (`delayRender`), todas las del reel de una vez.
- **Una sola copia de React** ([`webpack.mjs`](webpack.mjs), compartido por
  `remotion.config.js` y `publicar.mjs`): los componentes de `../src/` la
  resolverían desde la raíz y los hooks fallarían. También relaja la exigencia
  de extensiones en los imports, porque la raíz declara `"type": "module"`.

### Publicar

[`publicar.mjs`](publicar.mjs) (`pnpm reels`) sustituye al antiguo
`grabar.mjs`: empaqueta una vez y renderiza cada pieza de las semanas pedidas
con sus pies (`instagram.txt`, `tiktok.txt`) y su ficha. Una semana (tres
reels) tarda alrededor de un minuto.

## `IntroMaketa`

```bash
cd video
pnpm install
pnpm studio    # editor en el navegador, para ajustar tiempos
pnpm render    # out/intro-maketa.mp4 (unos 10 s)
pnpm still --frame=150   # un fotograma suelto, para revisar
pnpm exec remotion still src/index.jsx AvatarInstagram out/avatar-instagram.png   # foto de perfil 1080x1080
```

Es un subproyecto aparte, con sus propias dependencias: Remotion no entra en el
bundle de la app. `out/` está en `.gitignore`.

### Estructura

| Archivo | Qué |
| --- | --- |
| `src/IntroMaketa.jsx` | Las tres escenas encadenadas con `TransitionSeries` y los cruces con muelle. |
| `src/escenas/Problema.jsx` | 0-4 s: "Crear una landing page no debería tomar días.", se tacha "días" y entra la marca. |
| `src/escenas/Demo.jsx` | 4-11 s: una web simulada que cambia de color, de tipografía y de variante de sección, con una etiqueta que dice qué cambia. |
| `src/escenas/Cierre.jsx` | 11-15 s: la marca y "Diséñala tú. Yo la construyo." |
| `src/marca.js` | Colores de la landing, las tres paletas de la demo y los muelles. |
| `src/AvatarInstagram.jsx` | Foto de perfil: el favicon a sangre sobre el azul de marca, con margen para el recorte circular de Instagram. |
| `src/Logo.jsx` | El dibujo del favicon; su último bloque "se coloca" al aparecer. |

Los tiempos de cada escena están arriba de cada archivo, en fotogramas locales.

### Dos decisiones

- **Nada se mueve en línea recta.** Todo sale de `spring()` con tres muelles
  (`suave`, `vivo`, `pop`, en `marca.js`); cambiar uno cambia el carácter de todo
  el vídeo a la vez.
- **El cierre no promete autoservicio.** El cliente diseña y la web la monta
  Carlos (PLAN.md, "Lo que NO hacemos"). Por eso no dice "lánzala en minutos".

`Logo.jsx` no se llama `Marca.jsx` a propósito: en macOS, que no distingue
mayúsculas, chocaría con `marca.js` al resolver `import '../Marca'`.
