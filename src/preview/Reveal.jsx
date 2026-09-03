import { motion, useReducedMotion } from 'motion/react'

// Scroll-in reveal. Purpose: storytelling. Content enters in reading order as
// the user arrives at it. Collapses to a plain element under reduced motion
// or when effects are off.
export function Reveal({ children, delay = 0, effects = 'subtle', className, style }) {
  const reduce = useReducedMotion()

  if (effects === 'none' || reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  const rise = effects === 'expressive' ? 26 : 12
  const duration = effects === 'expressive' ? 0.7 : 0.5

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, transform: `translateY(${rise}px)` }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  )
}
