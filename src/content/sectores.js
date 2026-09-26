// ============================================================
// CONTENIDO DE DEMOSTRACIÓN POR SECTOR
//
// Hasta ahora, quien entraba veía siempre lo mismo: "Cartograma · Reparto de
// última milla", un SaaS de reparto. Una peluquera no se reconoce ahí, y el
// producto le pedía imaginar en vez de enseñarle. Al elegir un punto de
// partida por sector, el contenido cambia con él y la pantalla pasa de
// "imagínate tu web" a "mira tu web".
//
// Las claves son los `id` de los presets del grupo "Por sector"
// (`registry/presets.js`). El que no tenga entrada aquí se queda con
// `DEFAULT_CONTENT`, que sigue siendo el ejemplo neutro de producto.
//
// Los nombres de negocio son los mismos que salen en los reels
// (`video/datos/negocios.mjs`) a propósito: quien llega desde un vídeo
// y encuentra la misma clínica reconoce el sitio.
//
// SOBRE LAS FOTOS. Todas son de Pexels, enlazadas y recortadas por el propio
// CDN, y todas tienen que ver con el sector: `picsum` devuelve una foto
// ALEATORIA por semilla, y un barco en alta mar bajo el epígrafe "Radiología"
// es peor que no poner nada. Solo los retratos de los testimonios siguen en
// picsum, porque ahí un rostro genérico sí es un marcador honesto y no se
// atribuye una cara real a una opinión inventada.
//
// Aun así son imágenes de archivo: el cliente pone las suyas, y una foto real
// de su local convierte más que cualquiera de estas.
// ============================================================

const pexels = (id, w, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`

const foto = (semilla, w, h) => `https://picsum.photos/seed/${semilla}/${w}/${h}`

export const CONTENIDO_POR_SECTOR = {
  // ----------------------------------------------------------
  'medical-wellness': {
    brand: {
      name: 'Clínica Ordóñez',
      navLinks: ['Tratamientos', 'El equipo', 'Primera visita', 'Pedir cita'],
      login: '',
      navCta: 'Pedir cita',
      whatsapp: '+34 600 000 000',
    },
    hero: {
      eyebrow: 'Odontología familiar · Valladolid',
      title: 'Ir al dentista sin que se te haga un nudo',
      subtitle:
        'Te explicamos qué tienes, qué cuesta y qué pasa si esperas. Sin prisa y sin tratamientos que no necesitas.',
      primary: 'Pedir cita',
      secondary: 'Ver tratamientos',
      image: pexels(3946835, 1200, 1500),
    },
    logos: {
      headline: 'Más de 4.000 familias de la ciudad pasan por aquí',
      items: [
        { name: 'Colegio de Dentistas' },
        { name: 'Adeslas' },
        { name: 'Sanitas' },
        { name: 'DKV' },
      ],
    },
    features: {
      title: 'Lo que hacemos, explicado sin tecnicismos',
      subtitle: 'Cuatro consultas, un equipo fijo y la misma persona atendiéndote de principio a fin.',
      items: [
        {
          icon: 'tooth',
          title: 'Revisión y limpieza',
          body: 'Media hora, con radiografía si hace falta y un presupuesto por escrito antes de tocar nada.',
          image: pexels(6812569, 900, 700),
        },
        {
          icon: 'sparkle',
          title: 'Ortodoncia invisible',
          body: 'Férulas transparentes que te quitas para comer. Revisamos el avance cada seis semanas.',
          image: pexels(3952008, 900, 700),
        },
        {
          icon: 'shield',
          title: 'Urgencias el mismo día',
          body: 'Si llamas antes de las once, te vemos hoy. Un flemón no espera a la semana que viene.',
          image: pexels(6627353, 900, 700),
        },
      ],
    },
    carousel: {
      title: 'La clínica por dentro',
      items: [
        {
          title: 'Sala de espera',
          body: 'Sin televisión a todo volumen. Café, luz natural y revistas de este año.',
          image: pexels(4270379, 1000, 720),
        },
        {
          title: 'Gabinete',
          body: 'Instrumental esterilizado a la vista y pantalla para que veas lo mismo que vemos nosotros.',
          image: pexels(19976568, 1000, 720),
        },
        {
          title: 'Radiología',
          body: 'Radiografía digital en el momento, con una décima parte de la radiación de la de antes.',
          image: pexels(5355924, 1000, 720),
        },
      ],
    },
    pricing: {
      title: 'Precios cerrados antes de empezar',
      subtitle: 'Te damos el presupuesto por escrito. Si cambia algo, se habla antes, no después.',
      plans: [
        {
          name: 'Primera visita',
          tier: 'normal',
          tagline: 'Para saber qué tienes',
          price: 'Sin coste',
          period: '',
          features: ['Revisión completa', 'Radiografía si hace falta', 'Presupuesto por escrito'],
          cta: 'Pedir cita',
        },
        {
          name: 'Limpieza',
          tier: 'destacado',
          tagline: 'Una o dos al año',
          price: '55€',
          period: '/sesión',
          features: ['Ultrasonidos y pulido', 'Revisión de encías', 'Consejos para casa', 'Media hora'],
          cta: 'Reservar',
        },
        {
          name: 'Tratamientos',
          tier: 'normal',
          tagline: 'Empastes, ortodoncia, implantes',
          price: 'A medida',
          period: '',
          features: ['Presupuesto cerrado', 'Financiación sin intereses', 'Garantía por escrito'],
          cta: 'Consultar',
        },
      ],
    },
    testimonial: {
      title: 'Lo que dicen los pacientes',
      quotes: [
        {
          text: 'Llevaba ocho años sin ir por miedo. Me explicaron todo antes de tocarme y volví sola a la segunda cita.',
          name: 'Amparo Nieves',
          role: 'Paciente desde 2021',
          avatar: foto('paciente-amparo-nieves', 120, 120),
        },
        {
          text: 'Me dijeron que una muela no hacía falta tocarla. En la clínica anterior me la querían quitar.',
          name: 'Gonzalo Iriarte',
          role: 'Paciente desde 2019',
          avatar: foto('paciente-gonzalo-iriarte', 120, 120),
        },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Trabajáis con seguros?', a: 'Sí, con Adeslas, Sanitas y DKV. Dinos cuál tienes al pedir la cita y lo comprobamos.' },
        { q: '¿Cuánto dura la primera visita?', a: 'Unos cuarenta minutos. Salimos de ahí con un plan y un precio, no con una lista de dudas.' },
        { q: '¿Se puede financiar?', a: 'Sí, hasta doce meses sin intereses. Lo gestionamos aquí mismo, sin papeleo por tu cuenta.' },
        { q: '¿Atendéis a niños?', a: 'Sí. La primera visita infantil es de reconocimiento: se sientan, miran y no se toca nada.' },
      ],
    },
    cta: {
      title: 'Pide tu primera visita',
      body: 'Revisión, radiografía si hace falta y presupuesto por escrito. Sin coste y sin compromiso.',
      placeholder: 'tu@correo.es',
      hint: 'Te llamamos el mismo día para darte hora.',
      primary: 'Pedir cita',
      secondary: 'O llámanos y lo vemos por teléfono.',
      success: 'Recibido. Te llamamos hoy mismo para darte hora.',
    },
    footer: {
      tagline: 'Odontología familiar en el centro de Valladolid desde 2008.',
      groups: [
        { title: 'Clínica', links: ['Tratamientos', 'El equipo', 'Instalaciones', 'Primera visita'] },
        { title: 'Pacientes', links: ['Pedir cita', 'Seguros', 'Financiación', 'Urgencias'] },
      ],
      legal: 'Aviso legal · Privacidad · Cookies',
    },
  },

  // ----------------------------------------------------------
  'local-food': {
    brand: {
      name: 'Obrador Mendieta',
      navLinks: ['El pan', 'Dulces', 'Encargos', 'Dónde estamos'],
      login: '',
      navCta: 'Hacer un encargo',
      whatsapp: '+34 600 000 000',
    },
    hero: {
      eyebrow: 'Masa madre desde 1998',
      title: 'Pan que huele a las siete de la mañana',
      subtitle:
        'Horneamos tres veces al día en el obrador de la esquina. Si llegas tarde, mañana madruga un poco más.',
      primary: 'Hacer un encargo',
      secondary: 'Ver la carta',
      image: pexels(8633662, 1200, 1500),
    },
    logos: {
      headline: 'Nos encontrarás también en',
      items: [
        { name: 'Mercado de Abastos' },
        { name: 'La Tienda de Ana' },
        { name: 'Bar Cantábrico' },
        { name: 'Hotel Zurbano' },
      ],
    },
    features: {
      title: 'Tres hornadas al día, ni una más',
      subtitle: 'Fermentación lenta de dieciocho horas. Por eso aguanta tres días sin ponerse como una piedra.',
      items: [
        {
          icon: 'bread',
          title: 'Hogaza de masa madre',
          body: 'Harina ecológica molida a la piedra y sal marina. Nada más. La corteza cruje y la miga es húmeda.',
          image: pexels(10481790, 900, 700),
        },
        {
          icon: 'croissant',
          title: 'Bollería de mantequilla',
          body: 'Laminada a mano cada madrugada. Se acaba sobre las once, y no hacemos más hasta el día siguiente.',
          image: pexels(3789032, 900, 700),
        },
        {
          icon: 'cake',
          title: 'Encargos y celebraciones',
          body: 'Tartas, roscones y pan para cuarenta personas. Con dos días de aviso nos da tiempo a todo.',
          image: pexels(7966402, 900, 700),
        },
      ],
    },
    carousel: {
      title: 'Un día en el obrador',
      items: [
        {
          title: 'Cuatro de la mañana',
          body: 'La masa madre lleva fermentando desde ayer. Se divide a mano, pieza por pieza.',
          image: pexels(1383908, 1000, 720),
        },
        {
          title: 'Siete y media',
          body: 'Sale la primera hornada. Es la que se lleva la gente que entra a trabajar.',
          image: pexels(15009979, 1000, 720),
        },
        {
          title: 'Media tarde',
          body: 'Última hornada del día, pensada para quien sale tarde y quiere pan recién hecho.',
          image: pexels(32626985, 1000, 720),
        },
      ],
    },
    pricing: {
      title: 'La carta',
      subtitle: 'Los precios de siempre, sin letra pequeña. Lo que ves en el mostrador es lo que pagas.',
      plans: [
        {
          name: 'El pan de cada día',
          tier: 'normal',
          tagline: 'Lo que hay todas las mañanas',
          price: '2,80€',
          period: '/hogaza',
          features: ['Masa madre', 'Integral de centeno', 'Barra rústica', 'Chapata'],
          cta: 'Ver la carta',
        },
        {
          name: 'Bollería',
          tier: 'destacado',
          tagline: 'Hasta que se acaba',
          price: '1,60€',
          period: '/pieza',
          features: ['Croissant de mantequilla', 'Napolitana', 'Caracola de pasas', 'Palmera'],
          cta: 'Ver la carta',
        },
        {
          name: 'Encargos',
          tier: 'normal',
          tagline: 'Con dos días de aviso',
          price: 'A medida',
          period: '',
          features: ['Tartas de celebración', 'Pan para eventos', 'Roscón por temporada'],
          cta: 'Hacer un encargo',
        },
      ],
    },
    testimonial: {
      title: 'La gente del barrio',
      quotes: [
        {
          text: 'Llevo viniendo desde que abrieron. El pan sigue sabiendo igual, y eso hoy en día no es poco.',
          name: 'Feliciano Otero',
          role: 'Vecino de toda la vida',
          avatar: foto('vecino-feliciano-otero', 120, 120),
        },
        {
          text: 'Les encargué el pan de la boda de mi hija. Cien personas y llegó caliente.',
          name: 'Maribel Arrieta',
          role: 'Clienta',
          avatar: foto('clienta-maribel-arrieta', 120, 120),
        },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿A qué hora sale el pan?', a: 'La primera hornada, a las siete y media. Luego a media mañana y otra a media tarde.' },
        { q: '¿Se puede encargar por teléfono?', a: 'Sí, o por WhatsApp. Para tartas y pan de eventos necesitamos dos días.' },
        { q: '¿Tenéis pan sin gluten?', a: 'No. Trabajamos con harina de trigo en todo el obrador y no podemos garantizar que no haya trazas.' },
        { q: '¿Abrís los domingos?', a: 'Domingos de ocho a dos. Los lunes cerramos.' },
      ],
    },
    cta: {
      title: 'Haz tu encargo',
      body: 'Dinos qué necesitas y para cuándo. Para tartas y pan de eventos, dos días de aviso.',
      placeholder: 'tu@correo.es',
      hint: 'Te contestamos el mismo día.',
      primary: 'Hacer un encargo',
      secondary: 'O pásate por el obrador y lo hablamos.',
      success: 'Recibido. Te contestamos hoy mismo.',
    },
    footer: {
      tagline: 'Obrador de barrio con masa madre propia desde 1998.',
      groups: [
        { title: 'El obrador', links: ['El pan', 'Bollería', 'Dulces', 'Cómo trabajamos'] },
        { title: 'Visítanos', links: ['Dónde estamos', 'Horarios', 'Encargos', 'Contacto'] },
      ],
      legal: 'Aviso legal · Privacidad · Cookies',
    },
  },

  // ----------------------------------------------------------
  'corporate-legal': {
    brand: {
      name: 'Ferrer & Nieto',
      navLinks: ['Áreas', 'El despacho', 'Casos', 'Contacto'],
      login: '',
      navCta: 'Consulta inicial',
      whatsapp: '+34 600 000 000',
    },
    hero: {
      eyebrow: 'Laboral y mercantil · Zaragoza',
      title: 'Que el papeleo no decida por ti',
      subtitle:
        'Cuatro abogados, treinta años de sala y una norma: si no hay caso, te lo decimos en la primera reunión.',
      primary: 'Consulta inicial',
      secondary: 'Áreas de trabajo',
      image: pexels(3927126, 1200, 1500),
    },
    logos: {
      headline: 'Asesoramos de forma continuada a',
      items: [
        { name: 'Grupo Sabiñánigo' },
        { name: 'Cerámicas Broto' },
        { name: 'Logística Ebro' },
        { name: 'Molina Textil' },
      ],
    },
    features: {
      title: 'En qué podemos ayudarte',
      subtitle: 'Trabajamos sobre todo con empresas de entre diez y cien empleados, y con particulares en materia laboral.',
      items: [
        {
          icon: 'briefcase',
          title: 'Derecho laboral',
          body: 'Despidos, reclamaciones de cantidad y negociación colectiva. Vamos a juicio cuando toca ir.',
          image: pexels(6077091, 900, 700),
        },
        {
          icon: 'buildings',
          title: 'Mercantil y societario',
          body: 'Constitución, pactos de socios y compraventa de empresas. Contratos que se entienden al leerlos.',
          image: pexels(8731036, 900, 700),
        },
        {
          icon: 'scales',
          title: 'Reclamaciones y concursal',
          body: 'Impagos, responsabilidad de administradores y concurso. Cuanto antes se mira, más opciones hay.',
          image: pexels(6077089, 900, 700),
        },
      ],
    },
    carousel: {
      title: 'Cómo trabajamos',
      items: [
        {
          title: 'Primera reunión',
          body: 'Una hora para entender el asunto. Salimos de ahí con una valoración honesta de las opciones.',
          image: pexels(6077123, 1000, 720),
        },
        {
          title: 'Presupuesto cerrado',
          body: 'Antes de empezar sabes cuánto cuesta y qué incluye. Sin facturas sorpresa a mitad del proceso.',
          image: pexels(8731036, 1000, 720),
        },
        {
          title: 'Un interlocutor',
          body: 'El abogado que lleva tu asunto es el que te coge el teléfono. No pasas por tres personas.',
          image: pexels(6077091, 1000, 720),
        },
      ],
    },
    pricing: {
      title: 'Honorarios claros',
      subtitle: 'Presupuesto cerrado antes de empezar. Si el asunto se complica, se habla antes de facturar.',
      plans: [
        {
          name: 'Consulta inicial',
          tier: 'normal',
          tagline: 'Una hora para ver si hay caso',
          price: '90€',
          period: '',
          features: ['Valoración del asunto', 'Opciones y plazos', 'Se descuenta si seguimos'],
          cta: 'Reservar',
        },
        {
          name: 'Asesoría continuada',
          tier: 'destacado',
          tagline: 'Para empresas',
          price: '340€',
          period: '/mes',
          features: ['Consultas ilimitadas', 'Revisión de contratos', 'Un interlocutor fijo', 'Respuesta en 24 h'],
          cta: 'Hablemos',
        },
        {
          name: 'Procedimientos',
          tier: 'normal',
          tagline: 'Juicios y reclamaciones',
          price: 'A medida',
          period: '',
          features: ['Presupuesto cerrado', 'Sin cuota de éxito oculta', 'Provisión pactada'],
          cta: 'Consultar',
        },
      ],
    },
    testimonial: {
      title: 'Clientes',
      quotes: [
        {
          text: 'Nos dijeron que no fuéramos a juicio y que negociáramos. Nos ahorraron dos años y bastante dinero.',
          name: 'Práxedes Lasheras',
          role: 'Directora de Cerámicas Broto',
          avatar: foto('cliente-praxedes-lasheras', 120, 120),
        },
        {
          text: 'Llamé un viernes por la tarde con un lío de despidos. Me contestaron el viernes por la tarde.',
          name: 'Aurelio Bergua',
          role: 'Gerente de Logística Ebro',
          avatar: foto('cliente-aurelio-bergua', 120, 120),
        },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿La primera consulta compromete a algo?', a: 'No. Sirve para saber si hay caso y qué costaría. Si decides no seguir, ahí acaba.' },
        { q: '¿Trabajáis con particulares?', a: 'En materia laboral, sí. En mercantil trabajamos sobre todo con empresas.' },
        { q: '¿Cuánto tarda un procedimiento laboral?', a: 'Entre ocho meses y dos años según el juzgado. En la primera reunión te damos el plazo real, no el optimista.' },
        { q: '¿Cobráis cuota de éxito?', a: 'Solo si se pacta por escrito antes de empezar. Nunca aparece a posteriori.' },
      ],
    },
    cta: {
      title: 'Cuéntanos tu caso',
      body: 'Una hora para valorar el asunto y darte opciones reales. Si no hay caso, te lo decimos.',
      placeholder: 'tu@correo.es',
      hint: 'Te contestamos en menos de 24 horas laborables.',
      primary: 'Consulta inicial',
      secondary: 'O llámanos y lo vemos por teléfono.',
      success: 'Recibido. Te contestamos en menos de 24 horas laborables.',
    },
    footer: {
      tagline: 'Despacho laboral y mercantil en Zaragoza desde 1994.',
      groups: [
        { title: 'Áreas', links: ['Laboral', 'Mercantil', 'Reclamaciones', 'Concursal'] },
        { title: 'Despacho', links: ['El equipo', 'Cómo trabajamos', 'Honorarios', 'Contacto'] },
      ],
      legal: 'Aviso legal · Privacidad · Cookies',
    },
  },
}

// ----------------------------------------------------------
CONTENIDO_POR_SECTOR['real-estate'] = {
  brand: {
    name: 'Estudio Lomas',
    navLinks: ['Proyectos', 'El estudio', 'Proceso', 'Hablemos'],
    login: '',
    navCta: 'Hablemos',
    whatsapp: '+34 600 000 000',
  },
  hero: {
    eyebrow: 'Vivienda unifamiliar · Asturias',
    title: 'Casas que se parecen a quien vive en ellas',
    subtitle:
      'Trabajamos ocho proyectos al año. Ni uno más, porque el décimo empieza a parecerse al primero.',
    primary: 'Ver proyectos',
    secondary: 'Cómo trabajamos',
    image: pexels(16631149, 1600, 900),
  },
  logos: {
    headline: 'Premios y publicaciones',
    items: [
      { name: 'Premio COAA' },
      { name: 'Arquitectura Viva' },
      { name: 'Bienal de Vivienda' },
      { name: 'Plataforma Arquitectura' },
    ],
  },
  features: {
    title: 'Qué hacemos',
    subtitle: 'Obra nueva y rehabilitación en Asturias y el norte de León. Dirección de obra incluida.',
    items: [
      {
        icon: 'house',
        title: 'Vivienda unifamiliar',
        body: 'De la primera visita al terreno a la entrega de llaves. Un proyecto por cliente, sin plantillas.',
        image: pexels(1974596, 900, 700),
      },
      {
        icon: 'hammer',
        title: 'Rehabilitación',
        body: 'Casas de piedra y hórreos. Se conserva lo que aguanta y se sustituye solo lo que toca.',
        image: pexels(19344325, 900, 700),
      },
      {
        icon: 'ruler',
        title: 'Dirección de obra',
        body: 'Vamos a obra cada semana. El presupuesto se controla mientras se construye, no al final.',
        image: pexels(12359215, 900, 700),
      },
    ],
  },
  carousel: {
    title: 'Proyectos recientes',
    items: [
      {
        title: 'Casa en Villaviciosa',
        body: 'Ciento sesenta metros en una parcela en pendiente. Todo a una planta, orientado al sur.',
        image: pexels(32666364, 1000, 720),
      },
      {
        title: 'Rehabilitación en Cangas',
        body: 'Una casa de labranza de 1890 convertida en vivienda, conservando el muro original.',
        image: pexels(19344325, 1000, 720),
      },
      {
        title: 'Estudio en Gijón',
        body: 'Ático de cuarenta metros para una ilustradora. Un solo espacio y mucha luz norte.',
        image: pexels(12359215, 1000, 720),
      },
    ],
  },
  pricing: {
    title: 'Cómo cobramos',
    subtitle: 'Por fases. Puedes parar al terminar cualquiera de ellas sin haber pagado la siguiente.',
    plans: [
      {
        name: 'Anteproyecto',
        tier: 'normal',
        tagline: 'Para ver si la idea cabe',
        price: '1.800€',
        period: '',
        features: ['Visita al terreno', 'Propuesta y volumetría', 'Estimación de coste de obra'],
        cta: 'Empezar por aquí',
      },
      {
        name: 'Proyecto completo',
        tier: 'destacado',
        tagline: 'Lo habitual',
        price: '7%',
        period: 'del presupuesto',
        features: ['Proyecto básico y de ejecución', 'Visado y licencia', 'Dirección de obra', 'Visitas semanales'],
        cta: 'Hablemos',
      },
      {
        name: 'Solo dirección',
        tier: 'normal',
        tagline: 'Si ya tienes proyecto',
        price: '3%',
        period: 'del presupuesto',
        features: ['Control de obra y plazos', 'Certificaciones', 'Final de obra'],
        cta: 'Consultar',
      },
    ],
  },
  testimonial: {
    title: 'Clientes',
    quotes: [
      {
        text: 'Nos dijeron que la casa que habíamos imaginado no cabía en el presupuesto. Nos propusieron otra y acertaron.',
        name: 'Covadonga Riera',
        role: 'Casa en Villaviciosa, 2024',
        avatar: foto('cliente-covadonga-riera', 120, 120),
      },
      {
        text: 'Fueron a obra todas las semanas durante catorce meses. Eso se nota en el resultado.',
        name: 'Eloy Trabanco',
        role: 'Rehabilitación en Cangas, 2023',
        avatar: foto('cliente-eloy-trabanco', 120, 120),
      },
    ],
  },
  faq: {
    title: 'Preguntas frecuentes',
    items: [
      { q: '¿Cuánto tarda una vivienda?', a: 'Entre el encargo y las llaves, de dieciocho a veinticuatro meses. El proyecto son seis; el resto es obra y licencia.' },
      { q: '¿Trabajáis fuera de Asturias?', a: 'En el norte de León, sí. Más lejos no: si no podemos ir a obra cada semana, preferimos no cogerlo.' },
      { q: '¿Podéis dar un precio antes del anteproyecto?', a: 'Un rango, sí. El número real sale cuando sabemos qué cabe en la parcela y qué pide el ayuntamiento.' },
      { q: '¿Qué pasa si el presupuesto se dispara en obra?', a: 'Para eso vamos cada semana. Las desviaciones se ven en el mes uno, no en la certificación final.' },
    ],
  },
  cta: {
    title: 'Cuéntanos qué quieres construir',
    body: 'Una primera conversación sin coste para ver si el proyecto y nosotros encajamos.',
    placeholder: 'tu@correo.es',
    hint: 'Te contestamos esta misma semana.',
    primary: 'Hablemos',
    secondary: 'O llámanos y lo vemos por teléfono.',
    success: 'Recibido. Te contestamos esta misma semana.',
  },
  footer: {
    tagline: 'Estudio de arquitectura en Asturias. Ocho proyectos al año.',
    groups: [
      { title: 'Estudio', links: ['Proyectos', 'El equipo', 'Proceso', 'Premios'] },
      { title: 'Contacto', links: ['Hablemos', 'Dónde estamos', 'Honorarios'] },
    ],
    legal: 'Aviso legal · Privacidad · Cookies',
  },
}

// ----------------------------------------------------------
CONTENIDO_POR_SECTOR['kids-care'] = {
  brand: {
    name: 'Escuela Altamira',
    navLinks: ['El proyecto', 'Las aulas', 'El día a día', 'Visítanos'],
    login: '',
    navCta: 'Pedir visita',
    whatsapp: '+34 600 000 000',
  },
  hero: {
    eyebrow: 'Escuela infantil · 0 a 3 años',
    title: 'El sitio donde tu hijo aprende a estar sin ti',
    subtitle:
      'Grupos de ocho, dos educadoras por aula y la misma persona de referencia todo el curso.',
    primary: 'Pedir visita',
    secondary: 'Ver el proyecto',
    image: pexels(8535626, 1200, 1500),
  },
  logos: {
    headline: 'Autorizada y colaboradora de',
    items: [
      { name: 'Consejería de Educación' },
      { name: 'Red de Escuelas Infantiles' },
      { name: 'Ayuntamiento' },
      { name: 'Cheque Guardería' },
    ],
  },
  features: {
    title: 'Cómo es un día aquí',
    subtitle: 'Horario amplio, comida hecha en casa y una educadora de referencia que no cambia en todo el curso.',
    items: [
      {
        icon: 'sun',
        title: 'Mañanas de juego',
        body: 'Juego libre, psicomotricidad y patio a diario. Se sale fuera salvo que llueva de verdad.',
        image: pexels(8535198, 900, 700),
      },
      {
        icon: 'bowl',
        title: 'Cocina propia',
        body: 'Menú de temporada cocinado aquí cada día. Adaptamos alergias e intolerancias sin coste.',
        image: pexels(8422132, 900, 700),
      },
      {
        icon: 'moon',
        title: 'Siesta y descanso',
        body: 'Sala de descanso separada del aula, con luz tenue y el ritmo de cada niño, no el del reloj.',
        image: pexels(8612983, 900, 700),
      },
    ],
  },
  carousel: {
    title: 'Las aulas',
    items: [
      {
        title: 'Bebés, de 0 a 1',
        body: 'Seis plazas y dos educadoras. Suelo cálido, todo a ras y cambiador dentro del aula.',
        image: pexels(8422262, 1000, 720),
      },
      {
        title: 'De 1 a 2 años',
        body: 'Empieza la autonomía: comer solos, quitarse el abrigo, guardar lo que se saca.',
        image: pexels(8535602, 1000, 720),
      },
      {
        title: 'De 2 a 3 años',
        body: 'Preparación para el colegio sin adelantarlo: rutinas, lenguaje y control de esfínteres.',
        image: pexels(8535198, 1000, 720),
      },
    ],
  },
  pricing: {
    title: 'Plazas y cuotas',
    subtitle: 'Matrícula única en septiembre. Sin permanencia y sin cobros por material a mitad de curso.',
    plans: [
      {
        name: 'Media jornada',
        tier: 'normal',
        tagline: 'De 9 a 13 h',
        price: '295€',
        period: '/mes',
        features: ['Aula de referencia', 'Almuerzo de media mañana', 'Informe trimestral'],
        cta: 'Pedir plaza',
      },
      {
        name: 'Jornada completa',
        tier: 'destacado',
        tagline: 'De 9 a 17 h, con comida',
        price: '420€',
        period: '/mes',
        features: ['Todo lo de media jornada', 'Comida y siesta', 'Merienda', 'Entrada flexible de 8 a 9:30'],
        cta: 'Pedir plaza',
      },
      {
        name: 'Ampliación',
        tier: 'normal',
        tagline: 'Para quien sale tarde',
        price: '55€',
        period: '/mes',
        features: ['Hasta las 18:30', 'Merienda incluida', 'Se contrata mes a mes'],
        cta: 'Consultar',
      },
    ],
  },
  testimonial: {
    title: 'Familias',
    quotes: [
      {
        text: 'La adaptación duró dos semanas y nos avisaban cada día de cómo iba. Nunca nos sentimos fuera.',
        name: 'Itziar Goenaga',
        role: 'Madre de Jon, aula de 1 a 2',
        avatar: foto('familia-itziar-goenaga', 120, 120),
      },
      {
        text: 'La misma educadora todo el curso. Para un niño de dos años eso lo es todo.',
        name: 'Ramiro Cuéllar',
        role: 'Padre de Vega, aula de 2 a 3',
        avatar: foto('familia-ramiro-cuellar', 120, 120),
      },
    ],
  },
  faq: {
    title: 'Preguntas frecuentes',
    items: [
      { q: '¿Cómo es la adaptación?', a: 'Dos semanas, empezando por una hora al día y subiendo según lleve el niño. No hay un calendario rígido.' },
      { q: '¿Aceptáis el cheque guardería?', a: 'Sí, y te ayudamos con el papeleo. También estamos en el programa municipal de ayudas.' },
      { q: '¿Qué pasa si mi hijo se pone malo?', a: 'Avisamos enseguida. Con fiebre no puede quedarse, por él y por el resto del aula.' },
      { q: '¿Se puede visitar antes de decidir?', a: 'Sí, y sin niños por medio: te enseñamos las aulas por la tarde, cuando está vacía y se puede hablar.' },
    ],
  },
  cta: {
    title: 'Ven a conocer la escuela',
    body: 'Te enseñamos las aulas por la tarde, con calma y sin compromiso. Quedan plazas para este curso.',
    placeholder: 'tu@correo.es',
    hint: 'Te llamamos para darte día y hora.',
    primary: 'Pedir visita',
    secondary: 'O llámanos y lo hablamos.',
    success: 'Recibido. Te llamamos para darte día y hora.',
  },
  footer: {
    tagline: 'Escuela infantil de 0 a 3 años, autorizada y con cocina propia.',
    groups: [
      { title: 'La escuela', links: ['El proyecto', 'Las aulas', 'El equipo', 'Instalaciones'] },
      { title: 'Familias', links: ['Cuotas', 'Cheque guardería', 'Visítanos', 'Contacto'] },
    ],
    legal: 'Aviso legal · Privacidad · Cookies',
  },
}

// ----------------------------------------------------------
CONTENIDO_POR_SECTOR['fine-dining'] = {
  brand: {
    name: 'Casa Mendaro',
    navLinks: ['La carta', 'El menú', 'La bodega', 'Reservar'],
    login: '',
    navCta: 'Reservar mesa',
    whatsapp: '+34 600 000 000',
  },
  hero: {
    eyebrow: 'Cocina de temporada · San Sebastián',
    title: 'Lo que hay hoy depende de lo que hubo esta mañana',
    subtitle:
      'Carta corta que cambia cada semana con lo que llega del mercado y de la lonja.',
    primary: 'Reservar mesa',
    secondary: 'Ver la carta',
    image: pexels(29962487, 1600, 900),
  },
  logos: {
    headline: 'Reconocimientos',
    items: [
      { name: 'Guía Michelin' },
      { name: 'Repsol' },
      { name: 'Gourmetour' },
      { name: 'Euskadi Gastronomika' },
    ],
  },
  features: {
    title: 'La casa',
    subtitle: 'Veintiocho cubiertos, cocina vista y una carta que se escribe el lunes por la mañana.',
    items: [
      {
        icon: 'fish',
        title: 'Producto de lonja',
        body: 'Compramos en la subasta de Getaria cada mañana. Si no hay, no está en la carta.',
        image: pexels(6327536, 900, 700),
      },
      {
        icon: 'wine',
        title: 'Bodega de la casa',
        body: 'Ciento veinte referencias, la mitad de productores pequeños. Servimos copas de todas.',
        image: pexels(12181763, 900, 700),
      },
      {
        icon: 'fire',
        title: 'Parrilla y brasa',
        body: 'Carbón de encina para pescado entero y verdura de temporada. Nada se hace antes de pedirlo.',
        image: pexels(20184687, 900, 700),
      },
    ],
  },
  carousel: {
    title: 'La sala',
    items: [
      {
        title: 'Comedor principal',
        body: 'Veinte cubiertos, mesas separadas de verdad y mantel de hilo. Se puede hablar sin gritar.',
        image: pexels(17057034, 1000, 720),
      },
      {
        title: 'La barra',
        body: 'Ocho taburetes frente a la cocina, para cenar viendo trabajar. No se reserva.',
        image: pexels(33696402, 1000, 720),
      },
      {
        title: 'Reservado',
        body: 'Una mesa para diez, con su propia entrada. Para comidas que se alargan.',
        image: pexels(20184687, 1000, 720),
      },
    ],
  },
  pricing: {
    title: 'Carta y menús',
    subtitle: 'El menú cambia cada semana. La carta se mantiene, pero los platos rotan con la temporada.',
    plans: [
      {
        name: 'Carta',
        tier: 'normal',
        tagline: 'Comer a tu ritmo',
        price: '45€',
        period: 'de media',
        features: ['Entrantes para compartir', 'Pescado de lonja', 'Carne a la brasa', 'Postres de la casa'],
        cta: 'Ver la carta',
      },
      {
        name: 'Menú de temporada',
        tier: 'destacado',
        tagline: 'Siete pases',
        price: '68€',
        period: '/persona',
        features: ['Siete pases', 'Cambia cada semana', 'Maridaje opcional 28€', 'Mesa completa'],
        cta: 'Reservar mesa',
      },
      {
        name: 'Menú del día',
        tier: 'normal',
        tagline: 'Solo mediodía, entre semana',
        price: '24€',
        period: '',
        features: ['Primero, segundo y postre', 'Pan y bebida', 'Café incluido'],
        cta: 'Ver el menú',
      },
    ],
  },
  testimonial: {
    title: 'En sala',
    quotes: [
      {
        text: 'Pedimos el menú sin saber qué iba a salir. Siete pases y no sobró ni uno.',
        name: 'Estíbaliz Zubeldia',
        role: 'Clienta habitual',
        avatar: foto('comensal-estibaliz-zubeldia', 120, 120),
      },
      {
        text: 'El sumiller nos sacó un blanco de una bodega de doce hectáreas. Volvimos a por él.',
        name: 'Anselmo Bidarte',
        role: 'Cliente',
        avatar: foto('comensal-anselmo-bidarte', 120, 120),
      },
    ],
  },
  faq: {
    title: 'Preguntas frecuentes',
    items: [
      { q: '¿Hace falta reservar?', a: 'Para el comedor, sí, y con margen los fines de semana. La barra es siempre por orden de llegada.' },
      { q: '¿El menú se sirve a toda la mesa?', a: 'Sí, el de temporada va para la mesa completa. En la carta cada uno pide lo suyo.' },
      { q: '¿Tenéis opciones vegetarianas?', a: 'Sí, y sin previo aviso. Con alergias o celiaquía, dínoslo al reservar y ajustamos el menú.' },
      { q: '¿Hay aparcamiento?', a: 'No propio. El parking de la plaza está a tres minutos andando y es gratuito a partir de las ocho.' },
    ],
  },
  cta: {
    title: 'Reserva tu mesa',
    body: 'Comedor de veinte cubiertos. Para los fines de semana, mejor con unos días de margen.',
    placeholder: 'tu@correo.es',
    hint: 'Te confirmamos la reserva el mismo día.',
    primary: 'Reservar mesa',
    secondary: 'O llámanos y lo vemos por teléfono.',
    success: 'Recibido. Te confirmamos la reserva hoy mismo.',
  },
  footer: {
    tagline: 'Cocina de temporada y parrilla en el centro de San Sebastián.',
    groups: [
      { title: 'La casa', links: ['La carta', 'Menú de temporada', 'La bodega', 'La sala'] },
      { title: 'Reservas', links: ['Reservar mesa', 'Horarios', 'Cómo llegar', 'Contacto'] },
    ],
    legal: 'Aviso legal · Privacidad · Cookies',
  },
}

/** El contenido de un preset de sector, o `null` si no tiene. */
export const contenidoDeSector = (presetId) => CONTENIDO_POR_SECTOR[presetId] ?? null

/**
 * ¿Sigue siendo contenido de demostración?
 *
 * Esta es la pregunta que decide si un preset puede pisar los textos. Se mira
 * la HUELLA —el nombre del negocio, el titular y la entradilla— y no el objeto
 * entero.
 *
 * Comparar el contenido completo parecía más seguro y era justo lo contrario:
 * poner tu propio número de WhatsApp, o una migración que rellene un campo,
 * bastaba para que el contenido de sector no volviera a aplicarse jamás. Quien
 * llevaba semanas con un proyecto guardado nunca llegaba a ver la función.
 *
 * Estos tres campos son los que alguien cambia cuando la web empieza a ser
 * suya. Si siguen siendo los del ejemplo, es contenido de demostración y se
 * puede sustituir; en cuanto toca uno, todo lo suyo queda intocable.
 */
const HUELLA = [
  ['brand', 'name'],
  ['hero', 'title'],
  ['hero', 'subtitle'],
]

const huella = (c) => HUELLA.map(([seccion, campo]) => c?.[seccion]?.[campo] ?? '').join('␟')

export const esContenidoDeDemostracion = (contenido, porDefecto) => {
  if (!contenido) return true
  const actual = huella(contenido)
  if (porDefecto && actual === huella(porDefecto)) return true
  return Object.values(CONTENIDO_POR_SECTOR).some((demo) => actual === huella(demo))
}

/**
 * Mezcla el contenido de un sector sobre el de partida, sección por sección.
 *
 * Dos niveles y no uno: si a la portada de un sector le faltara un campo que
 * sus componentes leen, lo hereda del contenido de partida en vez de quedar
 * en blanco. Los arrays se reemplazan enteros, que es lo que se quiere con
 * una lista de planes o de preguntas.
 */
export function mezclarContenido(base, encima) {
  const salida = { ...base }
  for (const [seccion, valor] of Object.entries(encima)) {
    const previo = base[seccion]
    salida[seccion] =
      previo && typeof previo === 'object' && !Array.isArray(previo) && !Array.isArray(valor)
        ? { ...previo, ...valor }
        : valor
  }
  return salida
}
