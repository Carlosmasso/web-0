import { useEffect, useMemo, useRef, useState } from 'react'
import { SECTION_ORDER } from '../config/schema'
import { navTargets } from './nav-targets'
import { useContent } from '../content/context'
import { useStructure } from './PreviewCanvas'
import { Icon } from './Icon'
import { Button } from './ui'

/**
 * Baja hasta la sección SIN tocar la URL. El preview guarda el diseño entero en
 * el hash (`preview.html#<config>~<contenido>`) y un salto de ancla nativo se lo
 * llevaría por delante: el enlace compartido volvería al diseño por defecto.
 * Los `id` siguen puestos, así que `tusitio.com/#pricing` sí funciona solo.
 */
function goToSection(event, id, motionLevel) {
  const el = document.getElementById(id)
  if (!el) return // sin destino, que el navegador haga lo suyo
  event.preventDefault()

  const quiet =
    motionLevel === 'none' ||
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  const behavior = quiet ? 'auto' : 'smooth'

  // La portada ES el principio: pararse en su borde dejaría la barra flotando
  // sobre un trozo de hero en vez de enseñarlo entero.
  if (id === 'hero') window.scrollTo({ top: 0, behavior })
  else el.scrollIntoView({ behavior, block: 'start' })

  // Quien navega con teclado o lector de pantalla tiene que llegar también, no
  // solo ver cómo se mueve la página.
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** Los enlaces legales llegan como una cadena separada por "·". */
function legalItems(legal) {
  return (legal || '')
    .split('·')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function Nav() {
  const { brand } = useContent()
  const { iconSet, components, sectionOrder, motion: motionLevel } = useStructure()
  // Cuatro barras que se distinguen de un vistazo: la completa (todo), la
  // centrada (enlaces en el eje), la compacta (todo a la derecha) y la isla
  // flotante. El reparto lo hace el CSS a partir de [data-nav]; aquí solo se
  // decide QUÉ va dentro. El "Entrar" es de la completa: en las demás la
  // derecha se queda con el botón solo, que es lo que las hace respirar.
  const variant = components.nav?.variant ?? 'standard'
  const withLogin = variant === 'standard'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)

  const targets = useMemo(
    () => navTargets(brand.navLinks, sectionOrder),
    [brand.navLinks, sectionOrder],
  )
  // El botón del menú es la promesa principal: lleva a donde se actúa.
  const ctaTarget = (sectionOrder?.length ? sectionOrder : SECTION_ORDER).includes('cta')
    ? 'cta'
    : 'db-footer'
  const go = (event, id) => goToSection(event, id, motionLevel)

  // Al bajar, la barra se compacta y gana fondo y sombra: le da presencia y
  // "capa" sin robar altura mientras lees. Se lee la posición una vez y luego
  // en cada scroll (pasivo, sin trabajo si el estado no cambia).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cierra con Escape o al tocar fuera. Solo se engancha mientras el menú
  // está abierto: nada de listeners de documento colgados en reposo.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const onPointer = (e) => {
      if (!navRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  return (
    <header
      className="db-nav"
      data-nav={variant}
      data-open={open}
      data-scrolled={scrolled}
      ref={navRef}
    >
      <div className="db-container db-nav__inner">
        <a className="db-wordmark" href="#">{brand.name}</a>
        <nav className="db-nav__links">
          {brand.navLinks.map((link, i) => (
            <a key={link} href={`#${targets[i]}`} onClick={(e) => go(e, targets[i])}>
              {link}
            </a>
          ))}
        </nav>
        <div className="db-nav__actions">
          {withLogin && (
            <a className="db-nav__login" href="#">
              {brand.login}
            </a>
          )}
          <Button onClick={(e) => go(e, ctaTarget)}>{brand.navCta}</Button>
          <button
            className="db-nav__burger"
            type="button"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="db-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon set={iconSet} name={open ? 'close' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      <nav id="db-mobile-menu" className="db-nav__mobile" inert={!open}>
        <div className="db-container db-nav__mobile-inner">
          {brand.navLinks.map((link, i) => (
            <a
              key={link}
              href={`#${targets[i]}`}
              onClick={(e) => {
                setOpen(false)
                go(e, targets[i])
              }}
            >
              {link}
            </a>
          ))}
          {withLogin && (
            <a className="db-nav__mobile-login" href="#" onClick={() => setOpen(false)}>
              {brand.login}
            </a>
          )}
        </div>
      </nav>
    </header>
  )
}

export function Footer() {
  const { components } = useStructure()
  return components.footer?.variant === 'slim' ? <FooterSlim /> : <FooterFull />
}

/** Pie completo: marca + tagline + tres columnas de enlaces + línea legal. */
function FooterFull() {
  const { brand, footer } = useContent()

  return (
    <footer className="db-footer" id="db-footer">
      <div className="db-container db-footer__inner">
        <div className="db-footer__brand">
          <span className="db-wordmark">{brand.name}</span>
          <p>{footer.tagline}</p>
        </div>
        <div className="db-footer__cols">
          {footer.groups.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              <ul>
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="db-container db-footer__legal">
        <span>© 2026 {brand.name}</span>
        <span className="db-footer__legal-links">
          {legalItems(footer.legal).map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </span>
      </div>
    </footer>
  )
}

/** Pie sobrio: una sola fila. Sin columnas de enlaces inventadas — para la
    mayoría de negocios pequeños es lo honesto. */
function FooterSlim() {
  const { brand, footer } = useContent()

  return (
    <footer className="db-footer db-footer--slim" id="db-footer">
      <div className="db-container db-footer__slim">
        {/* <div className="db-footer__brand"> */}
          <span className="db-wordmark">{brand.name}</span>
        {/* </div> */}
          <p>{footer.tagline}</p>
        <div className="db-footer__slim-end">
          <span className="db-footer__legal-links">
            {legalItems(footer.legal).map((item) => (
              <a href="#" key={item}>
                {item}
              </a>
            ))}
          </span>
          <span className="db-footer__copy">© 2026 {brand.name}</span>
        </div>
      </div>
    </footer>
  )
}
