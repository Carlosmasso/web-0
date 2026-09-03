import { CONTENT_SCHEMA } from './schema'
import { SECTION_ORDER } from '../config/schema'

// Given a design config, returns the ordered list of content the client must
// provide for the variants they chose. Drives the "Contenido a pedir" panel
// and its copy-to-clipboard text.
export function buildChecklist(config) {
  const blocks = []

  const push = (key) => {
    const node = CONTENT_SCHEMA[key]
    if (!node) return
    const variant = config.sections?.[key]
    const items = [
      ...(node.always ? node.fields : node.base || []),
      ...((node.byVariant && node.byVariant[variant]) || []),
    ]
    if (!items.length) return
    blocks.push({
      key,
      label: node.label,
      variant: variant || null,
      items,
    })
  }

  push('brand')
  SECTION_ORDER.forEach(push)
  push('footer')
  return blocks
}

export function checklistToText(config) {
  const lines = ['Contenido necesario para tu web', '']
  for (const block of buildChecklist(config)) {
    lines.push(block.variant ? `## ${block.label} (${block.variant})` : `## ${block.label}`)
    for (const item of block.items) {
      const meta = [item.type, item.hint].filter(Boolean).join(', ')
      lines.push(`- ${item.label}${meta ? ` — ${meta}` : ''}`)
      if (item.per) lines.push(`  · por elemento: ${item.per.join(' · ')}`)
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}
