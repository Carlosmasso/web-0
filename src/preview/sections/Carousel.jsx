import { useRef } from 'react'
import { useContent } from '../../content/context'
import { Icon } from '../Icon'
import { Reveal } from '../Reveal'

function useTrack() {
  const ref = useRef(null)
  const nudge = (dir) => {
    const el = ref.current
    if (!el) return
    const slide = el.querySelector('.db-slide')
    const step = slide ? slide.getBoundingClientRect().width + 26 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }
  return { ref, nudge }
}

function Controls({ nudge, iconSet }) {
  return (
    <div className="db-carousel__controls">
      <button type="button" onClick={() => nudge(-1)} aria-label="Anterior">
        <Icon set={iconSet} name="arrow" size={18} />
      </button>
      <button type="button" onClick={() => nudge(1)} aria-label="Siguiente">
        <Icon set={iconSet} name="arrow" size={18} />
      </button>
    </div>
  )
}

function Shell({ config, kind }) {
  const { carousel } = useContent()
  const { ref, nudge } = useTrack()
  return (
    <section className="db-section">
      <div className="db-container">
        <Reveal effects={config.effects} className="db-carousel__head">
          <h2>{carousel.title}</h2>
          <Controls nudge={nudge} iconSet={config.iconSet} />
        </Reveal>
      </div>
      <div className={`db-carousel db-carousel--${kind}`}>
        <div className="db-carousel__track" ref={ref}>
          {carousel.items.map((s) => (
            <article className="db-slide" key={s.title}>
              <div className="db-slide__media">
                {s.image ? <img src={s.image} alt="" loading="lazy" /> : null}
              </div>
              <div className="db-slide__body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export const CarouselPeek = (props) => <Shell {...props} kind="peek" />
export const CarouselCards = (props) => <Shell {...props} kind="cards" />
export const CarouselFull = (props) => <Shell {...props} kind="full" />
