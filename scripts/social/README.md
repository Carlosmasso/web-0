# Reels para Instagram y TikTok

Vídeos verticales (1080x1920, MP4 H.264) grabados **del producto de verdad**, no
de una maqueta: se abre el configurador compilado, se pone el preview en modo
Móvil y se pulsan sus controles desde un guion. Lo que se ve en pantalla es lo
que vería cualquiera que entre en maketa.es.

```bash
pnpm add -D playwright                     # una sola vez

node scripts/social/grabar.mjs             # enseña el calendario, no graba
node scripts/social/grabar.mjs 1           # graba la semana 1
node scripts/social/grabar.mjs 1-3         # de la semana 1 a la 3
node scripts/social/grabar.mjs 2 --textos  # reescribe solo los textos
```

`--textos` existe porque los copys se retocan mucho más que los vídeos, y
regrabar para cambiar una coma son diez minutos tirados.

## Lo que sale

```
salida/
  CALENDARIO.md                 el plan completo de las 14 semanas
  semana-01/
    1-rural-rafaga/
      video.mp4                 el reel, listo para subir
      instagram.txt             pie con párrafos y etiquetas
      tiktok.txt                pie de una frase
      ficha.md                  qué se ve, cuánto dura y cómo publicarlo
    2-obrador-identidad/
    3-peluqueria-portada/
  semana-02/
```

`salida/` está en `.gitignore`: pesa y se regenera con un comando.

El mismo MP4 vale para las dos redes —es 9:16 y **no lleva marca de agua de
ninguna plataforma**, que es lo que penaliza TikTok en los vídeos resubidos—,
pero el texto no: el pie de Instagram en TikTok se lee como publicidad.

**Van sin música a propósito.** El audio se le pone en la propia aplicación: es
lo que premia el algoritmo y evita problemas de derechos. Los cortes están
montados a 120 bpm, así que cualquier pista de ese tempo encaja sola.

## Cómo se construye la cola

Se cruzan dos catálogos —[`lib/negocios.mjs`](lib/negocios.mjs) (8 negocios de
sectores distintos) y [`lib/formatos.mjs`](lib/formatos.mjs) (5 montajes con
voces visuales distintas)— con una regla aritmética que garantiza que nada se
pise:

```
pieza i  ->  formato[i % 5]   y   negocio[(i * 3) % 8]
```

Como 3 es invertible módulo 8, la combinación no se repite hasta la **pieza 40**;
entretanto, un formato no vuelve hasta 5 piezas después y un negocio hasta 8. A
tres publicaciones por semana son **catorce semanas sin repetir**. `plan.mjs`
trae un `revisar()` que aborta si al tocar los catálogos la cola empieza a
pisarse.

**El inventario es finito y conviene saberlo**: 40 piezas. Pasadas, la salida no
es estirar la cola, es meter ejes nuevos (clientes reales, antes/después,
consejos). Un generador evita que tus ideas se pisen; no las tiene por ti.

## Los cinco formatos

| Formato | Voz |
| --- | --- |
| `rafaga` | Trepidante, 9 s, bucle cerrado. La de captar. |
| `identidad` | Un solo gesto repetido (el color) con la cámara entrando. |
| `portada` | Plano fijo, tres estados de una misma sección, pausado. |
| `escribir` | Quieto salvo el texto que alguien teclea. Íntimo. |
| `recorrido` | Plano largo sin cortes, contemplativo. El contrapunto. |

Esa mezcla de ritmos importa tanto como el contenido: cinco piezas trepidantes
seguidas cansan igual que cinco lentas.

### Las herramientas del montaje

Dentro de un guion hay `reel.rotulo()`, `.golpe()`, `.camara()`, `.destello()`,
`.compas()`, `.partida()`, `.preset()`, `.estetica()`, `.paso()`, `.color()`,
`.opcionDeSeccion()`, `.teclear()`, `.recorrer()`, `.pestana()` y `.esperar()`.
Están todas en [`lib/plato.mjs`](lib/plato.mjs).

| Qué | Para qué |
| --- | --- |
| `.golpe(texto)` | Rótulo enorme sobre la web, entra con rebote. Para los momentos de impacto; `.rotulo()` es el de explicar. |
| `.camara(escala, ms, origen)` | Acerca el plano. **Nunca por debajo de 1**: la escala base llena el cuadro justo, y por debajo aparecen franjas negras. |
| `.destello()` | Corte blanco de 0,2 s. Sin él, dos estilos seguidos se funden en el ojo y el cambio no se lee. |
| `.compas(n, bpm)` | Duración de n compases, para que los cortes caigan en rejilla. |

## Las fotos

Cada negocio tiene la suya en [`lib/imagenes.json`](lib/imagenes.json),
**enlazada a Pexels y nunca descargada**: el tamaño y el recorte se le piden por
parámetros al propio CDN, así que de una sola foto salen las dos proporciones
que usa el producto.

```bash
node scripts/social/revisar-imagenes.mjs   # hoja de contactos para verlas
```

Para cambiar una, pega otra URL base de `images.pexels.com` en ese JSON y vuelve
a ejecutar el revisor. Conviene verificar la URL con una petición HEAD: no todas
las fotos de Pexels siguen el patrón `pexels-photo-<id>.jpeg` y alguna da 404.

`portada` decide qué forma se le pide a la foto y cómo se encuadra el hero:
`'imagen'` para los sectores que aguantan una foto a sangre, `'centrada'` para
los que van mejor con el manifiesto tipográfico, que no lleva foto.

**El cuello de botella siguen siendo las secciones de más abajo**: en cuanto la
cámara baja, reaparecen las fotos del contenido de demostración. Por eso el
formato `recorrido` solo luce con los negocios de `portada: 'imagen'`. Con un
banco de fotos por sector, esa limitación desaparece.

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
- **Los campos de imagen llevan dos inputs**, uno de archivo y otro de URL. Hay
  que excluir el de tipo `file` o el navegador rechaza la escritura por
  seguridad.
- **Sin marca de agua permanente.** Pegada al menú del sitio parecía un elemento
  más de la web del cliente. La marca la pone el cierre.
- **El rótulo va abajo, a 430 px del borde.** Instagram tapa con su interfaz la
  franja inferior y la superior.

El montaje lo hace [`lib/mux.swift`](lib/mux.swift) con AVFoundation (se compila
solo la primera vez): los fotogramas llegan irregulares desde el navegador y se
remuestrean a 30 fps constantes, que es lo que digiere sin sorpresas cualquier
reproductor.
