import { useEffect, useState } from 'react'
import { useContent } from '../content/context'
import { useStructure } from './PreviewCanvas'
import { Icon } from './Icon'

// Botones flotantes abajo a la derecha:
//   - WhatsApp: solo si el cliente puso un número en `brand.whatsapp`.
//   - Subir arriba: SIEMPRE en el DOM (encima, vía `order`), solo aparece por
//     opacidad + escala al bajar. Así nunca reordena el flex ni empuja al de
//     WhatsApp, que queda fijo abajo.
export function FloatingActions() {
  const { brand } = useContent()
  const { iconSet } = useStructure()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // wa.me quiere dígitos en formato internacional, sin '+' ni espacios.
  const digits = String(brand.whatsapp || '').replace(/[^\d]/g, '')
  const waHref = digits.length >= 8 ? `https://wa.me/${digits}` : null

  return (
    <div className="db-fab" data-scrolled={showTop}>
      {waHref && (
        <a
          className="db-fab__btn db-fab__wa"
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
        >
          <Icon set={iconSet} name="whatsapp" size={26} />
        </a>
      )}
      <button
        type="button"
        className="db-fab__btn db-fab__top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Subir al principio"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
      >
        <Icon set={iconSet} name="arrow-up" size={22} />
      </button>
    </div>
  )
}
