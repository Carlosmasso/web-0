import { motion, useReducedMotion } from 'motion/react'
import { useContent } from '../../content/context'
import { useStructure } from '../PreviewCanvas'
import { Button, Eyebrow, Frame } from '../ui'
import { Reveal } from '../Reveal'

// La aurora la pinta el lienzo (<PreviewCanvas>), no el hero: una sola
// implementación, y así las luces siguen ahí al bajar por la página.

function Actions({ hero }) {
  return (
    <div className="db-hero__actions">
      <Button withArrow>{hero.primary}</Button>
      <Button variant="ghost">{hero.secondary}</Button>
    </div>
  )
}

function Body({ hero }) {
  return (
    <>
      <Eyebrow>{hero.eyebrow}</Eyebrow>
      <h1>{hero.title}</h1>
      <p className="db-lead">{hero.subtitle}</p>
      <Actions hero={hero} />
    </>
  )
}

export function HeroSplit() {
  const { hero } = useContent()
  const { components, motion: level } = useStructure()
  const bg = components.hero.background
  const reduce = useReducedMotion()
  const parallax = level === 'expressive' && !reduce

  return (
    <section className="db-section db-hero db-hero--split" data-section="hero" data-bg={bg}>
      <div className="db-container db-hero__grid">
        <Reveal className="db-hero__body">
          <Body hero={hero} />
        </Reveal>
        <motion.div
          className="db-hero__visual"
          initial={parallax ? { transform: 'translateY(24px)' } : false}
          whileInView={parallax ? { transform: 'translateY(0px)' } : undefined}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <Frame src={hero.image} ratio="4 / 5" />
        </motion.div>
      </div>
    </section>
  )
}

export function HeroCentered() {
  const { hero } = useContent()
  const { components } = useStructure()
  const bg = components.hero.background

  return (
    <section className="db-section db-hero db-hero--centered" data-section="hero" data-bg={bg}>
      <div className="db-container db-hero__center">
        <Reveal>
          <Body hero={hero} />
        </Reveal>
        <Reveal delay={0.1} className="db-hero__center-visual">
          <Frame src={hero.image} ratio="16 / 9" />
        </Reveal>
      </div>
    </section>
  )
}

/** La foto a sangre ES el fondo, así que esta variante ignora hero.background. */
export function HeroImage() {
  const { hero } = useContent()

  return (
    <section
      className="db-section db-hero db-hero--image"
      data-section="hero"
      data-bg="image"
      style={hero.image ? { backgroundImage: `url(${hero.image})` } : undefined}
    >
      <div className="db-hero__scrim" />
      <div className="db-container db-hero__over">
        <Reveal>
          <Body hero={hero} />
        </Reveal>
      </div>
    </section>
  )
}
