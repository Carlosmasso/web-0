import { useEffect, useRef, useState } from 'react'
import { useContent } from '../content/context'
import { useStructure } from './PreviewCanvas'
import { Icon } from './Icon'
import { Button } from './ui'

export function Nav() {
  const { brand } = useContent()
  const { iconSet } = useStructure()
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)

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
    <header className="db-nav" data-open={open} ref={navRef}>
      <div className="db-container db-nav__inner">
        <span className="db-wordmark">{brand.name}</span>
        <nav className="db-nav__links">
          {brand.navLinks.map((link) => (
            <a key={link} href="#">
              {link}
            </a>
          ))}
        </nav>
        <div className="db-nav__actions">
          <a className="db-nav__login" href="#">
            {brand.login}
          </a>
          <Button>{brand.navCta}</Button>
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
          {brand.navLinks.map((link) => (
            <a key={link} href="#" onClick={() => setOpen(false)}>
              {link}
            </a>
          ))}
          <a className="db-nav__mobile-login" href="#" onClick={() => setOpen(false)}>
            {brand.login}
          </a>
        </div>
      </nav>
    </header>
  )
}

export function Footer() {
  const { brand, footer } = useContent()

  return (
    <footer className="db-footer">
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
        <span>2026 {brand.name}</span>
        <span>{footer.legal}</span>
      </div>
    </footer>
  )
}
