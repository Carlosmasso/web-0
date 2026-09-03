import { useId } from 'react'
import { useStructure } from './PreviewCanvas'
import { Icon } from './Icon'

/**
 * El componente es idéntico en las seis estéticas. Lo que cambia es qué
 * significa :active, y eso vive en CSS bajo [data-aesthetic].
 */
export function Button({ children, variant = 'primary', withArrow = false }) {
  const { components, iconSet } = useStructure()
  const { shape, fill } = components.button

  return (
    <button
      type="button"
      className={`db-btn db-btn--${variant}`}
      data-shape={shape}
      data-fill={fill}
    >
      <span>{children}</span>
      {withArrow && <Icon set={iconSet} name="arrow" size={18} />}
    </button>
  )
}

export function Field({ label, placeholder, type = 'email', hint }) {
  const { components } = useStructure()
  const id = useId()

  return (
    <div className="db-field" data-variant={components.input.variant}>
      {label && (
        <label className="db-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className="db-field__control" type={type} placeholder={placeholder} />
      {hint && <p className="db-field__hint">{hint}</p>}
    </div>
  )
}

export function Eyebrow({ children }) {
  return <p className="db-eyebrow">{children}</p>
}

/** Marco de imagen. Un src vacío deja el marco solo: el contenido aún no está puesto. */
export function Frame({ src, alt = '', ratio = '4 / 3' }) {
  return (
    <div className="db-frame" style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : null}
    </div>
  )
}
