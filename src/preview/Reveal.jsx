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

  // 'expressive' añade desenfoque de entrada y un punto de escala: la aparición
  // se lee como "revelado con profundidad", no solo un desplazamiento un poco
  // más largo. 'subtle' es una entrada corta y limpia.
  const expressive = level === 'expressive'
  const from = expressive
    ? { opacity: 0, filter: 'blur(10px)', transform: 'translateY(32px) scale(0.985)' }
    : { opacity: 0, filter: 'blur(0px)', transform: 'translateY(12px) scale(1)' }
  const to = { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px) scale(1)' }

  return (
    <motion.div
      className={className}
      style={style}
      initial={from}
      whileInView={to}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: expressive ? 0.8 : 0.5,
        delay: expressive ? delay * 1.4 : delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
