import { useContent } from '../../content/context'
import { Reveal } from '../Reveal'

function Attribution({ q }) {
  return (
    <div className="db-quote__by">
      {q.avatar ? <img src={q.avatar} alt="" loading="lazy" /> : null}
      <span>
        <strong>{q.name}</strong>
        <span>{q.role}</span>
      </span>
    </div>
  )
}

export function TestimonialQuote({ config }) {
  const { testimonial } = useContent()
  const q = testimonial.quotes[0]
  return (
    <section className="db-section db-section--tint">
      <div className="db-container">
        <Reveal effects={config.effects} className="db-quote-lead">
          <p className="db-quote-lead__text">{q.text}</p>
          <Attribution q={q} />
        </Reveal>
      </div>
    </section>
  )
}

export function TestimonialGrid({ config }) {
  const { testimonial } = useContent()
  return (
    <section className="db-section db-section--tint">
      <div className="db-container">
        <Reveal effects={config.effects} className="db-section__head">
          <h2>{testimonial.title}</h2>
        </Reveal>
        <div className="db-grid-3">
          {testimonial.quotes.slice(0, 3).map((q, i) => (
            <Reveal key={q.name} effects={config.effects} delay={i * 0.06} className="db-card db-quote">
              <p>{q.text}</p>
              <Attribution q={q} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
