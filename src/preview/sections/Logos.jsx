import { useContent } from '../../content/context'
import { Reveal } from '../Reveal'

function Row({ items }) {
  return (
    <Reveal className="db-logos__row">
      {items.map((it) => (
        <span className="db-logos__item" key={it.name}>
          {it.logo ? <img src={it.logo} alt={it.name} loading="lazy" /> : <em>{it.name}</em>}
        </span>
      ))}
    </Reveal>
  )
}

export function LogosPlain() {
  const { logos } = useContent()
  return (
    <section className="db-section db-logos" data-section="logos">
      <div className="db-container">
        <Row items={logos.items} />
      </div>
    </section>
  )
}

export function LogosHeadline() {
  const { logos } = useContent()
  return (
    <section className="db-section db-logos" data-section="logos">
      <div className="db-container">
        <Reveal className="db-logos__head">
          <p>{logos.headline}</p>
        </Reveal>
        <Row items={logos.items} />
      </div>
    </section>
  )
}
