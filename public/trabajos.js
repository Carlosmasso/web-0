// Maketa · webs a medida (trabajos.html). Sin dependencias.
// 1. Cada pieza enseña su póster y, mientras está a la vista, un vídeo corto de
//    su gesto (pnpm capturas:trabajos). La web en vivo, a un toque.
// 2. "Quiero algo así": un diálogo que manda un lead a /api/lead con la pieza.
//    `?quiero=<id>` lo abre directamente (es a donde llevan las propias demos).
// 3. Eventos del embudo para Vercel Web Analytics, sin datos personales.
;(function () {
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function track(name, data) {
    try { window.va && window.va('event', data ? { name: name, data: data } : { name: name }) } catch (e) {}
  }

  /* ---------- 1. póster y vídeo de cada pieza ---------- */
  // El vídeo del gesto suena en bucle mientras su ventana está a la vista, y se
  // para al salir. Con movimiento reducido o ahorro de datos, solo el póster.
  var lite = matchMedia('(prefers-reduced-motion: reduce)').matches || !!(navigator.connection && navigator.connection.saveData)
  var screens = document.querySelectorAll('[data-screen]')
  if (!lite && 'IntersectionObserver' in window) {
    var onScreen = new Set()
    var playBox = function (box) {
      var v = box.querySelector('video')
      if (!v) return
      if (!v.src) {
        v.src = v.getAttribute('data-src')
        v.addEventListener('playing', function () { box.classList.add('is-playing') })
      }
      v.play().catch(function () {})
    }
    var pauseBox = function (box) { var v = box.querySelector('video'); if (v) v.pause() }
    var vio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) onScreen.add(e.target)
        else onScreen.delete(e.target)
        if (e.isIntersecting && !document.hidden) playBox(e.target)
        else pauseBox(e.target)
      })
    }, { threshold: 0.5 })
    screens.forEach(function (el) { vio.observe(el) })
    document.addEventListener('visibilitychange', function () {
      screens.forEach(function (el) { if (document.hidden || !onScreen.has(el)) pauseBox(el); else playBox(el) })
    })
  }

  document.addEventListener('click', function (e) {
    var live = e.target.closest && e.target.closest('[data-live]')
    if (!live) return
    var job = live.closest('[data-piece]')
    if (job) track('custom_live_opened', { piece: job.getAttribute('data-piece'), source: 'trabajos' })
  })

  /* ---------- 2. "Quiero algo así" ---------- */
  var dialog = document.querySelector('[data-want-dialog]')
  if (!dialog) return
  var form = dialog.querySelector('[data-want-form]')
  var done = dialog.querySelector('[data-want-done]')
  var title = dialog.querySelector('#want-title')
  // "¿Ninguna es lo tuyo?" usa el mismo formulario, sin plantilla de referencia.
  var NONE = 'sin-plantilla'
  var errorBox = dialog.querySelector('[data-want-error]')
  var submitBtn = dialog.querySelector('[data-want-submit]')
  var current = null
  var openedAt = 0
  var tried = false

  function open(job) {
    current = job
    var none = job.getAttribute('data-piece') === NONE
    title.textContent = none ? 'Cuéntame tu idea' : 'Quiero algo como ' + job.getAttribute('data-name')
    if (!done.hidden) {
      form.reset()
      form.hidden = false
      done.hidden = true
      tried = false
      paintErrors({})
    }
    errorBox.hidden = true
    openedAt = Date.now()
    if (dialog.showModal) dialog.showModal()
    else dialog.setAttribute('open', '')
    form.elements.name.focus()
    track('custom_lead_opened', { piece: job.getAttribute('data-piece') })
  }
  function close() {
    if (dialog.close) dialog.close()
    else dialog.removeAttribute('open')
  }

  document.querySelectorAll('[data-want]').forEach(function (btn) {
    btn.addEventListener('click', function () { open(btn.closest('[data-piece]')) })
  })
  dialog.querySelector('[data-want-close]').addEventListener('click', close)
  // Clic en el fondo oscuro: el propio <dialog> recibe el clic fuera de su caja.
  dialog.addEventListener('click', function (e) {
    if (e.target !== dialog) return
    var r = dialog.getBoundingClientRect()
    var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    if (!inside) close()
  })

  function validate() {
    var f = form.elements
    var errors = {}
    if (!f.name.value.trim()) errors.name = 'Dime cómo te llamas.'
    if (!f.email.value.trim()) errors.email = 'Necesito un email para poder escribirte.'
    else if (!EMAIL_RE.test(f.email.value.trim())) errors.email = 'Revisa el email: parece que le falta algo.'
    if (!f.consent.checked) errors.consent = 'Marca la casilla para que pueda usar tus datos.'
    return errors
  }
  function paintErrors(errors) {
    ;['name', 'email', 'consent'].forEach(function (k) {
      var input = form.elements[k]
      var out = form.querySelector('[data-err="' + k + '"]')
      out.textContent = errors[k] || ''
      if (errors[k]) input.setAttribute('aria-invalid', 'true')
      else input.removeAttribute('aria-invalid')
    })
  }
  form.addEventListener('input', function () { if (tried) paintErrors(validate()) })

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    tried = true
    var errors = validate()
    paintErrors(errors)
    var first = ['name', 'email', 'consent'].filter(function (k) { return errors[k] })[0]
    if (first) { form.elements[first].focus(); return }

    var f = form.elements
    var piece = current.getAttribute('data-piece')
    var none = piece === NONE
    var label = current.getAttribute('data-name') + ' (' + current.getAttribute('data-kind').toLowerCase() + ')'
    var intro = none ? 'Quiere una web a medida, sin plantilla de referencia.' : 'Le gusta la web de ejemplo ' + label + '.'
    var note = [intro, f.note.value.trim()].filter(Boolean).join('\n\n')

    errorBox.hidden = true
    submitBtn.disabled = true
    submitBtn.textContent = 'Enviando…'
    form.setAttribute('aria-busy', 'true')

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: f.phone.value.trim(),
        note: note,
        piece: current.getAttribute('data-name'),
        previewLink: location.origin + (none ? '/trabajos.html' : '/trabajos/' + piece + '.html'),
        consent: true,
        company: f.company.value,
        elapsedMs: Date.now() - openedAt,
      }),
    })
      .then(function (res) { return res.ok ? res.json() : {} })
      .catch(function () { return {} })
      .then(function (data) {
        submitBtn.disabled = false
        submitBtn.textContent = 'Escríbeme'
        form.removeAttribute('aria-busy')
        if (!data || !data.ok) { errorBox.hidden = false; return }
        form.hidden = true
        done.hidden = false
        done.querySelector('.btn').focus()
        track('custom_lead_sent', { piece: piece })
      })
  })

  // Las demos llevan aquí con ?quiero=<id>: esa pieza pasa a ser la destacada
  // (la que lo era ocupa su sitio en la rejilla) y se abre su formulario.
  var wanted = new URLSearchParams(location.search).get('quiero')
  var job = wanted && document.querySelector('[data-piece="' + wanted.replace(/[^a-z0-9-]/g, '') + '"]')
  if (job) {
    var feature = document.querySelector('[data-feature]')
    var featured = feature && feature.querySelector('.job')
    if (featured && job.classList.contains('job') && job !== featured) {
      var mark = document.createComment('')
      job.before(mark)
      feature.appendChild(job)
      mark.replaceWith(featured)
    }
    job.scrollIntoView({ block: 'center' })
    open(job)
  }
})()
