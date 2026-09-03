import { useMemo, useState } from 'react'
import { buildForm, getPath, setPath, blankItem } from '../content/fields'
import { checklistToText } from '../content/checklist'

const isEmpty = (v) => v == null || v === '' || (Array.isArray(v) && v.length === 0)

export function ContentForm({ config, content, onChange, onReset }) {
  const blocks = useMemo(() => buildForm(config), [config])
  const [copied, setCopied] = useState(false)
  const set = (path, value) => onChange(setPath(content, path, value))

  const copyList = async () => {
    await navigator.clipboard.writeText(checklistToText(config))
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="cform">
      <div className="cform__intro">
        <p>Contenido del cliente. Se refleja en el preview al instante.</p>
        <div className="cform__intro-actions">
          <button type="button" onClick={copyList}>
            {copied ? 'Copiado' : 'Copiar lista para el cliente'}
          </button>
          <button type="button" onClick={onReset}>
            Restablecer
          </button>
        </div>
      </div>

      {blocks.map((block) => (
        <section className="grp" key={block.key}>
          <h3 className="grp__title">
            {block.label}
            {block.variant && <span className="cform__variant">{block.variant}</span>}
          </h3>
          {block.fields.map((field) =>
            field.kind === 'repeater' ? (
              <Repeater key={field.path} field={field} content={content} set={set} />
            ) : (
              <Field
                key={field.path}
                field={field}
                value={getPath(content, field.path)}
                onChange={(v) => set(field.path, v)}
              />
            ),
          )}
        </section>
      ))}
    </div>
  )
}

function Field({ field, value, onChange }) {
  const empty = isEmpty(value)
  return (
    <label className={`field ${empty ? 'field--empty' : ''}`}>
      <span className="field__label">
        <span>
          {field.label}
          {empty && <span className="field__pending">pendiente</span>}
        </span>
        {field.hint && <em>{field.hint}</em>}
      </span>
      <Control field={field} value={value} onChange={onChange} />
    </label>
  )
}

function Control({ field, value, onChange }) {
  if (field.kind === 'textarea') {
    return <textarea rows={2} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
  }
  if (field.kind === 'select') {
    return (
      <select value={value ?? field.options[0]} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    )
  }
  if (field.kind === 'list') {
    return (
      <textarea
        rows={3}
        value={(value ?? []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
      />
    )
  }
  if (field.kind === 'image') {
    return (
      <span className="field__image">
        <input
          type="url"
          placeholder="https://..."
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? <img src={value} alt="" /> : <span className="field__image-empty">sin imagen</span>}
      </span>
    )
  }
  return <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
}

function Repeater({ field, content, set }) {
  const arr = getPath(content, field.path) ?? []
  const canRemove = arr.length > field.min
  const canAdd = arr.length < field.max

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    const next = arr.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    set(field.path, next)
  }

  return (
    <div className="rep">
      <span className="field__label">
        <span>{field.label}</span>
        {field.hint && <em>{field.hint}</em>}
      </span>

      {arr.map((item, i) => (
        <div className="rep__item" key={i}>
          <div className="rep__item-bar">
            <strong>{item[field.labelKey] || `Elemento ${i + 1}`}</strong>
            <span className="rep__item-actions">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === arr.length - 1}
                aria-label="Bajar"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => set(field.path, arr.filter((_, j) => j !== i))}
                disabled={!canRemove}
                aria-label="Quitar"
              >
                ✕
              </button>
            </span>
          </div>
          {field.fields.map((sf) => (
            <Field
              key={sf.key}
              field={sf}
              value={item[sf.key]}
              onChange={(v) => set(`${field.path}.${i}.${sf.key}`, v)}
            />
          ))}
        </div>
      ))}

      {canAdd && (
        <button
          type="button"
          className="rep__add"
          onClick={() => set(field.path, [...arr, blankItem(field.fields)])}
        >
          Añadir
        </button>
      )}
    </div>
  )
}
