import { useContent } from '../../content/context'
import { Button, Field } from '../ui'
import { Reveal } from '../Reveal'

/** Captura de correo: es donde el campo de formulario entra en el sitio real. */
function Capture({ cta }) {
  return (
    <div className="db-cta__form">
      <Field placeholder={cta.placeholder} hint={cta.hint} />
      <Button withArrow>{cta.primary}</Button>
    </div>
  )
}

export function CtaBoxed() {
  const { cta } = useContent()

  return (
    <section className="db-section">
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
    <section className="db-cta db-cta--banner">
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
