import { motion, useReducedMotion } from 'motion/react'
import { useStructure } from './PreviewCanvas'

// Aparición al entrar en pantalla. Propósito: narrativa, el contenido llega en
// orden de lectura. Se colapsa a un elemento normal cuando el movimiento está
// desactivado o el sistema pide movimiento reducido.
export function Reveal({ children, delay = 0, className, style, ...rest }) {
  const { motion: level } = useStructure()
  const reduce = useReducedMotion()

  if (level === 'none' || reduce) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    )
  }

  const rise = level === 'expressive' ? 26 : 12
  const duration = level === 'expressive' ? 0.7 : 0.5

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, transform: `translateY(${rise}px)` }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration, delay, ease: [0.23, 1, 0.32, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
