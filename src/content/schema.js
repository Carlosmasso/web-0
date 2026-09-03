// What content each section needs, split by the variant the client picked.
// `buildChecklist()` walks this against a config to tell you exactly what to
// collect from the client before you can set their site.

export const CONTENT_SCHEMA = {
  brand: {
    label: 'Marca (global)',
    always: true,
    fields: [
      { key: 'name', label: 'Nombre de la marca', type: 'texto' },
      { key: 'navLinks', label: 'Enlaces del menú', type: 'lista', hint: '3 a 5 enlaces' },
      { key: 'navCta', label: 'Botón del menú', type: 'texto', hint: '1 a 2 palabras' },
    ],
  },

  hero: {
    label: 'Cabecera',
    base: [
      { key: 'eyebrow', label: 'Antetítulo', type: 'texto', hint: 'opcional, 2 a 4 palabras' },
      { key: 'title', label: 'Titular', type: 'texto', hint: 'máx. 2 líneas' },
      { key: 'subtitle', label: 'Entradilla', type: 'texto largo', hint: 'máx. 20 palabras' },
      { key: 'primary', label: 'Botón principal', type: 'texto' },
      { key: 'secondary', label: 'Botón secundario', type: 'texto' },
    ],
    byVariant: {
      split: [{ key: 'image', label: 'Imagen vertical', type: 'imagen', hint: 'aprox. 4:5, 1200 x 1500' }],
      centered: [{ key: 'image', label: 'Imagen apaisada', type: 'imagen', hint: 'aprox. 16:9, 1600 x 900' }],
      image: [{ key: 'image', label: 'Foto de fondo a sangre', type: 'imagen', hint: 'mín. 2000 px, sujeto a un lado' }],
    },
  },

  features: {
    label: 'Características',
    base: [
      { key: 'title', label: 'Título de sección', type: 'texto' },
      { key: 'subtitle', label: 'Bajada de sección', type: 'texto largo', hint: 'máx. 25 palabras' },
    ],
    byVariant: {
      grid: [{ key: 'items', label: '3 características', type: 'repetidor', per: ['icono', 'título', 'texto (máx. 20 palabras)'] }],
      rows: [{ key: 'items', label: '3 características', type: 'repetidor', per: ['icono', 'título', 'texto', 'imagen aprox. 4:3'] }],
      bento: [{ key: 'items', label: '3 características', type: 'repetidor', per: ['icono', 'título', 'texto', 'imagen (solo la destacada)'] }],
    },
  },

  carousel: {
    label: 'Carrusel',
    base: [{ key: 'title', label: 'Título de sección', type: 'texto' }],
    byVariant: {
      peek: [{ key: 'items', label: '4 a 6 diapositivas', type: 'repetidor', per: ['título', 'texto corto', 'imagen aprox. 16:10'] }],
      cards: [{ key: 'items', label: '4 a 8 tarjetas', type: 'repetidor', per: ['título', 'texto corto', 'imagen aprox. 16:10'] }],
      full: [{ key: 'items', label: '3 a 5 diapositivas', type: 'repetidor', per: ['título', 'texto corto', 'imagen apaisada mín. 1600 px'] }],
    },
  },

  testimonial: {
    label: 'Testimonio',
    byVariant: {
      quote: [{ key: 'quotes', label: '1 cita destacada', type: 'repetidor', per: ['cita (máx. 3 líneas)', 'nombre', 'cargo y empresa', 'foto'] }],
      grid: [{ key: 'quotes', label: '3 citas', type: 'repetidor', per: ['cita (máx. 3 líneas)', 'nombre', 'cargo y empresa', 'foto'] }],
    },
  },

  cta: {
    label: 'Llamada a la acción',
    base: [
      { key: 'title', label: 'Titular', type: 'texto' },
      { key: 'body', label: 'Texto', type: 'texto largo', hint: 'máx. 25 palabras' },
      { key: 'primary', label: 'Botón principal', type: 'texto' },
      { key: 'secondary', label: 'Botón secundario', type: 'texto' },
    ],
  },

  footer: {
    label: 'Pie',
    always: true,
    fields: [
      { key: 'tagline', label: 'Frase de cierre', type: 'texto' },
      { key: 'groups', label: 'Columnas de enlaces', type: 'lista', hint: '2 a 3 grupos con su título' },
      { key: 'legal', label: 'Línea legal', type: 'texto' },
    ],
  },
}
