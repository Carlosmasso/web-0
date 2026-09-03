import { useState } from 'react'
import { buildChecklist, checklistToText } from '../content/checklist'

// Carlos-facing: given the client's chosen config, the exact content to
// collect before setting their site.
export function ChecklistPanel({ config, open, onClose }) {
  const [copied, setCopied] = useState(false)
  const blocks = buildChecklist(config)

  const copy = async () => {
    await navigator.clipboard.writeText(checklistToText(config))
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className={`checklist ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="checklist__bar">
        <div>
          <h2>Contenido a pedir al cliente</h2>
          <p>Generado a partir de las variantes elegidas.</p>
        </div>
        <div className="checklist__bar-actions">
          <button type="button" onClick={copy}>
            {copied ? 'Copiado' : 'Copiar en texto'}
          </button>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            Cerrar
          </button>
        </div>
      </div>

      <div className="checklist__body">
        {blocks.map((block) => (
          <section key={block.key} className="checklist__block">
            <h3>
              {block.label}
              {block.variant && <span className="checklist__variant">{block.variant}</span>}
            </h3>
            <ul>
              {block.items.map((item) => (
                <li key={item.key}>
                  <span className="checklist__item-label">{item.label}</span>
                  <span className="checklist__item-meta">
                    {[item.type, item.hint].filter(Boolean).join(' · ')}
                  </span>
                  {item.per && (
                    <span className="checklist__per">
                      por elemento: {item.per.join(' · ')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
