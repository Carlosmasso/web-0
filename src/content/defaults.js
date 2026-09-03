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

  cta: {
    title: 'Prepara la ruta de mañana esta noche',
    body: 'Catorce días de prueba con tus paradas reales. Sin tarjeta y sin permanencia.',
    primary: 'Crear cuenta',
    secondary: 'Hablar con el equipo',
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
