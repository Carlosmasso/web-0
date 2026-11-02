// ============================================================
// CAPTURAS DE LAS WEBS A MEDIDA (carrusel de la landing)
//
// Abre cada demo de public/trabajos/ en Chrome sin ventana y saca:
//   · un póster (JPEG + AVIF) y un vídeo corto (MP4 H.264, sin sonido) con el
//     gesto de esa web, en dos formatos: vertical para el carrusel de la
//     landing y apaisado ("-ancho") para las tarjetas de /trabajos.html.
// El póster es el primer fotograma del vídeo, así que el cambio no se nota.
//
// Requiere `pnpm dev` en marcha, Google Chrome y ffmpeg con libx264 y libsvtav1
// (el de Homebrew los trae).
//   pnpm capturas:trabajos            → todas
//   pnpm capturas:trabajos cata       → solo una
// Variables: BASE (por defecto http://localhost:5173) y CHROME (ruta al binario).
// ============================================================

import { spawn, execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.env.BASE || 'http://localhost:5173'
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT_IMG = 'public/trabajos/capturas'
const OUT_VID = 'public/trabajos/videos'
// Dos formatos: el vertical del carrusel de la landing (tarjeta de 360 × 470,
// capturada al triple y guardada al doble) y el apaisado de /trabajos.html
// (ventana de 16:10, guardada a 960 × 600). Los archivos anchos llevan "-ancho".
const FORMATOS = [
  { sufijo: '', W: 1080, H: 1410, OUT_W: 720, OUT_H: 940 },
  { sufijo: '-ancho', W: 1440, H: 900, OUT_W: 960, OUT_H: 600 }
]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// El gesto de cada web, en unos seis segundos. Empieza donde acaba el póster.
const GUIONES = {
  comanda: async (p) => {
    await p.wait(300); await p.click('[data-reprint]')
    await p.wait(3300); await p.click('[data-add]')
    await p.wait(700); await p.click('[data-add]')
    await p.wait(1500)
  },
  'rayos-x': async (p) => {
    await p.wait(2500); await p.click('[data-reveal]')
    await p.wait(1800); await p.click('[data-reveal]')
    await p.wait(1600)
  },
  analogica: async (p) => {
    await p.wait(700); await p.click('[data-cord]')
    await p.wait(4000)
  },
  anatomia: async (p) => {
    await p.wait(300); await p.scrollTo('#mapa', 0)
    await p.wait(1300); await p.click('.spot[data-id="cuello"]')
    await p.wait(1200); await p.click('.spot[data-id="rodilla"]')
    await p.wait(1200); await p.click('.spot[data-id="hombro"]')
    await p.wait(1300)
  },
  'mesa-de-trabajo': async (p) => {
    await p.wait(500); await p.click('[data-tidy]')
    await p.wait(1800); await p.click('[data-tidy]')
    await p.wait(1300); await p.drag('[data-obj="card"]', -260, 60, 900)
    await p.wait(900)
  },
  cata: async (p) => {
    // La portada se queda fija mientras se sirve: se baja a tramos por su sección.
    for (const f of [0.35, 0.7, 1]) {
      await p.wait(f === 0.35 ? 300 : 1100)
      await p.run(`(() => { const s = document.querySelector('[data-pour]'); scrollTo({ top: s.offsetTop + (s.offsetHeight - innerHeight) * ${f}, behavior: 'smooth' }) })()`)
    }
    await p.wait(1800)
  },
  reticula: async (p) => {
    await p.wait(500); await p.scrollTo('#calendario', 40)
    await p.wait(1600); await p.click('[data-quarters] button', 0)
    await p.wait(1300); await p.click('[data-quarters] button', 1)
    await p.wait(1400)
  },
  muestrario: async (p) => {
    await p.wait(400); await p.click('.sw[data-k="wall"]', 1)
    await p.wait(900); await p.click('.sw[data-k="sofa"]', 1)
    await p.wait(900); await p.click('.sw[data-k="floor"]', 1)
    await p.wait(1000); await p.click('[data-dusk]')
    await p.wait(1800); await p.click('.chip', 1)
    await p.wait(1200)
  },
  apuntes: async (p) => {
    await p.wait(400); await p.scrollTo('#prueba', 30)
    await p.wait(1300); await p.click('.opt', 1)
    await p.wait(1300); await p.click('[data-q-next]')
    await p.wait(900); await p.click('.opt', 2)
    await p.wait(1700)
  },
  // El día pasa solo al entrar: de media mañana a la noche, sin tocar nada.
  'reloj-de-sol': async (p) => {
    await p.wait(9400)
  }
}

const wanted = process.argv.slice(2)
const ids = wanted.length ? wanted : Object.keys(GUIONES)
for (const id of ids) if (!GUIONES[id]) throw new Error(`No hay guion para "${id}". Hay: ${Object.keys(GUIONES).join(', ')}`)

mkdirSync(OUT_IMG, { recursive: true })
mkdirSync(OUT_VID, { recursive: true })
const work = mkdtempSync(join(tmpdir(), 'maketa-capturas-'))
const port = 9300 + Math.floor(Math.random() * 500)
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--mute-audio', '--force-device-scale-factor=1',
  `--remote-debugging-port=${port}`, `--user-data-dir=${join(work, 'perfil')}`, `--window-size=${FORMATOS[0].W},${FORMATOS[0].H}`, 'about:blank'
], { stdio: 'ignore' })

try {
  let target
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250)
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page') } catch {}
  }
  if (!target) throw new Error('Chrome no ha arrancado. Revisa la variable CHROME.')

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r))
  let seq = 0
  const pending = new Map()
  const listeners = new Map()
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id) }
    else if (m.method && listeners.has(m.method)) listeners.get(m.method)(m.params)
  })
  const send = (method, params = {}) => new Promise((r) => { const n = ++seq; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })) })
  const evaluate = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value
  const mouse = (type, x, y) => send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 })
  let H = FORMATOS[0].H
  const rect = (sel, i) => evaluate(`(() => { const el = document.querySelectorAll(${JSON.stringify(sel)})[${i}]; if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } })()`)
  // Si lo que hay que pulsar está fuera de pantalla, se baja hasta ello con
  // suavidad: en el vídeo se ve como un recorrido, no como un salto.
  const center = async (sel, i = 0) => {
    let r = await rect(sel, i)
    if (!r) throw new Error(`No encuentro ${sel} [${i}]`)
    if (r.y < 40 || r.y > H - 40) {
      await evaluate(`document.querySelectorAll(${JSON.stringify(sel)})[${i}].scrollIntoView({ block: 'center', behavior: 'smooth' })`)
      await sleep(900)
      r = await rect(sel, i)
    }
    return r
  }
  const page = {
    wait: sleep,
    click: async (sel, i = 0) => {
      const c = await center(sel, i)
      await mouse('mouseMoved', c.x, c.y); await mouse('mousePressed', c.x, c.y); await sleep(60); await mouse('mouseReleased', c.x, c.y)
    },
    drag: async (sel, dx, dy, ms) => {
      const c = await center(sel)
      await mouse('mouseMoved', c.x, c.y); await mouse('mousePressed', c.x, c.y)
      const steps = Math.round(ms / 30)
      for (let s = 1; s <= steps; s++) {
        const t = s / steps, e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: c.x + dx * e, y: c.y + dy * e, button: 'left', buttons: 1 })
        await sleep(30)
      }
      await mouse('mouseReleased', c.x + dx, c.y + dy)
    },
    run: (expr) => evaluate(expr),
    scroll: (y) => evaluate(`window.scrollTo({ top: ${y}, behavior: 'smooth' })`),
    scrollTo: (sel, offset) => evaluate(`window.scrollTo({ top: document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect().top + scrollY - ${offset}, behavior: 'smooth' })`)
  }

  await send('Page.enable')

  for (const id of ids) for (const { sufijo, W, H: alto, OUT_W, OUT_H } of FORMATOS) {
    H = alto
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false })
    const dir = join(work, id + sufijo)
    mkdirSync(dir)
    let loaded
    const onLoad = new Promise((r) => { loaded = r })
    listeners.set('Page.loadEventFired', () => loaded())
    await send('Page.navigate', { url: `${BASE}/trabajos/${id}.html` })
    await onLoad
    // Que asienten las fuentes y las animaciones de entrada; fuera el aviso de ejemplo.
    await sleep(3000)
    await evaluate(`document.querySelectorAll('.maketa').forEach((el) => { el.style.display = 'none' })`)
    await sleep(150)

    // Póster.
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    const png = join(dir, 'poster.png')
    writeFileSync(png, Buffer.from(shot.data, 'base64'))
    const scale = `scale=${OUT_W}:${OUT_H}:flags=lanczos`
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', scale, '-q:v', '4', join(OUT_IMG, `${id}${sufijo}.jpg`)])
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', `${scale},format=yuv420p`, '-c:v', 'libsvtav1', '-crf', '36', '-frames:v', '1', join(OUT_IMG, `${id}${sufijo}.avif`)], { env: { ...process.env, SVT_LOG: '1' } })

    // Vídeo: Chrome manda un fotograma cada vez que la pantalla cambia; luego se
    // rellenan los huecos a 30 fps respetando el tiempo real entre fotogramas.
    const frames = []
    listeners.set('Page.screencastFrame', (f) => {
      const file = join(dir, `f${String(frames.length).padStart(5, '0')}.jpg`)
      writeFileSync(file, Buffer.from(f.data, 'base64'))
      frames.push({ file, t: f.metadata.timestamp })
      send('Page.screencastFrameAck', { sessionId: f.sessionId })
    })
    await send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: OUT_W, maxHeight: OUT_H, everyNthFrame: 1 })
    const t0 = Date.now() / 1000
    await GUIONES[id](page)
    const tEnd = Date.now() / 1000
    await send('Page.stopScreencast')
    listeners.delete('Page.screencastFrame')
    if (!frames.length) throw new Error(`${id}: no ha llegado ningún fotograma`)

    const list = frames.map((f, i) => {
      const next = i + 1 < frames.length ? frames[i + 1].t : frames[0].t + (tEnd - t0)
      return `file '${f.file}'\nduration ${Math.max(0.001, next - f.t).toFixed(3)}`
    }).join('\n') + `\nfile '${frames[frames.length - 1].file}'\n`
    writeFileSync(join(dir, 'lista.txt'), list)
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(dir, 'lista.txt'),
      '-vf', `fps=30,${scale},format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-profile:v', 'main',
      '-movflags', '+faststart', '-an', join(OUT_VID, `${id}${sufijo}.mp4`)])
    console.log(`✓ ${id}${sufijo}: póster y vídeo (${frames.length} fotogramas, ${(tEnd - t0).toFixed(1)} s)`)
  }
  ws.close()
} finally {
  // Chrome tarda un momento en soltar su perfil: se borra cuando ha salido.
  const closed = new Promise((r) => chrome.once('exit', r))
  chrome.kill()
  await Promise.race([closed, sleep(3000)])
  try { rmSync(work, { recursive: true, force: true }) } catch {}
}
