#!/usr/bin/env node
// Hoja de contactos para revisar las fotos de los negocios.
//
//   node scripts/social/revisar-imagenes.mjs
//
// Escribe un HTML que muestra cada foto YA RECORTADA a las dos proporciones
// que usa el producto, enlazada a Pexels y sin descargar nada. Se abre en el
// navegador, se mira, y si alguna no convence se pega otra URL base en
// `lib/imagenes.json` y se vuelve a ejecutar esto.
//
// (Un artifact publicado no serviría: su política de seguridad bloquea las
// imágenes de dominios externos.)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NEGOCIOS, foto } from './lib/negocios.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const SALIDA = path.join(AQUI, 'salida')
fs.mkdirSync(SALIDA, { recursive: true })

const tarjetas = Object.entries(NEGOCIOS)
  .map(([clave, n]) => {
    const usada = n.portada === 'imagen' ? 'apaisada' : 'vertical'
    return `
    <section>
      <h2>${n.sector} <span class="clave">${clave}</span></h2>
      <p class="meta">Portada <b>${n.portada}</b> · en el hero se usa la <b>${usada}</b></p>
      <div class="par">
        <figure class="${usada === 'vertical' ? 'usada' : ''}">
          <img src="${foto(clave, 'vertical')}" alt="vertical de ${n.sector}" loading="lazy">
          <figcaption>vertical 4:5 · variante «Dividida»</figcaption>
        </figure>
        <figure class="${usada === 'apaisada' ? 'usada' : ''}">
          <img src="${foto(clave, 'apaisada')}" alt="apaisada de ${n.sector}" loading="lazy">
          <figcaption>apaisada 16:9 · variante «Imagen de fondo»<br>
            <small>lleva velo oscuro y el titular encima</small></figcaption>
        </figure>
      </div>
    </section>`
  })
  .join('\n')

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fotos de los negocios · Maketa</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; padding:40px; background:#0e0e12; color:#f4f4f5;
    font:15px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif; }
  h1 { font-size:30px; letter-spacing:-.03em; margin:0 0 6px; }
  .intro { color:#a1a1aa; max-width:70ch; margin:0 0 36px; }
  .intro code { background:#27272a; padding:2px 6px; border-radius:5px; font-size:13px; }
  section { margin-bottom:44px; border-top:1px solid #27272a; padding-top:22px; }
  h2 { font-size:20px; margin:0 0 2px; letter-spacing:-.02em; }
  .clave { color:#71717a; font-weight:400; font-size:14px; margin-left:6px; }
  .meta { color:#a1a1aa; margin:0 0 14px; font-size:13px; }
  .par { display:flex; gap:20px; flex-wrap:wrap; align-items:flex-start; }
  figure { margin:0; opacity:.45; transition:opacity .2s; }
  figure.usada { opacity:1; }
  figure.usada figcaption { color:#a5b4fc; }
  img { display:block; border-radius:10px; background:#18181b; }
  figure:first-child img { width:240px; height:300px; object-fit:cover; }
  figure:last-child img { width:480px; height:270px; object-fit:cover; }
  figcaption { color:#71717a; font-size:12px; margin-top:8px; }
</style></head><body>
<h1>Fotos de los negocios</h1>
<p class="intro">Cada foto, recortada a las dos proporciones que usa el producto. La
<b>resaltada</b> es la que sale en el hero según la portada del negocio; la otra se usa si el
formato recorre las variantes. Para cambiar cualquiera: pega otra URL base de
<code>images.pexels.com</code> en <code>scripts/social/lib/imagenes.json</code> y vuelve a
ejecutar <code>node scripts/social/revisar-imagenes.mjs</code>.</p>
${tarjetas}
</body></html>`

const destino = path.join(SALIDA, 'revision-imagenes.html')
fs.writeFileSync(destino, html)
console.log('hoja de contactos: ' + destino)
