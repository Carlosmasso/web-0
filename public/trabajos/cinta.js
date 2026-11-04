// La cinta "Web de ejemplo · Maketa" de las demos de /trabajos.html.
// Cuando alguien ya ha jugado un rato con la web, deja de informar y pasa a
// invitar: "¿Te gusta? Hazla tuya →", que abre "Quiero algo así" con esta pieza
// en /trabajos.html. El aspecto es el de cada demo (su .maketa); aquí solo el
// texto, el enlace y el rebote. Cada demo lo carga con <script defer>.
;(function () {
  var a = document.querySelector('.maketa')
  if (!a) return
  try { if (window.self !== window.top) return } catch (e) { return }
  var id = location.pathname.split('/').pop().replace(/\.html$/, '')
  if (!id) return
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  var track = function (name) {
    try { window.va && window.va('event', { name: name, data: { piece: id } }) } catch (e) {}
  }

  // Se invita cuando ya ha jugado: tres toques; o 25 s con algo tocado o media
  // página leída; o casi toda la página leída.
  var touches = 0
  var t0 = Date.now()
  var done = false
  var depth = function () {
    var max = document.documentElement.scrollHeight - innerHeight
    return max > 0 ? scrollY / max : 0
  }
  var check = function () {
    if (done) return
    var s = (Date.now() - t0) / 1000
    if (touches >= 3 || (s >= 25 && (touches >= 1 || depth() >= 0.5)) || depth() >= 0.8) invite()
  }
  document.addEventListener('pointerdown', function (e) { if (!a.contains(e.target)) { touches++; check() } }, true)
  document.addEventListener('change', function () { touches++; check() }, true)
  addEventListener('scroll', check, { passive: true })
  var timer = setInterval(check, 1000)

  var css = document.createElement('style')
  css.textContent =
    '.maketa--cta { white-space: nowrap; overflow: hidden; }' +
    '.maketa--cta .maketa__go { display: inline-block; animation: maketa-go 1.6s ease-in-out .9s 3; }' +
    '@keyframes maketa-go { 0%, 100% { transform: none; } 50% { transform: translateX(4px); } }' +
    '@media (prefers-reduced-motion: reduce) { .maketa--cta .maketa__go { animation: none; } }'
  document.head.appendChild(css)

  function invite () {
    done = true
    clearInterval(timer)
    var from = a.getBoundingClientRect().width
    a.href = '/trabajos.html?quiero=' + encodeURIComponent(id) + '#' + id
    a.innerHTML = '<span class="maketa__in">¿Te gusta? <strong>Hazla tuya</strong> <span class="maketa__go" aria-hidden="true">→</span></span>'
    a.classList.add('maketa--cta')
    a.addEventListener('click', function () { track('custom_demo_invite_clicked') })
    track('custom_demo_invite_shown')
    if (reduce || !a.animate) return
    // El ancho va del texto de antes al nuevo con un rebote; el texto entra después.
    var to = a.getBoundingClientRect().width
    a.animate([
      { width: from + 'px', transform: 'scale(1)' },
      { width: to + 'px', transform: 'scale(1.07)', offset: 0.55 },
      { width: to + 'px', transform: 'scale(1)' }
    ], { duration: 700, easing: 'cubic-bezier(.34, 1.56, .64, 1)' })
    a.firstChild.animate([
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 450, delay: 150, easing: 'ease-out', fill: 'backwards' })
  }
})()
