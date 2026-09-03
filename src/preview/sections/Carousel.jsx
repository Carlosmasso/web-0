import { useCallback, useEffect, useRef, useState } from 'react'
import { useContent } from '../../content/context'
import { useStructure } from '../PreviewCanvas'
import { Icon } from '../Icon'
import { Reveal } from '../Reveal'

function Shell({ kind }) {
  const { carousel } = useContent()
  const { components, iconSet } = useStructure()
  const { controls, slidesPerView } = components.carousel
  const count = carousel.items.length

  const trackRef = useRef(null)
  // Estado derivado SIEMPRE del scroll real. Las flechas se habilitan según
  // haya o no recorrido, no según un índice: con varias tarjetas por vista, el
  // último slide "navegable" no es count - 1.
  const [pos, setPos] = useState({ index: 0, atStart: true, atEnd: false })

  const measure = useCallback(() => {
    const track = trackRef.current
    const first = track?.children[0]
    if (!track || !first) return
    const base = first.offsetLeft
    const max = track.scrollWidth - track.clientWidth
    const x = track.scrollLeft
    let index = 0
    let best = Infinity
    for (let i = 0; i < track.children.length; i++) {
      const d = Math.abs(track.children[i].offsetLeft - base - x)
      if (d < best) {
        best = d
        index = i
      }
    }
    setPos({ index, atStart: x <= 1, atEnd: x >= max - 1 })
  }, [])

  const scrollToIndex = useCallback((i) => {
    const track = trackRef.current
    const first = track?.children[0]
    const slide = track?.children[i]
    if (!track || !first || !slide) return
    // Relativo al PRIMER slide, no al borde del track: descuenta el
    // padding-inline y el destino coincide con el punto de snap.
    track.scrollTo({ left: slide.offsetLeft - first.offsetLeft, behavior: 'smooth' })
  }, [])

  const step = (dir) => scrollToIndex(Math.max(0, Math.min(count - 1, pos.index + dir)))

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    track.addEventListener('scroll', onScroll, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    return () => {
      track.removeEventListener('scroll', onScroll)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [measure, count])

  const showArrows = controls === 'arrows' || controls === 'both'
  const showDots = controls === 'dots' || controls === 'both'
  // "Siguiente" se agota cuando no queda recorrido físico (varias tarjetas
  // por vista) O cuando ya estamos en el último slide (el spacer final deja
  // algo de scroll sobrante que no avanza de tarjeta).
  const atEnd = pos.atEnd || pos.index >= count - 1
  const activeDot = atEnd ? count - 1 : pos.index

  return (
    <section className="db-section">
      <div className="db-container">
        <Reveal className="db-carousel__head">
          <h2>{carousel.title}</h2>
          {showArrows && (
            <div className="db-carousel__arrows">
              <button
                type="button"
                className="db-carousel__arrow db-carousel__arrow--prev"
                aria-label="Anterior"
                disabled={pos.atStart}
                onClick={() => step(-1)}
              >
                <Icon set={iconSet} name="arrow" size={18} />
              </button>
              <button
                type="button"
                className="db-carousel__arrow"
                aria-label="Siguiente"
                disabled={atEnd}
                onClick={() => step(1)}
              >
                <Icon set={iconSet} name="arrow" size={18} />
              </button>
            </div>
          )}
        </Reveal>
      </div>

      <div
        className={`db-carousel db-carousel--${kind}`}
        style={{ '--slides-per-view': slidesPerView }}
      >
        <div className="db-carousel__track" ref={trackRef}>
          {carousel.items.map((s, i) => (
            <article className="db-slide" key={s.title} data-index={i}>
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

      {showDots && (
        <div className="db-container db-carousel__dots" role="tablist">
          {carousel.items.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === activeDot}
              aria-label={`Ir a ${s.title}`}
              className="db-carousel__dot"
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export const CarouselPeek = () => <Shell kind="peek" />
export const CarouselCards = () => <Shell kind="cards" />
export const CarouselFull = () => <Shell kind="full" />
