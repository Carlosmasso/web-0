import { useState } from 'react'
import { useContent } from '../../content/context'
import { useStructure } from '../PreviewCanvas'
import { Button, Field } from '../ui'
import { Icon } from '../Icon'
import { Reveal } from '../Reveal'

/** Captura de correo: es donde el campo de formulario entra en el sitio real.
 *  El envío es de maqueta — al pulsar, muestra la confirmación en el sitio. */
function Capture({ cta }) {
  const { iconSet } = useStructure()
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <p className="db-cta__done" role="status">
        <Icon set={iconSet} name="check" size={18} />
        {cta.success || 'Hecho. Te escribimos enseguida.'}
      </p>
    )
  }

  return (
    <form
      className="db-cta__form"
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
    >
      <Field placeholder={cta.placeholder} hint={cta.hint} />
      <Button withArrow type="submit">
        {cta.primary}
      </Button>
    </form>
  )
}

export function CtaBoxed() {
  const { cta } = useContent()

  return (
    <section className="db-section" data-section="cta">
      <div className="db-container">
        <Reveal className="db-cta db-cta--boxed">
          <h2>{cta.title}</h2>
          <p>{cta.body}</p>
          <Capture cta={cta} />
          <p className="db-cta__aside">{cta.secondary}</p>
        </Reveal>
      </div>
    </section>
  )
}

export function CtaBanner() {
  const { cta } = useContent()

  return (
    <section className="db-cta db-cta--banner" data-section="cta">
      <div className="db-container db-cta__inner">
        <Reveal>
          <h2>{cta.title}</h2>
          <p>{cta.body}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <Capture cta={cta} />
        </Reveal>
      </div>
    </section>
  )
}
