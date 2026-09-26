// ============================================================
// LOS TEXTOS DE PUBLICACIÓN DE UN REEL
//
// Lo que acompaña al vídeo: el pie de Instagram, el de TikTok y una ficha con
// qué se ve y cómo publicarlo. Salen de la plantilla del reel (sus `pie`,
// `pieTikTok` y `queSeVe`) y del negocio (sus etiquetas). Lo usan
// `pnpm reel` y `pnpm reels`.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { NEGOCIOS } from './datos/negocios.mjs'
import { PLANTILLAS, enLetra } from './src/motor/plantillas.js'

/** Cuántas variantes tendrá un reel, para escribir "cinco" en el pie. */
const cuantas = (reel) =>
  Array.isArray(reel.variantes) ? reel.variantes.length : PLANTILLAS[reel.plantilla].ejes.length ? (reel.cantidad ?? 5) : 1

/**
 * Escribe instagram.txt, tiktok.txt y ficha.md en `destino`.
 * @param reel     el reel en datos (JSON)
 * @param segundos duración real, si ya se ha renderizado
 * @param cabecera línea opcional para la ficha (semana y puesto en la cola)
 */
export function escribirTextos(reel, destino, { segundos = null, cabecera = null } = {}) {
  const plantilla = PLANTILLAS[reel.plantilla]
  const negocio = NEGOCIOS[reel.negocio]
  const datos = { n: enLetra(cuantas(reel)), negocio }
  const etiquetas = ['diseñoweb', ...negocio.etiquetas, 'pequeñocomercio'].map((e) => '#' + e).join(' ')

  fs.mkdirSync(destino, { recursive: true })
  fs.writeFileSync(path.join(destino, 'instagram.txt'), `${reel.pie ?? plantilla.pie(datos)}\n\n${etiquetas}\n`)
  fs.writeFileSync(
    path.join(destino, 'tiktok.txt'),
    `${reel.pieTikTok ?? plantilla.pieTikTok(datos)}\n\n#diseñoweb #${negocio.etiquetas[0]} #negociolocal\n`,
  )
  fs.writeFileSync(
    path.join(destino, 'ficha.md'),
    `# ${negocio.sector} · plantilla «${reel.plantilla}»
${cabecera ? `\n${cabecera}\n` : ''}
| | |
| --- | --- |
| Negocio | ${negocio.contenido['brand.name']} (${negocio.sector}) |
| Plantilla | ${reel.plantilla} |
| Dura | ${segundos ? `${segundos.toFixed(1).replace('.', ',')} s` : 'entre 9 y 13 s'} · 1080x1920 · MP4 H.264 |

## Qué se ve

${plantilla.queSeVe}

## Cómo publicarlo

El mismo \`video.mp4\` vale para Instagram y para TikTok: es 9:16 y no lleva
marca de agua de ninguna plataforma. **Va mudo a propósito**: el audio se le
pone en la propia aplicación, que es lo que premia el algoritmo y evita líos de
derechos.

El texto NO es el mismo en las dos redes: \`instagram.txt\` allí y
\`tiktok.txt\` en TikTok, donde solo se lee la primera línea antes del «más».

El enlace va en la biografía (maketa.es), no en el pie: en el pie no se puede
pulsar. El protocolo de después de publicar está en DIFUSION.md.
`,
  )
}
