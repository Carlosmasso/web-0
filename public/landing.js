// Maketa · landing. Sin dependencias.
// 1. Apariciones al hacer scroll (IntersectionObserver).
// 2. El configurador de la portada: plantilla de negocio, color, letra y fondo.
// 3. El carrusel circular de plantillas: autoplay, pausa al pasar por encima,
//    flechas, puntos, teclado y arrastre con el dedo.
// 4. "Abriendo tu web…" al ir al configurador.
// 5. Volver arriba: aparece al bajar y su anillo marca cuánto llevas.
;(function () {
  var doc = document.documentElement
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Eventos del embudo para Vercel Web Analytics (la cola está en index.html).
  var track = function (name, data) {
    try { window.va && window.va('event', data ? { name: name, data: data } : { name: name }) } catch (e) {}
  }

  /* ---------- 1. apariciones ---------- */
  // Se repiten al volver a bajar: un bloque se "rearma" solo cuando sale del todo
  // por abajo (has subido por encima de él). Lo que sale por arriba se queda a la
  // vista, así que al subir para releer algo no se esconde ni vuelve a entrar.
  var targets = document.querySelectorAll('.reveal, .price__list')
  if ('IntersectionObserver' in window) {
    var enter = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-in') })
    }, { rootMargin: '0px 0px -12% 0px' })
    var leave = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting && e.boundingClientRect.top > 0) e.target.classList.remove('is-in')
      })
    })
    targets.forEach(function (el) { enter.observe(el); leave.observe(el) })
  } else {
    targets.forEach(function (el) { el.classList.add('is-in') })
  }

  // Barra de progreso donde no hay animation-timeline.
  if (!CSS.supports || !CSS.supports('animation-timeline: view()')) {
    var bar = document.querySelector('.progress')
    var onScroll = function () {
      var max = doc.scrollHeight - innerHeight
      bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')'
    }
    addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  /* ---------- 2. configurador de la portada ---------- */
  var SERIF = 'Georgia, "Times New Roman", serif'
  var SANS = 'system-ui, -apple-system, "Segoe UI", sans-serif'
  var ROUND = '"Trebuchet MS", "Avenir Next", system-ui, sans-serif'
  var ICON = {
    tooth: 'M12 5.5c-1.6-1.6-4.6-2-6.3-.3-2 2-1.2 5 .1 7.4.9 1.7 1 3.4 1.4 5.5.3 1.6 1.1 2.4 2 2.4 1 0 1.4-1.2 1.6-2.6.2-1.5.5-2.6 1.2-2.6s1 1.1 1.2 2.6c.2 1.4.6 2.6 1.6 2.6.9 0 1.7-.8 2-2.4.4-2.1.5-3.8 1.4-5.5 1.3-2.4 2.1-5.4.1-7.4-1.7-1.7-4.7-1.3-6.3.3z',
    scales: 'M12 3v18M7 21h10M5 7h14M12 5.5V7M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7zm14 0l-3 7a3.5 3.5 0 0 0 6 0l-3-7z',
    house: 'M3 11.5L12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5.5h4V20',
    blocks: 'M4 13h7v7H4zM13 13h7v7h-7zM8.5 4h7v7h-7z',
    plate: 'M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 3v6.5M1 3v3.5a1.5 1.5 0 0 0 3 0V3M2.5 9.5V21M21.5 3c-1.5 1.5-2 4-2 6.5h2V21'
  }
  var TPLS = [
    { name: 'Clínica Ordóñez', domain: 'clinicaordonez.es', nav1: 'Tratamientos', nav2: 'Equipo', kicker: 'Odontología familiar · Valladolid', title: 'Ir al dentista sin que se te haga un nudo', text: 'Te explicamos qué tienes, qué cuesta y qué pasa si esperas. Sin prisa y sin tratamientos que no necesitas.', cta: 'Pedir cita', cta2: 'Ver tratamientos', hex: '#187567', font: SANS, icon: ICON.tooth, chip1: 'Lun–Vie · 9 a 20 h', chip2: 'Pide cita online', link: '/app.html?sector=medical-wellness', radius: '10px' },
    { name: 'Ferrer & Nieto', domain: 'ferrernieto.es', nav1: 'Áreas', nav2: 'El despacho', kicker: 'Laboral y mercantil · Zaragoza', title: 'Que el papeleo no decida por ti', text: 'Cuatro abogados, treinta años de sala y una norma: si no hay caso, te lo decimos en la primera reunión.', cta: 'Consulta inicial', cta2: 'Áreas de trabajo', hex: '#1d2a4d', font: SERIF, icon: ICON.scales, chip1: 'Laboral · Mercantil', chip2: 'Primera reunión', link: '/app.html?sector=corporate-legal', radius: '3px' },
    { name: 'Estudio Lomas', domain: 'estudiolomas.es', nav1: 'Proyectos', nav2: 'Estudio', kicker: 'Vivienda unifamiliar · Asturias', title: 'Casas que se parecen a quien vive en ellas', text: 'Trabajamos ocho proyectos al año. Ni uno más, porque el décimo empieza a parecerse al primero.', cta: 'Hablemos', cta2: 'Ver proyectos', hex: '#2b2d34', font: SERIF, icon: ICON.house, chip1: 'Ocho proyectos al año', chip2: 'Asturias', link: '/app.html?sector=real-estate', radius: '2px' },
    { name: 'Escuela Altamira', domain: 'escuelaaltamira.es', nav1: 'El proyecto', nav2: 'Aulas', kicker: 'Escuela infantil · 0 a 3 años', title: 'El sitio donde tu hijo aprende a estar sin ti', text: 'Grupos de ocho, dos educadoras por aula y la misma persona de referencia todo el curso.', cta: 'Pedir visita', cta2: 'Ver el proyecto', hex: '#c2401f', font: ROUND, icon: ICON.blocks, chip1: 'Grupos de ocho', chip2: 'De 0 a 3 años', link: '/app.html?sector=kids-care', radius: '999px' },
    { name: 'Casa Mendaro', domain: 'casamendaro.es', nav1: 'La carta', nav2: 'La casa', kicker: 'Cocina de temporada · San Sebastián', title: 'Lo que hay hoy depende de lo que hubo esta mañana', text: 'Carta corta que cambia cada semana con lo que llega del mercado y de la lonja.', cta: 'Reservar mesa', cta2: 'Ver la carta', hex: '#8a5a2b', font: SERIF, icon: ICON.plate, chip1: 'Carta de temporada', chip2: 'Reserva tu mesa', link: '/app.html?sector=fine-dining', radius: '3px' }
  ]
  var FONTS = { classic: SERIF, modern: SANS, round: ROUND }

  var pv = document.getElementById('pv')
  if (pv) {
    var state = { tpl: 0, color: null, font: null, dark: false }
    var $ = function (sel) { return pv.querySelector(sel) }
    var bench = document.getElementById('prueba')
    var tplBtns = bench.querySelectorAll('[data-tpl]')
    var colorBtns = bench.querySelectorAll('[data-color]')
    var fontBtns = bench.querySelectorAll('[data-font]')
    var modeBtns = bench.querySelectorAll('[data-dark]')
    var dots = pv.querySelectorAll('.dot')
    var first = bench.querySelector('[data-color="tpl"]')
    var status = document.getElementById('pv-status')
    var FONT_NAMES = { classic: 'clásica', modern: 'moderna', round: 'redonda' }
    var announce = function () {
      var t = TPLS[state.tpl]
      var fontKey = state.font || Object.keys(FONTS).filter(function (k) { return FONTS[k] === t.font })[0]
      status.textContent = t.name + '. Color: ' + document.getElementById('pv-color').textContent.toLowerCase() +
        '. Letra ' + FONT_NAMES[fontKey] + '. Fondo ' + (state.dark ? 'oscuro' : 'claro') + '.'
    }

    var mix = function (hex, amt, base) {
      var a = parseInt(hex.slice(1), 16)
      var b = parseInt(base.slice(1), 16)
      var ch = function (s) { return Math.round(((a >> s) & 255) * amt + ((b >> s) & 255) * (1 - amt)) }
      return 'rgb(' + ch(16) + ',' + ch(8) + ',' + ch(0) + ')'
    }
    var pressed = function (list, test) {
      list.forEach(function (el) { el.setAttribute('aria-pressed', String(test(el))) })
    }

    var paint = function () {
      var t = TPLS[state.tpl]
      var accent = state.color || t.hex
      if (state.dark && (accent === '#2b2d34' || accent === '#1d2a4d')) accent = '#7d8cff'
      var font = state.font ? FONTS[state.font] : t.font
      var s = pv.style
      s.setProperty('--pv-accent', accent)
      s.setProperty('--pv-ink', state.dark ? mix(accent, 0.55, '#ffffff') : accent)
      s.setProperty('--pv-font', font)
      s.setProperty('--pv-radius', t.radius)
      s.setProperty('--pv-bg', state.dark ? '#141519' : '#ffffff')
      s.setProperty('--pv-fg', state.dark ? '#f2f2f4' : '#1b1b1f')
      s.setProperty('--pv-sub', state.dark ? '#a9abb5' : '#5a5c63')
      s.setProperty('--pv-line', state.dark ? 'rgba(255,255,255,.25)' : 'rgba(27,27,31,.2)')
      s.setProperty('--pv-card', state.dark ? '#22232a' : '#ffffff')
      s.setProperty('--pv-tint', state.dark ? mix(accent, 0.22, '#141519') : mix(accent, 0.12, '#ffffff'))
      first.style.setProperty('--c', t.hex)
      document.getElementById('pv-color').textContent = state.color
        ? bench.querySelector('[data-color="' + state.color + '"]').getAttribute('aria-label')
        : 'El de la plantilla'
      pressed(tplBtns, function (el) { return +el.dataset.tpl === state.tpl })
      pressed(colorBtns, function (el) { return el.dataset.color === (state.color || 'tpl') })
      pressed(fontBtns, function (el) { return state.font ? el.dataset.font === state.font : FONTS[el.dataset.font] === t.font })
      pressed(modeBtns, function (el) { return (el.dataset.dark === '1') === state.dark })
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === state.tpl)) })
    }

    var fill = function () {
      var t = TPLS[state.tpl]
      $('#pv-domain').textContent = t.domain
      $('#pv-name').textContent = t.name
      $('#pv-nav1').textContent = t.nav1
      $('#pv-nav2').textContent = t.nav2
      $('#pv-kicker').textContent = t.kicker.toUpperCase()
      $('#pv-title').textContent = t.title
      $('#pv-text').textContent = t.text
      $('#pv-chip1').textContent = t.chip1
      $('#pv-chip2').textContent = t.chip2
      $('#pv-cta2').textContent = t.cta2
      pv.querySelectorAll('.pv-cta').forEach(function (el) { el.textContent = t.cta })
      $('#pv-cta-main').textContent = t.cta
      $('#pv-icon').setAttribute('d', t.icon)
      $('#pv-pos').textContent = state.tpl + 1 + ' / ' + TPLS.length
      document.getElementById('pv-go').setAttribute('href', t.link)
    }

    var goTpl = function (i, dir) {
      var next = (i + TPLS.length) % TPLS.length
      if (next === state.tpl) return
      state.tpl = next
      state.color = null
      state.font = null
      if (reduce) { fill(); paint(); announce(); return }
      pv.style.setProperty('--dir', (dir || 1) * 18 + 'px')
      pv.classList.add('is-swapping')
      setTimeout(function () {
        fill()
        paint()
        announce()
        pv.style.setProperty('--dir', -(dir || 1) * 18 + 'px')
        requestAnimationFrame(function () { pv.classList.remove('is-swapping') })
      }, 200)
    }

    tplBtns.forEach(function (el) { el.addEventListener('click', function () { goTpl(+el.dataset.tpl, +el.dataset.tpl > state.tpl ? 1 : -1) }) })
    dots.forEach(function (el, i) { el.addEventListener('click', function () { goTpl(i, i > state.tpl ? 1 : -1) }) })
    $('#pv-prev').addEventListener('click', function () { goTpl(state.tpl - 1, -1) })
    $('#pv-next').addEventListener('click', function () { goTpl(state.tpl + 1, 1) })
    colorBtns.forEach(function (el) {
      el.addEventListener('click', function () { state.color = el.dataset.color === 'tpl' ? null : el.dataset.color; paint(); announce() })
    })
    fontBtns.forEach(function (el) { el.addEventListener('click', function () { state.font = el.dataset.font; paint(); announce() }) })
    modeBtns.forEach(function (el) { el.addEventListener('click', function () { state.dark = el.dataset.dark === '1'; paint(); announce() }) })
    // En móvil la fila de negocios se desliza: el borde derecho se difumina mientras
    // quedan fichas por ver, y deja de hacerlo al llegar al final.
    var tplRow = bench.querySelector('[aria-labelledby="lbl-tpl"]')
    if (tplRow) {
      var edge = function () { tplRow.classList.toggle('is-end', tplRow.scrollLeft + tplRow.clientWidth >= tplRow.scrollWidth - 2) }
      tplRow.addEventListener('scroll', edge, { passive: true })
      addEventListener('resize', edge)
      edge()
    }

    fill()
    paint()
  }

  /* ---------- 3. carrusel circular ---------- */
  // Solo se animan transform y opacity (van por la GPU): nada de filtros ni sombras
  // que se repinten en cada fotograma. La tarjeta sigue al dedo mientras arrastras.
  var flow = document.getElementById('flow')
  if (flow) {
    var items = Array.prototype.slice.call(flow.querySelectorAll('.flow__item'))
    var fdots = document.querySelectorAll('#flow-dots .dot')
    var fstatus = document.getElementById('flow-status')
    var toggle = document.getElementById('flow-toggle')
    var n = items.length
    var cur = 0
    var timer = null
    var stopped = reduce          // el usuario lo ha parado (o pide menos movimiento)
    var hovering = false
    // Hasta que el observador diga que se ve, el carrusel cuenta como fuera de
    // pantalla: así el vídeo central no se descarga al cargar la página.
    var visible = !('IntersectionObserver' in window)
    var step = 300

    // velo para atenuar las laterales (más barato que un filtro)
    items.forEach(function (el) {
      var veil = document.createElement('span')
      veil.className = 'tc__veil'
      veil.setAttribute('aria-hidden', 'true')
      el.querySelector('.tcard__web').appendChild(veil)
      el._veil = veil
      el._link = el.querySelector('a')
      el._link.setAttribute('draggable', 'false')
      el._video = el.querySelector('.tc__video')
    })

    // Vídeo del gesto: solo en la tarjeta del centro, solo con la sección a la
    // vista y nunca con movimiento reducido o ahorro de datos. Mientras suena, el
    // carrusel espera a que termine para pasar a la siguiente.
    var lite = reduce || !!(navigator.connection && navigator.connection.saveData)
    var waiting = false
    var stopVideo = function (el) {
      if (!el._video) return
      el._video.pause()
      el.classList.remove('is-playing')
    }
    var syncVideo = function () {
      items.forEach(function (el, i) {
        if (i !== cur || lite || !visible || document.hidden) return stopVideo(el)
        var v = el._video
        if (!v) return
        if (!v.src) {
          v.src = v.getAttribute('data-src')
          v.addEventListener('playing', function () { el.classList.add('is-playing') })
          v.addEventListener('error', function () { waiting = false; el._video = null; el.classList.remove('is-playing') })
          v.addEventListener('ended', function () {
            waiting = false
            if (items[cur] !== el) return
            if (!stopped && !hovering && visible && !drag && !document.hidden) go(cur + 1)
            else { v.currentTime = 0; v.play().catch(function () {}) }
          })
        }
        if (!v.paused) return
        waiting = true
        v.currentTime = 0
        v.play().catch(function () { waiting = false })
      })
    }

    var measure = function () { step = innerWidth < 640 ? Math.min(250, innerWidth * 0.62) : 300 }

    // pos puede ser decimal mientras se arrastra
    var place = function (pos) {
      items.forEach(function (el, i) {
        var d = i - pos
        d = ((d % n) + n) % n
        if (d > n / 2) d -= n
        var ad = Math.abs(d)
        var cd = Math.max(-2, Math.min(2, d))
        el.style.transform = 'translate3d(' + (d * step).toFixed(1) + 'px,0,' + (-Math.min(ad, 3) * 150).toFixed(1) + 'px) rotateY(' + (-cd * 20).toFixed(2) + 'deg)'
        el.style.opacity = ad > 2.6 ? '0' : ad > 2 ? String(((2.6 - ad) / 0.6 * 0.6).toFixed(2)) : '1'
        el.style.zIndex = String(100 - Math.round(ad * 10))
        el.style.visibility = ad > 2.7 ? 'hidden' : 'visible'
        el._veil.style.opacity = String((Math.min(ad, 2) * 0.32).toFixed(2))
      })
    }
    var settle = function () {
      items.forEach(function (el, i) {
        var on = i === cur
        var d = ((i - cur) % n + n) % n
        if (d > n / 2) d -= n
        el.dataset.off = Math.abs(d) > 2 ? 'far' : String(Math.abs(d))
        el._link.tabIndex = on ? 0 : -1
        el.setAttribute('aria-hidden', String(!on))
      })
      fdots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === cur)) })
      waiting = false
      syncVideo()
    }
    var go = function (i, byUser) {
      cur = ((i % n) + n) % n
      place(cur)
      settle()
      if (byUser) {
        fstatus.textContent = items[cur].getAttribute('aria-label')
        play()                    // tras tocarlo, el autoplay vuelve a contar desde cero
      }
    }
    var tick = function () { if (!stopped && !hovering && visible && !drag && !document.hidden && !waiting) go(cur + 1) }
    var play = function () { clearInterval(timer); timer = setInterval(tick, 4200) }
    var setStopped = function (v) {
      stopped = v
      toggle.setAttribute('aria-pressed', String(v))
      toggle.setAttribute('aria-label', v ? 'Reanudar el carrusel' : 'Pausar el carrusel')
    }
    setStopped(stopped)
    toggle.addEventListener('click', function () { setStopped(!stopped) })

    // arrastre: la tarjeta sigue al dedo y al soltar se coloca en la más cercana
    var drag = null
    var moved = false
    flow.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return
      drag = { x: e.clientX, t: performance.now(), lastX: e.clientX, lastT: performance.now(), v: 0, id: e.pointerId }
      moved = false
    })
    flow.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return
      var dx = e.clientX - drag.x
      if (!moved && Math.abs(dx) < 6) return
      if (!moved) {
        moved = true
        flow.classList.add('is-dragging')
        try { flow.setPointerCapture(e.pointerId) } catch (err) {}
      }
      var now = performance.now()
      drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT)
      drag.lastX = e.clientX
      drag.lastT = now
      if (!drag.raf) {
        drag.raf = requestAnimationFrame(function () {
          if (drag) { drag.raf = 0; place(cur - (drag.lastX - drag.x) / step) }
        })
      }
    })
    var release = function (e) {
      if (!drag) return
      var d = drag
      drag = null
      flow.classList.remove('is-dragging')
      if (!moved) return
      setTimeout(function () { moved = false }, 60)   // el clic que sigue al soltar ya se ha descartado
      var pos = cur - (d.lastX - d.x) / step
      pos -= d.v * 2.2          // un gesto rápido avanza aunque el recorrido sea corto
      var target = Math.round(pos)
      if (target === cur && Math.abs(d.lastX - d.x) > 40) target = cur + (d.lastX < d.x ? 1 : -1)
      go(target, true)
    }
    flow.addEventListener('pointerup', release)
    flow.addEventListener('pointercancel', function () {
      drag = null
      flow.classList.remove('is-dragging')
      place(cur)
    })

    items.forEach(function (el, i) {
      el._link.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); moved = false; return }   // fue un arrastre, no un clic
        if (i !== cur) { e.preventDefault(); go(i, true); return }
        var piece = el._link.getAttribute('data-piece')
        if (piece) track('custom_live_opened', { piece: piece, source: 'landing' })
      })
    })
    fdots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, true) }) })
    document.getElementById('flow-prev').addEventListener('click', function () { go(cur - 1, true) })
    document.getElementById('flow-next').addEventListener('click', function () { go(cur + 1, true) })
    flow.addEventListener('mouseenter', function () { hovering = true })
    flow.addEventListener('mouseleave', function () { hovering = false })
    flow.addEventListener('focusin', function () { hovering = true })
    flow.addEventListener('focusout', function () { hovering = false })
    flow.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, true) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, true) }
    })
    // fuera de pantalla no gira (ni gasta batería)
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; syncVideo() }).observe(flow)
    }
    document.addEventListener('visibilitychange', syncVideo)
    var index = document.querySelector('[data-piece-index]')
    if (index) index.addEventListener('click', function () { track('custom_index_opened', { source: 'landing' }) })
    var rz = 0
    addEventListener('resize', function () {
      cancelAnimationFrame(rz)
      rz = requestAnimationFrame(function () { measure(); place(cur) })
    })
    measure()
    go(0)
    play()
  }

  // Las filas de negocios se paran cuando no se ven.
  var lanes = document.querySelector('.lanes')
  if (lanes && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { lanes.classList.toggle('is-off', !en[0].isIntersecting) }).observe(lanes)
  }

  /* ---------- 4. del clic al configurador ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="/app.html"]')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    doc.classList.add('is-leaving')
  })
  addEventListener('pageshow', function () { doc.classList.remove('is-leaving') })

  /* ---------- 5. volver arriba ---------- */
  // Lo crea el script para no repetirlo en cada página. El anillo se llena con
  // lo leído; al pulsar, la flecha sale hacia arriba y vuelve a entrar por abajo.
  var top = document.createElement('button')
  top.type = 'button'
  top.className = 'totop'
  top.setAttribute('aria-label', 'Volver arriba')
  top.innerHTML =
    '<span class="totop__text" aria-hidden="true">Arriba</span>' +
    '<span class="totop__dial" aria-hidden="true">' +
      '<svg class="totop__ring" viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" pathLength="1"/><circle class="totop__fill" cx="26" cy="26" r="23" pathLength="1"/></svg>' +
      '<svg class="totop__arrow" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>' +
    '</span>'
  document.body.appendChild(top)
  var fill = top.querySelector('.totop__fill')
  var ticking = false
  var sync = function () {
    ticking = false
    var max = doc.scrollHeight - innerHeight
    var k = max > 0 ? Math.min(1, scrollY / max) : 0
    fill.style.strokeDashoffset = String(1 - k)
    top.classList.toggle('is-on', scrollY > innerHeight * 0.8)
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(sync) } }, { passive: true })
  addEventListener('resize', sync)
  sync()
  top.addEventListener('click', function () {
    top.classList.remove('is-launch'); void top.offsetWidth; top.classList.add('is-launch')
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    track('back_to_top')
  })
})()
