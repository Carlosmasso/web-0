import { useContent } from '../../content/context'
import { Button } from '../ui'
import { Reveal } from '../Reveal'

function Actions({ config, cta }) {
  return (
    <div className="db-cta__actions">
      <Button variant="invert" iconSet={config.iconSet} withArrow>
        {cta.primary}
      </Button>
      <Button variant="invert-ghost">{cta.secondary}</Button>
    </div>
  )
}

export function CtaBoxed({ config }) {
  const { cta } = useContent()
  return (
    <section className="db-section">
      <div className="db-container">
        <Reveal effects={config.effects} className="db-cta db-cta--boxed">
          <h2>{cta.title}</h2>
          <p>{cta.body}</p>
          <Actions config={config} cta={cta} />
        </Reveal>
      </div>
    </section>
  )
}

export function CtaBanner({ config }) {
  const { cta } = useContent()
  return (
    <section className="db-cta db-cta--banner">
      <div className="db-container db-cta__inner">
        <Reveal effects={config.effects}>
          <h2>{cta.title}</h2>
          <p>{cta.body}</p>
        </Reveal>
        <Reveal effects={config.effects} delay={0.08}>
          <Actions config={config} cta={cta} />
        </Reveal>
      </div>
    </section>
  )
}
