// ============================================================
// EL PLATÓ — grabación de reels verticales (1080x1920)
//
// Un reel se graba del producto de verdad: se abre `app.html` (build de
// producción, modo cliente), se pone el preview en modo Móvil y se esconden
// el panel y la barra. Lo que queda en cuadro es la web del cliente a pantalla
// completa; los controles se siguen pulsando desde el guion, por JS, aunque no
// se vean.
//
// Por qué el preview se queda en 402 px y se escala con `transform` en vez de
// darle 1080 px de ancho: a 1080 el sitio se renderiza en su versión de
// escritorio, y lo que queremos enseñar es cómo queda en un teléfono. El
// navegador vuelve a rasterizar tras la escala, así que no se pierde nitidez.
//
// Los fotogramas salen por CDP en tiempo real y `mux.swift` los monta en MP4.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'

/** Playwright es solo para esto, así que no está en las dependencias del proyecto. */
async function cargarPlaywright() {
  try {
    return (await import('playwright')).chromium
  } catch {
    throw new Error(
      'falta Playwright. Instálalo una vez con:  pnpm add -D playwright\n' +
        'Si ya lo tienes pero no hay navegador:   pnpm exec playwright install chromium',
    )
  }
}

/**
 * El navegador que traiga Playwright; si su build exacto no está descargado,
 * vale cualquier Chromium de la caché (el protocolo es compatible de sobra
 * para lo que hacemos aquí).
 */
function buscarNavegador(chromium) {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN
  const suyo = chromium.executablePath()
  if (fs.existsSync(suyo)) return suyo

  const cache = path.join(process.env.HOME, 'Library/Caches/ms-playwright')
  if (!fs.existsSync(cache)) return suyo
  const candidatos = fs
    .readdirSync(cache)
    .filter((d) => d.startsWith('chromium-'))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
  for (const c of candidatos) {
    const ruta = path.join(
      cache,
      c,
      'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    )
    if (fs.existsSync(ruta)) return ruta
  }
  return suyo
}

// Instagram pinta encima su propia interfaz: arriba el nombre de la cuenta,
// abajo el pie, los botones y el audio. El rótulo va bajo, pero por encima de
// esa franja. No hay marca de agua permanente: pegada al menú del sitio
// parecía un elemento más de la web del cliente, y la marca ya la pone el
// cierre.
const ROTULO_ABAJO = 430

export async function abrirPlato({ url, salida, contenido }) {
  const dirFrames = path.join(salida, 'frames')
  fs.rmSync(salida, { recursive: true, force: true })
  fs.mkdirSync(dirFrames, { recursive: true })

  const chromium = await cargarPlaywright()
  const browser = await chromium.launch({
    executablePath: buscarNavegador(chromium),
    args: ['--force-color-profile=srgb'],
  })
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
  await page.addInitScript(() => {
    try {
      localStorage.setItem('web0.tour.v1', '1')
    } catch {}
  })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)

  // preview en formato teléfono
  await page.locator('.shell__devices button', { hasText: 'Móvil' }).click()
  await page.waitForTimeout(1000)

  if (contenido) await escribirContenido(page, contenido)

  await page.addStyleTag({ content: CSS_PLATO })
  await page.evaluate(montarCapas, { rotulo: ROTULO_ABAJO })
  await page.waitForTimeout(1200)

  // ---------- captura ----------
  const cdp = await page.context().newCDPSession(page)
  const manifest = []
  let n = 0
  let t0 = 0
  cdp.on('Page.screencastFrame', async (f) => {
    const ts = f.metadata.timestamp
    if (!t0) t0 = ts
    const nombre = String(n++).padStart(5, '0') + '.jpg'
    fs.writeFileSync(path.join(dirFrames, nombre), Buffer.from(f.data, 'base64'))
    manifest.push({ file: nombre, t: ts - t0 })
    try {
      await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId })
    } catch {}
  })

  const esperar = (ms) => page.waitForTimeout(ms)

  const api = {
    page,

    async grabar() {
      await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, everyNthFrame: 1 })
      await esperar(300)
    },

    esperar,

    /** Rótulo grande. Sin argumento, lo quita. */
    async rotulo(texto) {
      await page.evaluate((t) => window.__reel.rotulo(t, false), texto ?? null)
    },

    /** Rótulo de impacto: texto enorme sobre la web, entra con rebote. */
    async golpe(texto) {
      await page.evaluate((t) => window.__reel.rotulo(t, true), texto ?? null)
    },

    /**
     * Cámara sobre el escenario. Un plano que respira —aunque sea un 4%— es la
     * diferencia entre un vídeo y una captura de pantalla con cosas moviéndose.
     * `origen` es el punto de mira: '50% 20%' encuadra la cabecera.
     */
    async camara(escala = 1, ms = 1200, origen) {
      await page.evaluate(([e, m, o]) => window.__reel.camara(e, m, o), [escala, ms, origen])
    },

    /** Destello blanco de corte, para que dos estados no se fundan en el ojo. */
    async destello() {
      await page.evaluate(() => window.__reel.destello())
    },

    /**
     * Duración de N compases al tempo dado, en milisegundos.
     *
     * Los cortes caen así en una rejilla de tiempo constante. El vídeo se
     * entrega mudo y la música se le pone en Instagram: si los cambios ya van
     * a 120 bpm, cualquier pista de ese tempo encaja sola y parece montado
     * sobre ella. A ojo, nunca cuadra.
     */
    compas(n = 1, bpm = 120) {
      return Math.round((60000 / bpm) * n)
    },

    /** Pulsa un control del panel escondido: el clic nativo dispara React igual. */
    async pulsar(locator, pausa = 1600) {
      await locator.first().evaluate((el) => el.click())
      await esperar(pausa)
    },

    /** "Diseño" o "Contenido": los campos de contenido solo existen en su pestaña. */
    pestana: (nombre, pausa = 600) =>
      api.pulsar(page.locator('.shell__tabs button', { hasText: nombre }), pausa),

    preset: (txt, pausa) => api.pulsar(page.locator('.preset', { hasText: txt }), pausa),

    /**
     * Punto de partida de un negocio: su preset y la portada que le cuadra.
     *
     * Las fotos del contenido de demostración son de bosque. En una casa rural
     * quedan bien; en una clínica dental delatan que es un montaje. Por eso el
     * negocio declara `portada: 'centrada'` y se le pone el manifiesto
     * tipográfico, que no lleva foto ninguna.
     */
    async partida(negocio, pausa = 700) {
      await api.preset(negocio.preset, pausa)
      if (!negocio.portada) return
      const variante = negocio.portada === 'imagen' ? 'Imagen de fondo' : 'Centrada'
      await api.paso(2, 350)
      await api.opcionDeSeccion('La portada', variante, 450)
      await api.paso(0, 350)
    },
    estetica: (txt, pausa) => api.pulsar(page.locator('.chip', { hasText: txt }), pausa),
    paso: (i, pausa = 700) => api.pulsar(page.locator('.steps__item').nth(i), pausa),

    /** Opción de un control por su texto, dentro de la sección que se diga. */
    async opcionDeSeccion(seccion, opcion, pausa) {
      const i = await page.evaluate((label) => {
        const secs = [...document.querySelectorAll('.sec')]
        return secs.findIndex((s) => {
          const a = s.querySelector('.ctrl__affects')
          return a && (a.textContent || '').includes(label)
        })
      }, seccion)
      if (i < 0) throw new Error('sección no encontrada: ' + seccion)
      await api.pulsar(page.locator('.sec').nth(i).locator('.opt', { hasText: opcion }), pausa)
    },

    /** Color de marca. El input es controlado: hay que usar el setter nativo. */
    async color(hex, pausa = 1500) {
      await page.evaluate((h) => {
        const input = document.querySelector('.shell__panel input[type=color]')
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
        setter.call(input, h)
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }, hex)
      await esperar(pausa)
    },

    /** Escribe un campo de contenido letra a letra, para que se vea teclear. */
    async teclear(campo, texto, { velocidad = 70, pausa = 1500 } = {}) {
      const sel = `[data-field="${campo}"] input:not([type=file]), [data-field="${campo}"] textarea`
      await page.evaluate((s) => {
        const el = document.querySelector(s)
        const setter = Object.getOwnPropertyDescriptor(
          el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
          'value',
        ).set
        setter.call(el, '')
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }, sel)
      await esperar(350)
      for (let i = 1; i <= texto.length; i++) {
        await page.evaluate(
          ([s, v]) => {
            const el = document.querySelector(s)
            const setter = Object.getOwnPropertyDescriptor(
              el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
              'value',
            ).set
            setter.call(el, v)
            el.dispatchEvent(new Event('input', { bubbles: true }))
          },
          [sel, texto.slice(0, i)],
        )
        await esperar(velocidad)
      }
      await esperar(pausa)
    },

    /** Recorre la web de arriba abajo. */
    async recorrer(ms = 5000) {
      const frame = page.frames().find((f) => f !== page.mainFrame())
      if (!frame) return
      await frame.evaluate(async (dur) => {
        const doc = document.scrollingElement || document.documentElement
        const total = doc.scrollHeight - window.innerHeight
        const t0 = performance.now()
        await new Promise((res) => {
          const tick = (now) => {
            const k = Math.min(1, (now - t0) / dur)
            const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
            window.scrollTo(0, total * e)
            k < 1 ? requestAnimationFrame(tick) : res()
          }
          requestAnimationFrame(tick)
        })
      }, ms)
    },

    async cierre(ms = 2600) {
      await page.evaluate(() => window.__reel.cierre())
      await esperar(ms)
    },

    async parar() {
      await cdp.send('Page.stopScreencast')
      await esperar(300)
      fs.writeFileSync(path.join(salida, 'manifest.json'), JSON.stringify(manifest))
      const dur = manifest.length ? manifest[manifest.length - 1].t : 0
      console.log(`fotogramas: ${manifest.length} · duración: ${dur.toFixed(1)} s`)
      await browser.close()
      return { frames: manifest.length, duracion: dur }
    },
  }

  return api
}

/** Rellena campos de la pestaña Contenido sin que se vea (antes de grabar). */
async function escribirContenido(page, campos) {
  await page.locator('.shell__tabs button', { hasText: 'Contenido' }).click()
  await page.waitForTimeout(700)
  for (const [campo, valor] of Object.entries(campos)) {
    await page.evaluate(
      ([c, v]) => {
        const el = document.querySelector(
          `[data-field="${c}"] input:not([type=file]), [data-field="${c}"] textarea`,
        )
        if (!el) return
        const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v)
        el.dispatchEvent(new Event('input', { bubbles: true }))
      },
      [campo, valor],
    )
    await page.waitForTimeout(120)
  }
  await page.locator('.shell__tabs button', { hasText: 'Diseño' }).click()
  await page.waitForTimeout(700)
}

// La escala base (2.55) llena el cuadro EXACTAMENTE. La cámara solo se acerca
// desde ahí, nunca se aleja: por debajo de 1 aparecen franjas negras arriba y
// abajo, porque no hay más teléfono que enseñar.
const CSS_PLATO = `
  .shell__panel, .shell__bar { display: none !important; }
  .shell { display: block !important; }
  .shell__stage-wrap { width: 100vw !important; height: 100vh !important; }
  .shell__stage-row { height: 100vh !important; }
  .stage {
    padding: 0 !important;
    background: #0b0b12 !important;
    overflow: hidden !important;
    transform: scale(1);
    transform-origin: 50% 42%;
    will-change: transform;
  }
  .stage--mobile .stage__device {
    max-width: 402px !important;
    width: 402px !important;
    height: 753px !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    transform: scale(2.55);
    transform-origin: top center;
  }
`

function montarCapas({ rotulo }) {
  const css = document.createElement('style')
  css.textContent = `
    #reel-rotulo{position:fixed;left:50%;transform:translateX(-50%) translateY(14px);
      bottom:${rotulo}px;z-index:2147483646;pointer-events:none;opacity:0;
      transition:opacity .4s ease,transform .4s ease;
      background:rgba(9,9,14,.93);color:#fff;padding:24px 44px;border-radius:22px;
      font:700 50px/1.15 -apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;
      letter-spacing:-.03em;max-width:900px;text-align:center;
      border:1px solid rgba(255,255,255,.16);box-shadow:0 20px 60px rgba(0,0,0,.55)}
    #reel-rotulo.on{opacity:1;transform:translateX(-50%) translateY(0)}
    #reel-cierre{position:fixed;inset:0;z-index:2147483647;pointer-events:none;opacity:0;
      transition:opacity .5s ease;background:#0b0b12;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:26px;color:#fff;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif}
    /* Rótulo de impacto: sin chapa, texto enorme sobre la propia web. Entra
       con un rebote corto, que es lo que lo hace mirar. */
    #reel-rotulo.golpe{background:none;border:0;box-shadow:none;padding:0;
      font-size:86px;line-height:1.02;font-weight:800;letter-spacing:-.045em;
      text-shadow:0 6px 30px rgba(0,0,0,.75),0 2px 8px rgba(0,0,0,.6)}
    #reel-rotulo.golpe.on{animation:reel-golpe .42s cubic-bezier(.2,1.5,.35,1)}
    @keyframes reel-golpe{
      0%{transform:translateX(-50%) scale(.82);opacity:0}
      100%{transform:translateX(-50%) scale(1);opacity:1}}
    /* Destello de corte: separa dos estados sin que el ojo los funda. */
    #reel-flash{position:fixed;inset:0;z-index:2147483646;pointer-events:none;
      background:#fff;opacity:0}
    #reel-flash.go{animation:reel-flash .22s ease-out}
    @keyframes reel-flash{0%{opacity:.82}100%{opacity:0}}
    #reel-cierre.on{opacity:1}
    #reel-cierre b{font-size:104px;letter-spacing:-.045em;font-weight:700}
    #reel-cierre span{font-size:40px;opacity:.72;font-weight:500;text-align:center;
      max-width:820px;line-height:1.3}
  `
  document.head.appendChild(css)

  const elRotulo = document.createElement('div')
  elRotulo.id = 'reel-rotulo'
  document.body.appendChild(elRotulo)

  const elCierre = document.createElement('div')
  elCierre.id = 'reel-cierre'
  elCierre.innerHTML = '<b>maketa.es</b><span>Diseña tu web tú mismo.<br>Gratis y sin registro.</span>'
  document.body.appendChild(elCierre)

  const flash = document.createElement('div')
  flash.id = 'reel-flash'
  document.body.appendChild(flash)

  window.__reel = {
    rotulo(t, golpe) {
      const el = document.getElementById('reel-rotulo')
      if (!t) {
        el.classList.remove('on')
        return
      }
      el.textContent = t
      el.classList.toggle('golpe', !!golpe)
      el.classList.add('on')
    },

    /** Mueve la cámara sobre el escenario: escala y punto de mira. */
    camara(escala, ms, origen) {
      const s = document.querySelector('.stage')
      s.style.transition = `transform ${ms}ms cubic-bezier(.33,.9,.28,1)`
      if (origen) s.style.transformOrigin = origen
      s.style.transform = `scale(${escala})`
    },

    destello() {
      const f = document.getElementById('reel-flash')
      f.classList.remove('go')
      void f.offsetWidth
      f.classList.add('go')
    },
    cierre() {
      document.getElementById('reel-cierre').classList.add('on')
    },
  }
}
