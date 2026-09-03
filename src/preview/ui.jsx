import { Icon } from './Icon'

export function Button({ children, variant = 'primary', iconSet, withArrow = false }) {
  return (
    <button className={`db-btn db-btn--${variant}`} type="button">
      <span>{children}</span>
      {withArrow && <Icon set={iconSet} name="arrow" size={18} />}
    </button>
  )
}

export function Eyebrow({ children }) {
  return <p className="db-eyebrow">{children}</p>
}

// A framed visual. Empty src renders the frame alone (content not yet set).
export function Frame({ src, alt = '', ratio = '4 / 3' }) {
  return (
    <div className="db-frame" style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : null}
    </div>
  )
}
