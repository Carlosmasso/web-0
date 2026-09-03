import { buildForm } from './fields'

// The content to request from the client, derived from the same field
// definitions the form uses so the two can never drift.

export function buildChecklist(config) {
  return buildForm(config).map((block) => ({
    key: block.key,
    label: block.label,
    variant: block.variant || null,
    fields: block.fields,
  }))
}

export function checklistToText(config) {
  const lines = ['Contenido necesario para tu web', '']
  for (const block of buildChecklist(config)) {
    lines.push(block.variant ? `## ${block.label} (${block.variant})` : `## ${block.label}`)
    for (const field of block.fields) {
      lines.push(`- ${field.label}${metaOf(field)}`)
      if (field.kind === 'repeater') {
        const range = field.min === field.max ? `${field.min}` : `${field.min} a ${field.max}`
        lines.push(`  · ${range} elemento(s), cada uno con: ${field.fields.map((sf) => sf.label.toLowerCase()).join(', ')}`)
      }
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}

function metaOf(field) {
  const bits = []
  if (field.kind === 'image') bits.push('imagen')
  else if (field.kind === 'list') bits.push('lista')
  else if (field.kind === 'textarea') bits.push('texto largo')
  else if (field.kind === 'select') bits.push(`una de: ${field.options.join(', ')}`)
  else if (field.kind === 'repeater') bits.push('lista de elementos')
  if (field.hint) bits.push(field.hint)
  return bits.length ? ` — ${bits.join(', ')}` : ''
}
