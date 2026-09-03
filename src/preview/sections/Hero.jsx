import { motion, useReducedMotion } from 'motion/react'
import { useContent } from '../../content/context'
import { Button, Eyebrow, Frame } from '../ui'
import { Reveal } from '../Reveal'

function Actions({ config, hero }) {
  return (
    <div className="db-hero__actions">
      <Button variant="primary" iconSet={config.iconSet} withArrow>
        {hero.primary}
      </Button>
      <Button variant="ghost">{hero.secondary}</Button>
    </div>
  )
}

export function HeroSplit({ config }) {
  const { hero } = useContent()
  const reduce = useReducedMotion()
  const parallax = config.effects === 'expressive' && !reduce
  return (
    <section className="db-section db-hero db-hero--split">
      <div className="db-container db-hero__grid">
        <Reveal effects={config.effects} className="db-hero__body">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1>{hero.title}</h1>
          <p className="db-lead">{hero.subtitle}</p>
          <Actions config={config} hero={hero} />
        </Reveal>
        <motion.div
          className="db-hero__visual"
          initial={parallax ? { transform: 'translateY(24px)' } : false}
          whileInView={parallax ? { transform: 'translateY(0px)' } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <Frame src={hero.image} alt="" ratio="4 / 5" />
        </motion.div>
      </div>
    </section>
  )
}

export function HeroCentered({ config }) {
  const { hero } = useContent()
  return (
    <section className="db-section db-hero db-hero--centered">
      <div className="db-container db-hero__center">
        <Reveal effects={config.effects}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1>{hero.title}</h1>
          <p className="db-lead">{hero.subtitle}</p>
          <Actions config={config} hero={hero} />
        </Reveal>
        <Reveal effects={config.effects} delay={0.1} className="db-hero__center-visual">
          <Frame src={hero.image} alt="" ratio="16 / 9" />
        </Reveal>
      </div>
    </section>
  )
}

export function HeroImage({ config }) {
  const { hero } = useContent()
  return (
    <section
      className="db-section db-hero db-hero--image"
      style={{ backgroundImage: `url(${hero.image})` }}
    >
      <div className="db-hero__scrim" />
      <div className="db-container db-hero__over">
        <Reveal effects={config.effects}>
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1>{hero.title}</h1>
          <p className="db-lead">{hero.subtitle}</p>
          <Actions config={config} hero={hero} />
        </Reveal>
      </div>
    </section>
  )
}
