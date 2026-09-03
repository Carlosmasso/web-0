import { useContent } from '../content/context'
import { Icon } from './Icon'

export function Nav({ config }) {
  const { brand } = useContent()
  return (
    <header className="db-nav">
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
          <button className="db-btn db-btn--primary db-btn--sm" type="button">
            {brand.navCta}
          </button>
          <button className="db-nav__burger" type="button" aria-label="Menú">
            <Icon set={config.iconSet} name="menu" size={22} />
          </button>
        </div>
      </div>
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
