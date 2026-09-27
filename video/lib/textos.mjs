// ============================================================
// LOS TEXTOS DE PUBLICACIÓN — lo que acompaña a cada pieza (solo Node)
//
//   instagram.txt   el pie, con la CTA y las etiquetas
//   tiktok.txt      una frase (solo los reels)
//   linkedin.txt    el pie, sin etiquetas de relleno (solo los carruseles)
//   ficha.md        qué es, cómo se ve, dónde y cuándo sale
//
// El pie sale de la pieza (`pie`) o, en los reels, de su plantilla. La CTA,
// de la pieza o de su pilar (contenido/sistema.mjs). Fase 0: nada de dinero.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { NEGOCIOS } from '../datos/negocios.mjs'
import { PLANTILLAS, enLetra } from '../src/motor/plantillas.js'
import { ctaDe, cuantosDe, ganchoDe, serieDe, visualDe } from './modelo.mjs'

const plano = (t) => String(t ?? '').replace(/\*/g, '')

function etiquetasDe(p) {
  const negocio = NEGOCIOS[p.reel?.negocio]
  const tema = (p.tema ?? 'web').replace(/[^a-záéíóúñ0-9]/gi, '')
  return ['diseñoweb', ...(negocio?.etiquetas ?? [tema]), 'pequeñocomercio'].map((e) => `#${e}`).join(' ')
}

/** Los pies de Instagram, TikTok y LinkedIn de una pieza. */
export function piesDe(p, sistema) {
  const cta = ctaDe(p, sistema)
  if (p.formato === 'reel') {
    const plantilla = PLANTILLAS[p.reel.plantilla]
    const datos = { n: enLetra(cuantosDe(p) ?? 1), negocio: NEGOCIOS[p.reel.negocio] }
    return {
      instagram: `${p.pie ?? plantilla.pie(datos)}\n\n${etiquetasDe(p)}`,
      tiktok: `${p.pieTikTok ?? plantilla.pieTikTok(datos)}\n\n#diseñoweb #pequeñocomercio`,
    }
  }
  const cuerpo = p.pie ?? plano(ganchoDe(p))
  return {
    instagram: `${cuerpo}\n\n${cta}\n\n${etiquetasDe(p)}`,
    linkedin: `${cuerpo}\n\n${cta}`,
  }
}

/** Escribe los textos y la ficha de una pieza en `destino`. */
export function escribirTextos(p, destino, { ideas, sistema, detalle = null }) {
  fs.mkdirSync(destino, { recursive: true })
  for (const [red, texto] of Object.entries(piesDe(p, sistema))) {
    fs.writeFileSync(path.join(destino, `${red}.txt`), texto.trim() + '\n')
  }
  const v = visualDe(p, sistema)
  const serie = serieDe(p, ideas, sistema)
  const filas = [
    ['Formato', p.formato === 'reel' ? `Reel · 1080x1920 · ${detalle ?? '9-13 s'}` : `Carrusel · 1080x1350 · ${detalle ?? '?'} diapositivas`],
    ['Pilar', sistema.PILARES[p.pilar]?.nombre ?? '—'],
    ['Serie', serie ? `${serie.nombre} · ${String(serie.numero).padStart(2, '0')}` : '—'],
    ['Tema', p.tema ?? '—'],
    ['Visual', `tema ${v.tema} · layout ${v.layout}`],
  ]
  fs.writeFileSync(
    path.join(destino, 'ficha.md'),
    `# ${p.id} · ${plano(ganchoDe(p))}

| | |
| --- | --- |
${filas.map(([k, val]) => `| ${k} | ${val} |`).join('\n')}

## Cómo publicarlo

${
  p.formato === 'reel'
    ? `Sube \`video.mp4\` y, como portada, \`portada.png\`. Va mudo a propósito: el
audio se elige en la propia aplicación. El mismo vídeo vale para Instagram y
TikTok, pero cada uno con su texto (\`instagram.txt\`, \`tiktok.txt\`).`
    : `En Instagram, las imágenes \`01.png\`, \`02.png\`… en ese orden, con
\`instagram.txt\`. En LinkedIn, \`carrusel.pdf\` como documento, con
\`linkedin.txt\`.`
}

El enlace va en la biografía (maketa.es): en el pie no se puede pulsar. El
protocolo de después de publicar está en DIFUSION.md.
`,
  )
}
