# Vídeos con Remotion

Todo en 1080x1920 a 30 fps. Es un subproyecto aparte, con sus propias
dependencias: Remotion no entra en el bundle de la app. `out/` está en
`.gitignore`.

```bash
cd video
pnpm install
pnpm studio      # editor en el navegador: PlantillaReel, las 40 piezas, el intro
pnpm reels       # el calendario de publicación
pnpm reels 1     # renderiza la semana 1 → out/semana-01/…/video.mp4 + pies + ficha
```

## La plantilla de los reels

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
