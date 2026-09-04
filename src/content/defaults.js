// Placeholder content. In a real project you replace this object (or the
// per-section slices of it) with what the client sent. Its shape is the
// content contract every preview component reads from.

export const DEFAULT_CONTENT = {
  brand: {
    name: 'Cartograma',
    navLinks: ['Producto', 'Precios', 'Clientes', 'Recursos'],
    login: 'Entrar',
    navCta: 'Probar gratis',
  },

  hero: {
    eyebrow: 'Reparto de última milla',
    title: 'Rutas que se planifican solas',
    subtitle:
      'Cartograma ordena las entregas del día en segundos y avisa a cada cliente con una ventana de 30 minutos, sin que muevas un dedo.',
    primary: 'Probar gratis',
    secondary: 'Ver una demo',
    image: 'https://picsum.photos/seed/cartograma-reparto-furgoneta/1200/1400',
  },

  logos: {
    headline: 'Ya planifican con Cartograma más de 200 flotas',
    items: [
      { name: 'Frescor Levante', logo: '' },
      { name: 'Muebles Corcel', logo: '' },
      { name: 'Panificadora Suárez', logo: '' },
      { name: 'Grupo Ferro', logo: '' },
      { name: 'Óptica Bellver', logo: '' },
    ],
  },

  features: {
    title: 'Todo el reparto del día en un sitio',
    subtitle:
      'Planificas por la noche, sale la flota por la mañana y el cliente sabe cuándo llamar al timbre.',
    items: [
      {
        icon: 'route',
        title: 'Orden óptimo con tráfico real',
        body: 'Calcula la secuencia de paradas con el tráfico del momento, no con una media histórica.',
        image: 'https://picsum.photos/seed/cartograma-mapa-ruta/900/700',
      },
      {
        icon: 'bell',
        title: 'Avisos automáticos al cliente',
        body: 'Cada destinatario recibe un SMS con la franja de entrega y un enlace de seguimiento en vivo.',
        image: 'https://picsum.photos/seed/cartograma-sms-aviso/900/700',
      },
      {
        icon: 'signature',
        title: 'Prueba de entrega en el móvil',
        body: 'El repartidor confirma con foto y firma. Queda archivado y disponible para descarga.',
        image: 'https://picsum.photos/seed/cartograma-firma-entrega/900/700',
      },
    ],
  },

  carousel: {
    title: 'Una herramienta por cada persona de la cadena',
    items: [
      {
        title: 'Panel del día',
        body: 'Todas las rutas de la jornada en una vista, con estado por parada.',
        image: 'https://picsum.photos/seed/cartograma-panel-dia/1000/720',
      },
      {
        title: 'Vista del repartidor',
        body: 'Navegación paso a paso y botón de incidencia en un toque.',
        image: 'https://picsum.photos/seed/cartograma-app-repartidor/1000/720',
      },
      {
        title: 'Seguimiento del cliente',
        body: 'Un mapa público con la furgoneta acercándose y el tiempo estimado.',
        image: 'https://picsum.photos/seed/cartograma-seguimiento-cliente/1000/720',
      },
      {
        title: 'Informe semanal',
        body: 'Kilómetros, paradas fallidas y puntualidad, listo para enviar.',
        image: 'https://picsum.photos/seed/cartograma-informe-semanal/1000/720',
      },
    ],
  },

  pricing: {
    title: 'Un precio por furgoneta, no por sorpresa',
    subtitle: 'Sin permanencia. Cambia de plan el día que cambie tu flota.',
    plans: [
      {
        name: 'Arranque',
        tier: 'normal',
        tagline: 'Para 1 o 2 furgonetas',
        price: '29€',
        period: '/mes',
        features: ['Planificador diario', 'Hasta 2 conductores', 'Avisos por SMS', 'Soporte por correo'],
        cta: 'Empezar',
      },
      {
        name: 'Flota',
        tier: 'destacado',
        tagline: 'Para 3 a 12 furgonetas',
        price: '79€',
        period: '/mes',
        features: [
          'Todo lo de Arranque',
          'Conductores ilimitados',
          'Seguimiento en vivo',
          'Informe semanal',
          'Soporte por teléfono',
        ],
        cta: 'Probar 14 días gratis',
      },
      {
        name: 'A medida',
        tier: 'normal',
        tagline: 'Para más de 12 furgonetas',
        price: 'Hablemos',
        period: '',
        features: [
          'Todo lo de Flota',
          'Integración con tu sistema',
          'Gestor de cuenta',
          'Acuerdo de nivel de servicio',
        ],
        cta: 'Hablar con ventas',
      },
    ],
  },

  testimonial: {
    title: 'Flotas que ya salen antes cada mañana',
    quotes: [
      {
        text: 'Antes tardaba una hora en cuadrar las rutas cada mañana. Ahora salgo con el café todavía caliente.',
        name: 'Nuria Belmonte',
        role: 'Flota de 6 furgonetas, Valencia',
        avatar: 'https://picsum.photos/seed/nuria-belmonte/120/120',
      },
      {
        text: 'Las llamadas de "¿dónde está mi pedido?" han bajado casi a cero desde que el cliente ve el mapa.',
        name: 'Iker San Millán',
        role: 'Distribución de frío, Bilbao',
        avatar: 'https://picsum.photos/seed/iker-san-millan/120/120',
      },
      {
        text: 'La prueba de entrega con foto nos ha ahorrado dos disputas de cobro este trimestre.',
        name: 'Rocío Cardenal',
        role: 'Mobiliario a medida, Sevilla',
        avatar: 'https://picsum.photos/seed/rocio-cardenal/120/120',
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Necesito instalar algo en las furgonetas?',
        a: 'No. Los conductores usan la app desde su móvil; el resto se planifica desde el navegador.',
      },
      {
        q: '¿Puedo probarlo con mis rutas reales?',
        a: 'Sí, los 14 días de prueba incluyen tus paradas de verdad, no un ejemplo genérico.',
      },
      {
        q: '¿Qué pasa si cambio el número de furgonetas?',
        a: 'Cambias de plan el mismo día, sin esperar a que acabe el mes ni hablar con nadie.',
      },
      {
        q: '¿Los clientes ven dónde está su pedido?',
        a: 'Sí, reciben un enlace de seguimiento en vivo junto con el aviso de la franja de entrega.',
      },
      {
        q: '¿Hay permanencia?',
        a: 'No. Puedes cancelar cuando quieras desde el propio panel.',
      },
    ],
  },

  cta: {
    title: 'Prepara la ruta de mañana esta noche',
    body: 'Catorce días de prueba con tus paradas reales. Sin tarjeta y sin permanencia.',
    placeholder: 'nombre@tuflota.es',
    hint: 'Te escribimos en menos de un día laborable.',
    primary: 'Crear cuenta',
    secondary: 'O escríbenos y lo vemos contigo por teléfono.',
  },

  footer: {
    tagline: 'Planificación de reparto para flotas que caben en un patio.',
    groups: [
      { title: 'Producto', links: ['Planificador', 'App de reparto', 'Seguimiento', 'Informes'] },
      { title: 'Empresa', links: ['Sobre nosotros', 'Clientes', 'Empleo', 'Contacto'] },
      { title: 'Recursos', links: ['Documentación', 'Estado del servicio', 'Guías', 'API'] },
    ],
    legal: 'Aviso legal · Privacidad · Cookies',
  },
}
