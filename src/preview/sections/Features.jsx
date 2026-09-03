import { useContent } from '../../content/context'
import { Frame } from '../ui'
import { Icon } from '../Icon'
import { Reveal } from '../Reveal'

function Heading({ effects, features }) {
  return (
    <Reveal effects={effects} className="db-section__head">
      <h2>{features.title}</h2>
      <p className="db-lead">{features.subtitle}</p>
    </Reveal>
  )
}

export function FeatureGrid({ config }) {
  const { features } = useContent()
  return (
    <section className="db-section">
      <div className="db-container">
        <Heading effects={config.effects} features={features} />
        <div className="db-grid-3">
          {features.items.map((f, i) => (
            <Reveal key={f.title} effects={config.effects} delay={i * 0.06} className="db-card db-feature">
              <span className="db-feature__icon">
                <Icon set={config.iconSet} name={f.icon} size={24} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeatureRows({ config }) {
  const { features } = useContent()
  return (
    <section className="db-section">
      <div className="db-container">
        <Heading effects={config.effects} features={features} />
        <div className="db-rows">
          {features.items.map((f, i) => (
            <Reveal
              key={f.title}
              effects={config.effects}
              className={`db-row ${i % 2 ? 'db-row--flip' : ''}`}
            >
              <div className="db-row__body">
                <span className="db-feature__icon">
                  <Icon set={config.iconSet} name={f.icon} size={24} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
              <Frame src={f.image} alt="" ratio="4 / 3" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeatureBento({ config }) {
  const { features } = useContent()
  const [a, b, c] = features.items
  return (
    <section className="db-section">
      <div className="db-container">
        <Heading effects={config.effects} features={features} />
        <div className="db-bento">
          <Reveal effects={config.effects} className="db-card db-bento__wide">
            <div>
              <span className="db-feature__icon">
                <Icon set={config.iconSet} name={a.icon} size={24} />
              </span>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
            </div>
            <Frame src={a.image} alt="" ratio="16 / 9" />
          </Reveal>
          <Reveal effects={config.effects} delay={0.06} className="db-card db-bento__tile db-bento__accent">
            <span className="db-feature__icon">
              <Icon set={config.iconSet} name={b.icon} size={24} />
            </span>
            <h3>{b.title}</h3>
            <p>{b.body}</p>
          </Reveal>
          <Reveal effects={config.effects} delay={0.12} className="db-card db-bento__tile">
            <span className="db-feature__icon">
              <Icon set={config.iconSet} name={c.icon} size={24} />
            </span>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
