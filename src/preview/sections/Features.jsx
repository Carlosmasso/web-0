import { useContent } from '../../content/context'
import { useStructure } from '../PreviewCanvas'
import { Frame } from '../ui'
import { Icon } from '../Icon'
import { Reveal } from '../Reveal'

function Heading({ features }) {
  return (
    <Reveal className="db-section__head">
      <h2>{features.title}</h2>
      <p className="db-lead">{features.subtitle}</p>
    </Reveal>
  )
}

function FeatureIcon({ name }) {
  const { iconSet } = useStructure()
  return (
    <span className="db-feature__icon">
      <Icon set={iconSet} name={name} size={24} />
    </span>
  )
}

export function FeatureGrid() {
  const { features } = useContent()

  return (
    <section className="db-section">
      <div className="db-container">
        <Heading features={features} />
        <div className="db-grid-3">
          {features.items.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06} className="db-card db-feature">
              <FeatureIcon name={f.icon} />
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeatureRows() {
  const { features } = useContent()
  const { components } = useStructure()
  const showMedia = components.card.media !== 'none'

  return (
    <section className="db-section">
      <div className="db-container">
        <Heading features={features} />
        <div className="db-rows">
          {features.items.map((f, i) => (
            <Reveal key={f.title} className={`db-row ${i % 2 ? 'db-row--flip' : ''}`}>
              <div className="db-row__body">
                <FeatureIcon name={f.icon} />
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
              {showMedia && <Frame src={f.image} ratio="4 / 3" />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeatureBento() {
  const { features } = useContent()
  const { components } = useStructure()
  const showMedia = components.card.media !== 'none'
  const [a, b, c] = features.items

  return (
    <section className="db-section">
      <div className="db-container">
        <Heading features={features} />
        <div className="db-bento">
          <Reveal className="db-card db-bento__wide">
            <div>
              <FeatureIcon name={a.icon} />
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </div>
            {showMedia && <Frame src={a.image} ratio="16 / 9" />}
          </Reveal>
          <Reveal delay={0.06} className="db-card db-bento__tile db-bento__accent">
            <FeatureIcon name={b.icon} />
            <h3>{b.title}</h3>
            <p>{b.body}</p>
          </Reveal>
          <Reveal delay={0.12} className="db-card db-bento__tile">
            <FeatureIcon name={c.icon} />
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
