import { useContent } from '../../content/context'
import { Reveal } from '../Reveal'

/** 'Frescor Levante' -> 'FL'. Una o dos iniciales para el monograma. */
function initials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function Row({ items }) {
  return (
    <Reveal className="db-logos__row">
      {items.map((it) =>
        it.logo ? (
          <span className="db-logos__item" key={it.name}>
            <img src={it.logo} alt={it.name} loading="lazy" />
          </span>
        ) : (
          // Sin logo real: un monograma + el nombre, que se lee como una marca,
          // no como el texto plano por defecto que delata la plantilla.
          <span className="db-logos__item db-logos__lockup" key={it.name}>
            <span className="db-logos__mono" aria-hidden="true">
              {initials(it.name)}
            </span>
            <em>{it.name}</em>
          </span>
        ),
      )}
    </Reveal>
  )
}

export function LogosPlain() {
  const { logos } = useContent()
  return (
    <section className="db-section db-logos" data-section="logos">
      <div className="db-container">
        <Row items={logos.items} />
      </div>
    </section>
  )
}

export function LogosHeadline() {
  const { logos } = useContent()
  return (
    <section className="db-section db-logos" data-section="logos">
      <div className="db-container">
        <Reveal className="db-logos__head">
          <p>{logos.headline}</p>
        </Reveal>
        <Row items={logos.items} />
      </div>
    </section>
  )
}
