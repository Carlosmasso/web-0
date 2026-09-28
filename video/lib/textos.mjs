// ============================================================
// LOS TEXTOS DE PUBLICACIÓN — lo que acompaña a cada pieza (solo Node)
//
//   instagram.txt   el pie
//   tiktok.txt      la versión corta (solo los reels)
//   linkedin.txt    en los carruseles, el pie sin hashtags; en cualquier pieza,
//                   el texto propio de la idea (`linkedin`), si lo trae
//   ficha.md        qué es, cómo se ve y cómo publicarlo
//
// El pie no se escribe entero: se COMPONE con piezas cortas, así una idea
// nueva sale con el suyo sin escribir nada.
//
//   1  dolor     una pregunta con el problema del dueño del negocio. Es lo
//                único que se ve antes del "más". La de la idea (`dolor`); si
//                no, la de la plantilla del reel o el gancho del carrusel.
//   2  cuerpo    una o dos frases: qué aporta. El `pie` de la idea; si no, el
//                `cuerpo` de la plantilla del reel o el concepto del carrusel.
//   3  maketa    el bloque de Maketa (lista con flechas, enlace en la bio y
//                "yo te la construyo"), solo en reels y si el cuerpo no lo
//                nombra ya.
//   4  CTA       por reglas: portada rejilla → comentar el número; pilar
//                producto → comentar WEB (se contesta con el enlace por
//                privado); el resto, la de la idea o la de su pilar.
//   5  hashtags  de 3 a 5, del sector del cliente, no del mundo del diseño.
//
// Fase 0 (DIFUSION.md): ni precios ni presupuestos. "Gratis y sin registro" sí:
// dice que probar no cuesta nada, no pone precio a un servicio (como la landing).
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { NEGOCIOS } from '../datos/negocios.mjs'
import { PLANTILLAS, enLetra } from '../src/motor/plantillas.js'
import { ctaDe, cuantosDe, ganchoDe, serieDe, visualDe } from './modelo.mjs'

const plano = (t) => String(t ?? '').replace(/\*/g, '')
const bloques = (...partes) => partes.filter(Boolean).join('\n\n')

const MAKETA = [
  'En maketa.es diseñas tú:\n→ Tu estilo\n→ Tus secciones\n→ Tus textos',
  'Todo en directo, gratis y sin registro (enlace en la bio).',
  'Y cuando tengas claro cómo la quieres, yo te la construyo.',
].join('\n\n')
const PIDE_WEB = '¿Quieres probarla? Comenta WEB y te mando el enlace por privado 👇'
const PIDE_NUMERO = '¿Con cuál te quedas? Comenta el número 👇'

/**
 * La llamada a la acción del pie, por reglas: rejilla → el número; producto →
 * WEB; si no, la de la idea, la pregunta de la plantilla del reel (ligada a lo
 * que enseña) o la del pilar.
 */
function ctaPie(p, sistema) {
  if (p.formato === 'reel' && visualDe(p, sistema).portada === 'rejilla') return PIDE_NUMERO
  if (p.pilar === 'product') return PIDE_WEB
  if (p.formato === 'reel' && !p.cta) return PLANTILLAS[p.reel.plantilla].comenta ?? ctaDe(p, sistema)
  return ctaDe(p, sistema)
}

/** De 3 a 5 hashtags: los del sector del negocio (reels) o del tema (carruseles). */
function hashtagsDe(p) {
  // El vídeo de marca no es de un sector: sus hashtags, los generales.
  const negocio = p.video ? null : NEGOCIOS[p.reel?.negocio]
  const propios = negocio
    ? negocio.etiquetas.slice(0, 2)
    : p.video
      ? ['emprendedores', 'webparanegocios']
      : [(p.tema ?? 'web').replace(/[^a-záéíóúñ0-9]/gi, ''), 'webparanegocios']
  return [...propios, 'pequeñocomercio', 'negociolocal', 'diseñoweb'].map((e) => `#${e}`).join(' ')
}

/** Los pies de Instagram, TikTok y LinkedIn de una pieza. */
export function piesDe(p, sistema) {
  const cta = ctaPie(p, sistema)
  if (p.formato === 'reel') {
    const plantilla = PLANTILLAS[p.reel.plantilla]
    const datos = { n: enLetra(cuantosDe(p) ?? 1), negocio: NEGOCIOS[p.reel.negocio] }
    const dolor = p.dolor ?? plantilla.dolor(datos)
    const cuerpo = p.pie ?? plantilla.cuerpo(datos)
    const maketa = /maketa/i.test(cuerpo) ? null : MAKETA
    return {
      instagram: bloques(dolor, cuerpo, maketa, cta, hashtagsDe(p)),
      tiktok: bloques(p.pieTikTok ?? dolor, 'Diséñala tú: maketa.es', '#pequeñocomercio #negociolocal #diseñoweb'),
      // Los reels no van a LinkedIn salvo que la idea traiga su propio texto:
      // allí funciona una historia en primera persona, no el pie de Instagram.
      ...(p.linkedin ? { linkedin: p.linkedin } : {}),
    }
  }
  // En un carrusel, la primera línea es su gancho (la frase de la portada).
  const dolor = p.dolor ?? plano(ganchoDe(p))
  const cuerpo = p.pie ?? p.concepto ?? null
  return {
    instagram: bloques(dolor, cuerpo, cta, hashtagsDe(p)),
    linkedin: p.linkedin ?? bloques(dolor, cuerpo, cta.replace(/\s*👇$/, '')),
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
\`instagram.txt\`; si lo creaste con \`--video\`, sube en su lugar
\`01.mp4\`, \`02.mp4\`… (Instagram admite carruseles de vídeos). En
LinkedIn, \`carrusel.pdf\` como documento, con \`linkedin.txt\`.`
}

El enlace va en la biografía (maketa.es): en el pie no se puede pulsar. El
protocolo de después de publicar está en DIFUSION.md.
`,
  )
}
