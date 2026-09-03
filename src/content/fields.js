// Single source of truth for "what content each section needs". Drives both
// the content form (ContentForm) and the checklist text. Fields shown depend
// on the variant the client picked, so the form only ever asks for what the
// chosen design actually renders.

import { SECTION_ORDER } from '../config/schema'

// Must match the glyph keys in src/preview/Icon.jsx
export const ICON_KEYS = ['route', 'bell', 'signature']

const f = (path, label, kind, extra = {}) => ({ path, label, kind, ...extra })
const sub = (key, label, kind, extra = {}) => ({ key, label, kind, ...extra })

const HERO_IMAGE = {
  split: ['Imagen vertical', 'aprox. 4:5, 1200 x 1500'],
  centered: ['Imagen apaisada', 'aprox. 16:9, 1600 x 900'],
  image: ['Foto de fondo a sangre', 'mín. 2000 px, sujeto a un lado'],
}

export function buildForm(config) {
  const v = config.sections
  const blocks = []

  blocks.push({
    key: 'brand',
    label: 'Marca',
    fields: [
      f('brand.name', 'Nombre de la marca', 'text'),
      f('brand.navLinks', 'Enlaces del menú', 'list', { hint: '3 a 5, uno por línea' }),
      f('brand.login', 'Enlace de acceso', 'text'),
      f('brand.navCta', 'Botón del menú', 'text', { hint: '1 a 2 palabras' }),
    ],
  })

  const section = {
    hero: () => ({
      key: 'hero',
      label: 'Cabecera',
      variant: v.hero,
      fields: [
        f('hero.eyebrow', 'Antetítulo', 'text', { hint: 'opcional, 2 a 4 palabras' }),
        f('hero.title', 'Titular', 'text', { hint: 'máx. 2 líneas' }),
        f('hero.subtitle', 'Entradilla', 'textarea', { hint: 'máx. 20 palabras' }),
        f('hero.primary', 'Botón principal', 'text'),
        f('hero.secondary', 'Botón secundario', 'text'),
        f('hero.image', (HERO_IMAGE[v.hero] || HERO_IMAGE.split)[0], 'image', {
          hint: (HERO_IMAGE[v.hero] || HERO_IMAGE.split)[1],
        }),
      ],
    }),

    features: () => ({
      key: 'features',
      label: 'Características',
      variant: v.features,
      fields: [
        f('features.title', 'Título de sección', 'text'),
        f('features.subtitle', 'Bajada de sección', 'textarea', { hint: 'máx. 25 palabras' }),
        f('features.items', '3 características', 'repeater', {
          min: 3,
          max: 3,
          labelKey: 'title',
          fields: [
            sub('icon', 'Icono', 'select', { options: ICON_KEYS }),
            sub('title', 'Título', 'text'),
            sub('body', 'Texto', 'textarea', { hint: 'máx. 20 palabras' }),
            ...(v.features !== 'grid'
              ? [
                  sub('image', 'Imagen', 'image', {
                    hint: v.features === 'bento' ? 'solo se muestra la de la 1ª' : 'aprox. 4:3',
                  }),
                ]
              : []),
          ],
        }),
      ],
    }),

    carousel: () => ({
      key: 'carousel',
      label: 'Carrusel',
      variant: v.carousel,
      fields: [
        f('carousel.title', 'Título de sección', 'text'),
        f('carousel.items', 'Diapositivas', 'repeater', {
          min: 3,
          max: 8,
          labelKey: 'title',
          fields: [
            sub('title', 'Título', 'text'),
            sub('body', 'Texto corto', 'textarea'),
            sub('image', 'Imagen', 'image', {
              hint: v.carousel === 'full' ? 'apaisada, mín. 1600 px' : 'aprox. 16:10',
            }),
          ],
        }),
      ],
    }),

    testimonial: () => {
      const grid = v.testimonial === 'grid'
      return {
        key: 'testimonial',
        label: 'Testimonio',
        variant: v.testimonial,
        fields: [
          ...(grid ? [f('testimonial.title', 'Título de sección', 'text')] : []),
          f('testimonial.quotes', grid ? '3 citas' : '1 cita destacada', 'repeater', {
            min: grid ? 3 : 1,
            max: grid ? 3 : 1,
            labelKey: 'name',
            fields: [
              sub('text', 'Cita', 'textarea', { hint: 'máx. 3 líneas' }),
              sub('name', 'Nombre', 'text'),
              sub('role', 'Cargo y empresa', 'text'),
              sub('avatar', 'Foto', 'image'),
            ],
          }),
        ],
      }
    },

    cta: () => ({
      key: 'cta',
      label: 'Llamada a la acción',
      variant: v.cta,
      fields: [
        f('cta.title', 'Titular', 'text'),
        f('cta.body', 'Texto', 'textarea', { hint: 'máx. 25 palabras' }),
        f('cta.primary', 'Botón principal', 'text'),
        f('cta.secondary', 'Botón secundario', 'text'),
      ],
    }),
  }

  SECTION_ORDER.forEach((key) => blocks.push(section[key]()))

  blocks.push({
    key: 'footer',
    label: 'Pie',
    fields: [
      f('footer.tagline', 'Frase de cierre', 'text'),
      f('footer.groups', 'Columnas de enlaces', 'repeater', {
        min: 2,
        max: 4,
        labelKey: 'title',
        fields: [
          sub('title', 'Título de la columna', 'text'),
          sub('links', 'Enlaces', 'list', { hint: 'uno por línea' }),
        ],
      }),
      f('footer.legal', 'Línea legal', 'text'),
    ],
  })

  return blocks
}

// ---- value helpers -------------------------------------------------------

export function getPath(obj, path) {
  return String(path)
    .split('.')
    .reduce((o, k) => (o == null ? o : o[k]), obj)
}

export function setPath(root, path, value) {
  const keys = String(path).split('.')
  const clone = Array.isArray(root) ? root.slice() : { ...root }
  let cur = clone
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    const next = cur[k]
    cur[k] = Array.isArray(next) ? next.slice() : { ...next }
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
  return clone
}

export function blankItem(fields) {
  const item = {}
  for (const sf of fields) {
    if (sf.kind === 'list') item[sf.key] = []
    else if (sf.kind === 'select') item[sf.key] = sf.options[0]
    else item[sf.key] = ''
  }
  return item
}
