# Reels para Instagram

Vídeos verticales (1080x1920, MP4 H.264) grabados **del producto de verdad**, no
de una maqueta: se abre el configurador compilado, se pone el preview en modo
Móvil y se pulsan sus controles desde un guion. Lo que se ve en pantalla es lo
que vería cualquiera que entre en maketa.es.

```bash
npm i -D playwright                      # una sola vez
node scripts/social/grabar.mjs           # los graba todos
node scripts/social/grabar.mjs 02        # solo el que case con "02"
node scripts/social/grabar.mjs --pies    # reescribe solo los textos, sin grabar
```

`--pies` existe porque los copys se retocan mucho más que los vídeos, y
regrabar para cambiar una coma son diez minutos tirados.

Cada pieza deja dos archivos en `scripts/social/salida/` (que está en
`.gitignore`, porque pesa y se regenera en un comando):

| Archivo | Qué es |
| --- | --- |
| `<nombre>.mp4` | El reel, listo para subir |
| `<nombre>.txt` | Pie para Instagram: párrafos y seis etiquetas |
| `<nombre>-tiktok.txt` | Pie para TikTok: una frase de gancho y tres etiquetas |

Los MP4 valen igual para las dos redes —son 9:16 y **no llevan marca de agua de
ninguna plataforma**, que es lo que penaliza TikTok en los vídeos resubidos—,
pero el texto no: el pie de Instagram en TikTok se lee como publicidad.

**Van sin música a propósito.** El audio se le pone en la propia Instagram: es
lo que pide el algoritmo y evita problemas de derechos.

## Qué hay grabado

| Pieza | Dura | De qué va |
| --- | --- | --- |
| `00-rafaga` | 9 s | La de captación: ráfaga de estilos sin introducción, cortes a tempo y bucle cerrado. |
| `01-seis-estilos` | 18 s | La misma web recorriendo seis acabados. Gancho visual puro. |
| `02-tu-color` | 16 s | Se cambia el color de marca y el diseño entero se recalcula. |
| `03-la-portada` | 21 s | Tres portadas distintas y el titular escrito a mano, letra a letra. |

## Producción en serie: el plan

Cuatro guiones artesanales no dan para publicar tres veces por semana sin que
el perfil parezca un bucle. Para eso está la cola combinatoria:

```bash
node scripts/social/grabar.mjs --calendario 0 12   # qué toca, sin grabar nada
node scripts/social/grabar.mjs --plan 0 3          # graba las piezas 1 a 3
```

Se cruzan dos catálogos —[`lib/negocios.mjs`](lib/negocios.mjs) (8 negocios de
sectores distintos) y [`lib/formatos.mjs`](lib/formatos.mjs) (5 montajes con
voces visuales distintas)— con una regla aritmética que garantiza que nada se
pise:

```
pieza i  ->  formato[i % 5]   y   negocio[(i * 3) % 8]
```

Como 3 es invertible módulo 8, la combinación no se repite hasta la **pieza 40**;
entretanto, un formato no vuelve hasta 5 piezas después y un negocio hasta 8. A
tres publicaciones por semana son trece semanas sin repetir. `plan.mjs` trae un
`revisar()` que aborta si al tocar los catálogos la cola empieza a pisarse.

**El inventario es finito y conviene saberlo**: 40 piezas. Pasadas, la salida no
es estirar la cola, es meter ejes nuevos (clientes reales, antes/después,
consejos). Un generador evita que tus ideas se pisen; no las tiene por ti.

### El cuello de botella son las fotos

Los textos y los estilos escalan solos; las imágenes no. El contenido de
demostración trae fotos de bosque, así que cada negocio declara su `portada`:
`'centrada'` (manifiesto tipográfico, sin foto) para los sectores donde una foto
de bosque delataría el montaje, `'imagen'` para los que la aguantan.

Eso resuelve la portada, que es lo que domina el plano, **pero no las secciones
de más abajo**: en cuanto la cámara baja, reaparecen las fotos de la demo. Por
eso el formato `recorrido` solo luce con los negocios de `portada: 'imagen'`.
Con un banco de fotos por sector, esta limitación desaparece y el catálogo de
negocios se puede ampliar sin límite.

## Cómo se hace uno nuevo

Copia un archivo de `reels/` y cambia el guion. Cada uno exporta tres cosas:

```js
export const ficha = { nombre, titulo, pie, pieTikTok }   // van a los .txt
export { NEGOCIO as contenido } from '../lib/negocio.mjs'
export async function guion(reel) { … }
```

Dentro del guion se dispone de `reel.rotulo()`, `.preset()`, `.estetica()`,
`.paso()`, `.color()`, `.opcionDeSeccion()`, `.teclear()`, `.recorrer()`,
`.pestana()`, `.esperar()` y `.cierre()`. Están todas en
[`lib/plato.mjs`](lib/plato.mjs).

### Las cuatro herramientas del montaje dinámico

| Qué | Para qué |
| --- | --- |
| `.golpe(texto)` | Rótulo enorme sobre la web, entra con rebote. Para los momentos de impacto; `.rotulo()` es el de explicar. |
| `.camara(escala, ms, origen)` | Acerca el plano. **Nunca por debajo de 1**: la escala base llena el cuadro justo, y por debajo aparecen franjas negras. |
| `.destello()` | Corte blanco de 0,2 s. Sin él, dos estilos seguidos se funden en el ojo y el cambio no se lee. |
| `.compas(n, bpm)` | Duración de n compases. Los cortes caen en rejilla, así que cualquier música de ese tempo encaja sola al subirlo. |

## Decisiones que conviene no deshacer sin pensarlo

- **Se sirve por la IP de la máquina, no por `localhost`.** En localhost el
  configurador arranca en modo estudio (`src/config/mode.js`) y saldrían en
  cuadro botones que el cliente no tiene, como *Descargar .zip*.
- **El preview se queda en 402 px y se escala con `transform`.** Dándole 1080 px
  de ancho el sitio se renderiza en su versión de escritorio, y lo que hay que
  enseñar es cómo queda en un teléfono. El navegador re-rasteriza tras la
  escala, así que no se pierde nitidez.
- **El panel se esconde pero sigue en el DOM**, y sus botones se pulsan por JS
  (`el.click()`, que dispara React igual). Por eso el cuadro queda limpio sin
  renunciar a manejar la herramienta.
- **El negocio de ejemplo es una casa rural** ([`lib/negocio.mjs`](lib/negocio.mjs))
  porque las fotos del contenido de demostración son de bosque. Si algún día
  cambian esas imágenes, cambia también el negocio: una panadería con foto de
  bosque no se la cree nadie.
- **Sin marca de agua permanente.** Pegada al menú del sitio parecía un elemento
  más de la web del cliente. La marca la pone el cierre.
- **El rótulo va abajo, a 430 px del borde.** Instagram tapa con su interfaz la
  franja inferior y la superior.

El montaje lo hace [`lib/mux.swift`](lib/mux.swift) con AVFoundation (se compila
solo la primera vez): los fotogramas llegan irregulares desde el navegador y se
remuestrean a 30 fps constantes, que es lo que digiere sin sorpresas cualquier
reproductor.
