import { useContent } from '../../content/context'
import { useStructure } from '../PreviewCanvas'
import { Icon } from '../Icon'
import { Button } from '../ui'
import { Reveal } from '../Reveal'

function Heading({ pricing }) {
  return (
    <Reveal className="db-section__head db-section__head--center">
      <h2>{pricing.title}</h2>
      <p className="db-lead">{pricing.subtitle}</p>
    </Reveal>
  )
}

function Features({ items, iconSet }) {
  return (
    <ul className="db-plan__features">
      {items.map((it) => (
        <li key={it}>
          <Icon set={iconSet} name="check" size={16} />
          {it}
        </li>
      ))}
    </ul>
  )
}

export function PricingCards() {
  const { pricing } = useContent()
  const { iconSet } = useStructure()

  return (
    <section className="db-section" data-section="pricing">
      <div className="db-container">
        <Heading pricing={pricing} />
        <div className="db-grid-3 db-plans">
          {pricing.plans.map((plan, i) => {
            const featured = plan.tier === 'destacado'
            return (
              <Reveal
                key={plan.name}
                delay={i * 0.06}
                className={`db-card db-plan ${featured ? 'db-plan--featured' : ''}`}
              >
                {featured && <span className="db-plan__badge">Recomendado</span>}
                <h3>{plan.name}</h3>
                <p className="db-plan__tagline">{plan.tagline}</p>
                <p className="db-plan__price">
                  <span>{plan.price}</span>
                  {plan.period && <em>{plan.period}</em>}
                </p>
                <Features items={plan.features} iconSet={iconSet} />
                <Button variant={featured ? 'primary' : 'ghost'}>{plan.cta}</Button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function PricingRows() {
  const { pricing } = useContent()
  const { iconSet } = useStructure()

  return (
    <section className="db-section" data-section="pricing">
      <div className="db-container">
        <Heading pricing={pricing} />
        <div className="db-plan-rows">
          {pricing.plans.map((plan, i) => {
            const featured = plan.tier === 'destacado'
            return (
              <Reveal
                key={plan.name}
                delay={i * 0.05}
                className={`db-plan-row ${featured ? 'db-plan-row--featured' : ''}`}
              >
                <div className="db-plan-row__info">
                  <h3>
                    {plan.name}
                    {featured && <span className="db-plan__badge">Recomendado</span>}
                  </h3>
                  <p className="db-plan-row__tagline">{plan.tagline}</p>
                  <Features items={plan.features} iconSet={iconSet} />
                </div>
                <div className="db-plan-row__price">
                  <p>
                    <span>{plan.price}</span>
                    {plan.period && <em>{plan.period}</em>}
                  </p>
                  <Button variant={featured ? 'primary' : 'ghost'}>{plan.cta}</Button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
