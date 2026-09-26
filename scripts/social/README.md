# Reels para Instagram y TikTok: el catálogo y la cola

Aquí se decide **qué** se publica y en qué orden. **Cómo** se ve lo pone la
plantilla de Remotion de [`video/`](../../video/README.md), que es también
donde se renderiza:

```bash
cd video
pnpm reels             # el calendario
pnpm reels 1           # renderiza la semana 1 en video/out/semana-01/
pnpm reels 2 --textos  # solo los pies y las fichas
```

Todos los reels comparten plantilla, con el acabado del vídeo de marca (15 s:
gancho, la web real transformándose en una tarjeta y cierre de marca). Lo que varía de uno a otro es el
**negocio** y el **formato**.

## Cómo se construye la cola

Se cruzan dos catálogos —[`lib/negocios.mjs`](lib/negocios.mjs) (8 negocios de
sectores distintos) y [`lib/formatos.mjs`](lib/formatos.mjs) (5 ideas de reel)—
con una regla aritmética que garantiza que nada se pise:

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

| Formato | Qué enseña la web |
| --- | --- |
| `rafaga` | Seis estilos seguidos, uno por segundo. La de captar. |
| `identidad` | Cinco colores de marca y luego tres tipografías. |
| `portada` | Tres portadas: dividida, centrada y con foto. |
| `escribir` | El titular tecleándose y apareciendo en la web a la vez. |
| `recorrido` | La web entera de arriba abajo. El contrapunto tranquilo. |

Cada formato es **datos**: `reel(n)` devuelve el gancho, las frases y los
cambios de la web, en fotogramas (30 por segundo). Para retocar un reel se
editan esos textos y números en `formatos.mjs`; el formato de cada campo está
explicado al principio del archivo. Los pies de Instagram y TikTok (`pie`,
`pieTikTok`) viven al lado.

Esa mezcla de ritmos importa tanto como el contenido: cinco piezas trepidantes
seguidas cansan igual que cinco lentas.

## Los negocios

Cada uno trae su preset, su contenido (nombre, titular, menú), su foto y
`quien` ("tu casa rural", "tu clínica"…), que es como le habla el gancho.

La web de cada negocio se monta en tres capas: el contenido de demostración
del sector de su preset; encima, sus **secciones propias**
([`lib/secciones.mjs`](lib/secciones.mjs)) cuando ese sector no le casa; y
encima de todo, su marca y su portada. Hoy tienen secciones propias la casa
rural, la fisio, la peluquería y el taller: sus presets son de hostelería,
salud, infancia y corporativo, y debajo salían un obrador, un dentista, una
escuela y un despacho. **Si se añade un negocio cuyo preset no sea de su
sector, necesita su entrada ahí**, con fotos de Pexels comprobadas a ojo.

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

`negocios.mjs` importa el JSON con `import … with { type: 'json' }` y no con
`fs`, para cargarse igual en Node que en el bundle de Remotion.
