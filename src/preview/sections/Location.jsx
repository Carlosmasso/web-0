import { useContent } from '../../content/context'
import { DEFAULT_CONTENT } from '../../content/defaults'
import { useStructure } from '../PreviewCanvas'
import { Button } from '../ui'
import { Icon } from '../Icon'
import { Reveal } from '../Reveal'

// ============================================================
// DÓNDE ESTAMOS
//
// Lo que más se mira de la web de un negocio con local: dirección, teléfono,
// horario y el mapa. El mapa sale de la propia dirección (Google Maps
// incrustado, sin clave de API) y carga en diferido: no pesa hasta que se
// llega a la sección. "Cómo llegar" abre Google Maps con la ruta.
//
// OJO al entregar: el mapa incrustado de Google pone sus cookies. En la web
// publicada tiene que pasar por el aviso de cookies como cualquier otra.
// ============================================================

/** La dirección en una sola línea: los saltos pasan a comas. */
const enUnaLinea = (address) => address.replace(/\s*\n\s*/g, ', ')

/** La dirección en Google Maps, para "Cómo llegar". */
export const mapsUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enUnaLinea(address))}`

/** El mapa incrustable de esa dirección. */
export const mapEmbedUrl = (address) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(enUnaLinea(address))}&z=16&hl=es&output=embed`

/** "9:00 – 14:00 y 17:00 – 20:00" -> un tramo por línea, como en la puerta. */
const tramos = (time) => String(time || '').split(/\s+y\s+/)

/** "+34 600 000 000" -> "tel:+34600000000" */
const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

export function LocationCard() {
  // Un proyecto guardado antes de que existiera la sección no trae el bloque.
  const location = useContent().location ?? DEFAULT_CONTENT.location
  const { iconSet } = useStructure()
  const address = String(location.address || '').trim()
  const phone = String(location.phone || '').trim()
  const hours = (location.hours || []).filter((h) => h.days || h.time)

  return (
    <section className="db-section db-section--tint" id="location" data-section="location">
      <div className="db-container db-location" data-map={address ? 'on' : 'off'}>
        <div className="db-location__side">
          <Reveal className="db-location__info">
            <h2>{location.title}</h2>
            {location.intro && <p className="db-lead">{location.intro}</p>}
            {(address || phone) && (
              <ul className="db-location__facts">
                {address && (
                  <li>
                    <Icon set={iconSet} name="pin" size={20} />
                    <span className="db-location__address">{address}</span>
                  </li>
                )}
                {phone && (
                  <li>
                    <Icon set={iconSet} name="phone" size={20} />
                    <a href={telHref(phone)}>{phone}</a>
                  </li>
                )}
              </ul>
            )}
            {location.note && <p className="db-location__note">{location.note}</p>}
            {address && (
              <div className="db-location__actions">
                <Button href={mapsUrl(address)} withArrow>
                  Cómo llegar
                </Button>
              </div>
            )}
          </Reveal>

          {hours.length > 0 && (
            <Reveal delay={0.08} className="db-card db-location__hours">
              <h3>
                <Icon set={iconSet} name="clock" size={20} />
                Horario
              </h3>
              <dl>
                {hours.map((h, i) => (
                  <div className="db-location__row" key={i}>
                    <dt>{h.days}</dt>
                    <dd>
                      {tramos(h.time).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        {address && (
          <Reveal delay={0.12} className="db-location__map">
            <iframe
              title={`Mapa: ${enUnaLinea(address)}`}
              src={mapEmbedUrl(address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
