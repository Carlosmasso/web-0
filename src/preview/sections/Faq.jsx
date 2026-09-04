import { useState } from 'react'
import { useContent } from '../../content/context'
import { useStructure } from '../PreviewCanvas'
import { Icon } from '../Icon'
import { Reveal } from '../Reveal'

// Cada pregunta guarda su propio estado: no es un acordeón excluyente, así
// que abrir una no cierra las demás. Menos sorpresa para quien solo quiere
// leer dos respuestas seguidas.
function FaqItem({ item, iconSet, delay }) {
  const [open, setOpen] = useState(false)

  return (
    <Reveal delay={delay} className="db-faq__item" data-open={open}>
      <button type="button" className="db-faq__q" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{item.q}</span>
        <Icon set={iconSet} name="chevron" size={18} />
      </button>
      <div className="db-faq__a-wrap">
        <div className="db-faq__a-clip">
          <p className="db-faq__a">{item.a}</p>
        </div>
      </div>
    </Reveal>
  )
}

export function FaqAccordion() {
  const { faq } = useContent()
  const { iconSet } = useStructure()

  return (
    <section className="db-section" data-section="faq">
      <div className="db-container db-faq__narrow">
        <Reveal className="db-section__head db-section__head--center">
          <h2>{faq.title}</h2>
        </Reveal>
        <div className="db-faq__list">
          {faq.items.map((item, i) => (
            <FaqItem key={item.q} item={item} iconSet={iconSet} delay={i * 0.04} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function FaqGrid() {
  const { faq } = useContent()

  return (
    <section className="db-section" data-section="faq">
      <div className="db-container">
        <Reveal className="db-section__head">
          <h2>{faq.title}</h2>
        </Reveal>
        <div className="db-faq__grid">
          {faq.items.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04} className="db-faq__pair">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
