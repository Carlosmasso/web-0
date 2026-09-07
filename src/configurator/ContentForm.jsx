import { useMemo, useRef, useState } from 'react'
import { isStudio } from '../config/mode'
import { buildForm, getPath, setPath, blankItem } from '../content/fields'
import { checklistToText } from '../content/checklist'
import { fileToDataUrl } from '../content/image'

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
        {isStudio ? (
          <>
            <p>Contenido del cliente. Se refleja en el preview al instante.</p>
            <div className="cform__intro-actions">
              <button type="button" onClick={copyList}>
                {copied ? 'Copiado' : 'Copiar lista para el cliente'}
              </button>
              <button type="button" onClick={onReset}>
                Restablecer
              </button>
            </div>
          </>
        ) : (
          <p>Los textos de tu web. Es opcional — si lo prefieres, los pongo yo.</p>
        )}
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

// Tope de caracteres: el del campo, o uno por defecto según el tipo. Evita que
// un texto kilométrico rompa el maquetado del preview (y del sitio entregado).
const capFor = (field) =>
  field.max ?? (field.kind === 'textarea' ? 500 : field.kind === 'list' ? 2000 : 120)

function Field({ field, value, onChange }) {
  const empty = isEmpty(value)
  const cap = capFor(field)
  const len = typeof value === 'string' ? value.length : 0
  const near = len >= cap * 0.85
  return (
    <label className={`field ${empty ? 'field--empty' : ''}`}>
      <span className="field__label">
        <span>
          {field.label}
          {empty && <span className="field__pending">pendiente</span>}
        </span>
        {near ? (
          <em className={len >= cap ? 'field__count field__count--max' : 'field__count'}>
            {len}/{cap}
          </em>
        ) : (
          field.hint && <em>{field.hint}</em>
        )}
      </span>
      <Control field={field} value={value} onChange={onChange} cap={cap} />
    </label>
  )
}

function Control({ field, value, onChange, cap }) {
  if (field.kind === 'textarea') {
    return (
      <textarea
        rows={2}
        maxLength={cap}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
    )
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
        maxLength={cap}
        value={(value ?? []).join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
      />
    )
  }
  if (field.kind === 'image') {
    return <ImageControl value={value} onChange={onChange} />
  }
  return (
    <input
      type="text"
      maxLength={cap}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function ImageControl({ value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const isUpload = typeof value === 'string' && value.startsWith('data:')

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      onChange(await fileToDataUrl(file))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <span className="field__image">
      <span className="field__image-actions">
        <button
          type="button"
          className="field__upload"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? 'Procesando…' : isUpload ? 'Cambiar imagen' : 'Subir imagen'}
        </button>
        {value && (
          <button
            type="button"
            className="field__image-clear"
            onClick={() => {
              onChange('')
              setError(null)
            }}
          >
            Quitar
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
      </span>
      <input
        type="url"
        placeholder="o pega una URL: https://…"
        value={isUpload ? '' : (value ?? '')}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="field__image-error">{error}</span>}
      {value ? <img src={value} alt="" /> : <span className="field__image-empty">sin imagen</span>}
    </span>
  )
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
