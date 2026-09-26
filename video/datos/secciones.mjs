// ============================================================
// SECCIONES PROPIAS DE ALGUNOS NEGOCIOS
//
// Por debajo de la portada, cada negocio hereda el contenido de demostración
// del sector de su PRESET (src/content/sectores.js). Casi siempre casa, pero
// en cuatro no: la casa rural usa el preset de hostelería y salía el pan de un
// obrador; la fisio, el de salud y salían dentistas; la peluquería, el de
// infancia y salía una escuela; el taller, el corporativo y salía un despacho.
//
// Aquí va lo suyo, sección por sección, con la misma forma que sectores.js.
// Se pone encima del contenido del sector y debajo de lo que el negocio
// declara en negocios.mjs (marca y portada).
//
// Las fotos son de Pexels, enlazadas y recortadas por el CDN, y todas se han
// comprobado a ojo: temáticas y sin repetir las de la portada.
// ============================================================

const pexels = (id, w, h) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`

// Retratos de las opiniones: genéricos a propósito (ver sectores.js).
const foto = (semilla, w, h) => `https://picsum.photos/seed/${semilla}/${w}/${h}`

export const SECCIONES = {
  // ----------------------------------------------------------
  rural: {
    logos: {
      headline: 'Nos recomiendan',
      items: [{ name: 'Escapada Rural' }, { name: 'Turismo de Salamanca' }, { name: 'Sierra de Francia' }, { name: 'Casas con Encanto' }],
    },
    features: {
      title: 'Una casa de piedra, sin prisas',
      subtitle: 'Seis habitaciones, un salón con chimenea y el bosque empezando donde acaba el jardín.',
      items: [
        {
          icon: 'bed',
          title: 'Habitaciones con vistas',
          body: 'Todas dan al valle. Camas grandes, mantas de lana y ni una tele: aquí se viene a desconectar.',
          image: pexels(16968481, 900, 700),
        },
        {
          icon: 'fire',
          title: 'Chimenea encendida',
          body: 'De octubre a mayo el salón está siempre caliente. La leña es del monte y la cortamos nosotros.',
          image: pexels(27409002, 900, 700),
        },
        {
          icon: 'coffee',
          title: 'Desayuno de pueblo',
          body: 'Pan del horno de la plaza, embutido de la zona y mermelada casera. Hasta las once, sin reloj.',
          image: pexels(13453423, 900, 700),
        },
      ],
    },
    carousel: {
      title: 'Un día en El Robledal',
      items: [
        {
          title: 'Por la mañana',
          body: 'Se abre la ventana y entra el olor del jardín. El café ya está hecho.',
          image: pexels(35178991, 1000, 720),
        },
        {
          title: 'A mediodía',
          body: 'La cocina es de todos: hay cazuelas, horno y aceite del pueblo.',
          image: pexels(31479803, 1000, 720),
        },
        {
          title: 'Al atardecer',
          body: 'El bosque se queda en silencio y solo se oye la chimenea.',
          image: pexels(34503448, 1000, 720),
        },
      ],
    },
    pricing: {
      title: 'Tarifas',
      subtitle: 'Precio por noche y habitación, con el desayuno incluido. Sin suplementos sorpresa.',
      plans: [
        {
          name: 'Entre semana',
          tier: 'normal',
          tagline: 'De domingo a jueves',
          price: '85€',
          period: '/noche',
          features: ['Desayuno incluido', 'Salón con chimenea', 'Aparcamiento'],
          cta: 'Ver disponibilidad',
        },
        {
          name: 'Fin de semana',
          tier: 'destacado',
          tagline: 'Viernes y sábado',
          price: '110€',
          period: '/noche',
          features: ['Desayuno incluido', 'Salida hasta las 14 h', 'Ruta guiada el sábado'],
          cta: 'Ver disponibilidad',
        },
        {
          name: 'Casa entera',
          tier: 'normal',
          tagline: 'Para grupos de hasta 14',
          price: 'A consultar',
          period: '',
          features: ['Las seis habitaciones', 'Cocina completa', 'Jardín privado'],
          cta: 'Preguntar',
        },
      ],
    },
    testimonial: {
      title: 'Quien ya ha venido',
      quotes: [
        {
          text: 'Dormimos como no dormíamos desde hacía años. El desayuno, de los que no se olvidan.',
          name: 'Lucía Beltrán',
          role: 'Vino en pareja',
          avatar: foto('huesped-lucia-beltran', 120, 120),
        },
        {
          text: 'Alquilamos la casa entera para el cumpleaños de mi madre. Todo el mundo quiere repetir.',
          name: 'Andrés Corral',
          role: 'Vino con la familia',
          avatar: foto('huesped-andres-corral', 120, 120),
        },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Se admiten mascotas?', a: 'Sí, en dos de las habitaciones. Avísanos al reservar para darte una de ellas.' },
        { q: '¿Hay cobertura?', a: 'Poca, y wifi solo en el salón. Hay quien lo agradece.' },
        { q: '¿Qué se puede hacer cerca?', a: 'Rutas por el robledal desde la puerta, y los pueblos de la sierra a quince minutos en coche.' },
        { q: '¿A qué hora es la entrada?', a: 'Desde las cuatro de la tarde. Si llegas antes, deja las maletas y sal a caminar.' },
      ],
    },
    cta: {
      title: 'Reserva tu escapada',
      body: 'Dinos las fechas y cuántos sois, y te confirmamos la disponibilidad hoy mismo.',
      placeholder: 'tu@correo.es',
      hint: 'Te contestamos el mismo día.',
      primary: 'Ver disponibilidad',
      secondary: 'O llámanos y lo hablamos.',
      success: 'Recibido. Te contestamos hoy mismo.',
    },
    footer: {
      tagline: 'Casa rural de piedra en la Sierra de Francia.',
      groups: [
        { title: 'La casa', links: ['Habitaciones', 'El salón', 'El jardín', 'Tarifas'] },
        { title: 'Visítanos', links: ['Cómo llegar', 'El entorno', 'Reservar', 'Contacto'] },
      ],
      legal: 'Aviso legal · Privacidad · Cookies',
    },
  },

  // ----------------------------------------------------------
  fisio: {
    logos: {
      headline: 'Colaboramos con',
      items: [{ name: 'Colegio de Fisioterapeutas' }, { name: 'Club Atletismo Norte' }, { name: 'Mutua Deportiva' }, { name: 'Gimnasio Altura' }],
    },
    features: {
      title: 'Primero entendemos qué te pasa',
      subtitle: 'Una valoración completa antes de tocar nada, y un plan que puedes seguir también en casa.',
      items: [
        {
          icon: 'hand',
          title: 'Terapia manual',
          body: 'Sesiones de una hora, siempre con el mismo fisio. Sin máquinas que trabajen por nosotros.',
          image: pexels(20860597, 900, 700),
        },
        {
          icon: 'tape',
          title: 'Lesiones deportivas',
          body: 'Vendaje, readaptación y vuelta al entreno con fechas realistas, no con prisas.',
          image: pexels(4506160, 900, 700),
        },
        {
          icon: 'spine',
          title: 'Espalda y cuello',
          body: 'Para el dolor de estar ocho horas sentado: tratamiento y los ejercicios que lo evitan.',
          image: pexels(20860576, 900, 700),
        },
      ],
    },
    carousel: {
      title: 'Cómo trabajamos',
      items: [
        {
          title: 'La valoración',
          body: 'Te escuchamos, te exploramos y te explicamos qué tienes con palabras normales.',
          image: pexels(29807423, 1000, 720),
        },
        {
          title: 'El tratamiento',
          body: 'Manos, ejercicio y seguimiento. Cada sesión empieza por cómo te fue la anterior.',
          image: pexels(20860622, 1000, 720),
        },
        {
          title: 'El alta',
          body: 'Te vas con una rutina para casa, para que el dolor no vuelva en dos meses.',
          image: pexels(5793922, 1000, 720),
        },
      ],
    },
    pricing: {
      title: 'Tarifas',
      subtitle: 'Sesiones de una hora completa. Sin permanencias ni bonos obligatorios.',
      plans: [
        {
          name: 'Primera visita',
          tier: 'normal',
          tagline: 'Valoración y primera sesión',
          price: '45€',
          period: '',
          features: ['Una hora completa', 'Informe por escrito', 'Plan de tratamiento'],
          cta: 'Pedir cita',
        },
        {
          name: 'Sesión',
          tier: 'destacado',
          tagline: 'Con el mismo fisio siempre',
          price: '40€',
          period: '/sesión',
          features: ['Terapia manual', 'Ejercicio guiado', 'Seguimiento por WhatsApp'],
          cta: 'Pedir cita',
        },
        {
          name: 'Bono de cinco',
          tier: 'normal',
          tagline: 'Para tratamientos largos',
          price: '180€',
          period: '',
          features: ['Cinco sesiones', 'Sin caducidad', 'Compartible en familia'],
          cta: 'Pedir cita',
        },
      ],
    },
    testimonial: {
      title: 'Lo que dicen los pacientes',
      quotes: [
        {
          text: 'Llegué sin poder girar el cuello y en tres sesiones estaba conduciendo. Y me enseñaron a que no vuelva.',
          name: 'Rocío Almagro',
          role: 'Paciente',
          avatar: foto('paciente-rocio-almagro', 120, 120),
        },
        {
          text: 'Me prepararon la rodilla para el maratón con un plan que entendía. Llegué a meta.',
          name: 'Iván Sotillo',
          role: 'Corredor popular',
          avatar: foto('paciente-ivan-sotillo', 120, 120),
        },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Necesito volante del médico?', a: 'No. Si traes pruebas o informes, mejor, pero no hacen falta para empezar.' },
        { q: '¿Cuántas sesiones voy a necesitar?', a: 'Te lo decimos en la primera visita, después de valorarte. Nada de bonos por si acaso.' },
        { q: '¿Trabajáis con mutuas?', a: 'Con algunas. Pregúntanos por la tuya al pedir cita.' },
        { q: '¿Qué ropa traigo?', a: 'Algo cómodo con lo que puedas moverte. Tenemos pantalón corto por si lo olvidas.' },
      ],
    },
    cta: {
      title: 'Pide tu primera visita',
      body: 'Cuéntanos qué te pasa y te buscamos hueco esta misma semana.',
      placeholder: 'tu@correo.es',
      hint: 'Te contestamos en el día.',
      primary: 'Pedir cita',
      secondary: 'O escríbenos por WhatsApp.',
      success: 'Recibido. Te llamamos hoy para darte hora.',
    },
    footer: {
      tagline: 'Fisioterapia de una hora, con el mismo fisio de principio a fin.',
      groups: [
        { title: 'La consulta', links: ['Tratamientos', 'El equipo', 'Tarifas', 'Cómo trabajamos'] },
        { title: 'Visítanos', links: ['Dónde estamos', 'Horarios', 'Pedir cita', 'Contacto'] },
      ],
      legal: 'Aviso legal · Privacidad · Cookies',
    },
  },

  // ----------------------------------------------------------
  peluqueria: {
    logos: {
      headline: 'Trabajamos con',
      items: [{ name: 'Color Vivo' }, { name: 'Aceites del Sur' }, { name: 'Tijera Fina' }, { name: 'Casa Botánica' }],
    },
    features: {
      title: 'Primero te escuchamos',
      subtitle: 'Diagnóstico antes de tocar las tijeras, y el precio cerrado antes de empezar.',
      items: [
        {
          icon: 'scissors',
          title: 'Corte',
          body: 'Pensado para tu pelo y para cómo lo peinas por la mañana, no solo para la foto de la salida.',
          image: pexels(3993462, 900, 700),
        },
        {
          icon: 'palette',
          title: 'Color',
          body: 'Mechas, balayage y cobertura de canas con productos que cuidan. Te decimos antes cómo va a quedar.',
          image: pexels(3993320, 900, 700),
        },
        {
          icon: 'drop',
          title: 'Tratamientos',
          body: 'Hidratación, reparación y un lavado con masaje que hace que te quieras quedar a vivir.',
          image: pexels(8834043, 900, 700),
        },
      ],
    },
    carousel: {
      title: 'El estudio',
      items: [
        {
          title: 'Los lavacabezas',
          body: 'Sillones reclinables y agua a la temperatura que tú digas.',
          image: pexels(7195805, 1000, 720),
        },
        {
          title: 'El peinado',
          body: 'Secado y acabado con calma: te enseñamos a repetirlo en casa.',
          image: pexels(10028673, 1000, 720),
        },
        {
          title: 'Tu puesto',
          body: 'Luz natural, espejo grande y un café mientras actúa el color.',
          image: pexels(3993308, 1000, 720),
        },
      ],
    },
    pricing: {
      title: 'Precios',
      subtitle: 'Precio cerrado antes de empezar. Lo que te decimos es lo que pagas en caja.',
      plans: [
        {
          name: 'Corte y peinado',
          tier: 'normal',
          tagline: 'Con lavado y diagnóstico',
          price: '28€',
          period: '',
          features: ['Diagnóstico', 'Lavado con masaje', 'Secado y peinado'],
          cta: 'Reservar hora',
        },
        {
          name: 'Color',
          tier: 'destacado',
          tagline: 'Raíz o completo',
          price: 'desde 45€',
          period: '',
          features: ['Prueba de color', 'Productos sin amoniaco', 'Tratamiento posterior'],
          cta: 'Reservar hora',
        },
        {
          name: 'Mechas y balayage',
          tier: 'normal',
          tagline: 'Según largo y técnica',
          price: 'desde 70€',
          period: '',
          features: ['Presupuesto cerrado', 'Matiz incluido', 'Corte de puntas'],
          cta: 'Reservar hora',
        },
      ],
    },
    testimonial: {
      title: 'Lo que dicen las clientas',
      quotes: [
        {
          text: 'Por fin alguien que me pregunta cómo me peino antes de cortar. Salgo y en casa me queda igual.',
          name: 'Nuria Castaño',
          role: 'Clienta desde 2022',
          avatar: foto('clienta-nuria-castano', 120, 120),
        },
        {
          text: 'Me dijeron el precio del balayage antes de empezar y fue exactamente ese.',
          name: 'Elena Maroto',
          role: 'Clienta',
          avatar: foto('clienta-elena-maroto', 120, 120),
        },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Hace falta cita?', a: 'Sí, así no esperas. Se reserva por WhatsApp o desde la web en un minuto.' },
        { q: '¿Cuánto dura un color?', a: 'Entre hora y media y dos horas, según la técnica. Te lo decimos al reservar.' },
        { q: '¿Y si no me gusta el resultado?', a: 'Vuelves en la misma semana y lo corregimos sin coste.' },
        { q: '¿Cortáis a niños?', a: 'Sí, a partir de tres años, con paciencia y sin prisas.' },
      ],
    },
    cta: {
      title: 'Reserva tu hora',
      body: 'Dinos qué quieres hacerte y te damos hueco y precio cerrado.',
      placeholder: 'tu@correo.es',
      hint: 'Te contestamos en el día.',
      primary: 'Reservar hora',
      secondary: 'O escríbenos por WhatsApp.',
      success: 'Recibido. Te escribimos hoy con tu hora.',
    },
    footer: {
      tagline: 'Color y corte en el centro de Málaga, con precio cerrado.',
      groups: [
        { title: 'El estudio', links: ['Servicios', 'El equipo', 'Precios', 'Productos'] },
        { title: 'Visítanos', links: ['Dónde estamos', 'Horarios', 'Reservar', 'Contacto'] },
      ],
      legal: 'Aviso legal · Privacidad · Cookies',
    },
  },

  // ----------------------------------------------------------
  taller: {
    logos: {
      headline: 'Taller autorizado para',
      items: [{ name: 'Revisión ITV' }, { name: 'Neumáticos Norte' }, { name: 'Recambios Leal' }, { name: 'Seguros Ruta' }],
    },
    features: {
      title: 'Te decimos qué tiene, antes de arreglarlo',
      subtitle: 'Diagnóstico con fotos y presupuesto cerrado. Si no lo apruebas, no se toca.',
      items: [
        {
          icon: 'gauge',
          title: 'Diagnosis',
          body: 'Lectura de la centralita y revisión a mano. Te mandamos fotos de lo que encontramos.',
          image: pexels(4116207, 900, 700),
        },
        {
          icon: 'wrench',
          title: 'Mantenimiento',
          body: 'Aceite, filtros, frenos y distribución con el plan del fabricante, sin perder la garantía.',
          image: pexels(8478259, 900, 700),
        },
        {
          icon: 'tire',
          title: 'Neumáticos',
          body: 'Cambio, equilibrado y alineado en el día. Te decimos cuándo toca de verdad, no antes.',
          image: pexels(7807035, 900, 700),
        },
      ],
    },
    carousel: {
      title: 'Así trabajamos',
      items: [
        {
          title: 'Lo subimos al elevador',
          body: 'Revisión completa por debajo antes de darte un precio.',
          image: pexels(8986132, 1000, 720),
        },
        {
          title: 'Lo arreglamos',
          body: 'Solo lo que has aprobado. Si aparece algo más, te llamamos primero.',
          image: pexels(3807517, 1000, 720),
        },
        {
          title: 'Te lo explicamos',
          body: 'Al recogerlo, qué se ha cambiado y por qué, con las piezas viejas si las quieres.',
          image: pexels(6870324, 1000, 720),
        },
      ],
    },
    pricing: {
      title: 'Precios',
      subtitle: 'Mano de obra y piezas, cerrado antes de empezar. Sin sorpresas al recoger el coche.',
      plans: [
        {
          name: 'Revisión básica',
          tier: 'normal',
          tagline: 'Aceite y filtros',
          price: 'desde 89€',
          period: '',
          features: ['Aceite y filtro', 'Revisión de 30 puntos', 'Informe con fotos'],
          cta: 'Pedir cita',
        },
        {
          name: 'Pre-ITV',
          tier: 'destacado',
          tagline: 'Para pasarla a la primera',
          price: '35€',
          period: '',
          features: ['Luces y frenos', 'Emisiones', 'Te la llevamos nosotros'],
          cta: 'Pedir cita',
        },
        {
          name: 'Reparaciones',
          tier: 'normal',
          tagline: 'Con diagnóstico previo',
          price: 'Cerrado',
          period: '',
          features: ['Presupuesto por escrito', 'Piezas con garantía', 'Coche de sustitución'],
          cta: 'Pedir presupuesto',
        },
      ],
    },
    testimonial: {
      title: 'Lo que dicen los clientes',
      quotes: [
        {
          text: 'Me mandaron fotos de las pastillas gastadas antes de cambiarlas. Primera vez que entiendo lo que pago.',
          name: 'Marta Illana',
          role: 'Clienta',
          avatar: foto('clienta-marta-illana', 120, 120),
        },
        {
          text: 'Pasé la ITV a la primera después de diez años sin conseguirlo. Ya no voy a otro taller.',
          name: 'Julián Prieto',
          role: 'Cliente desde 2019',
          avatar: foto('cliente-julian-prieto', 120, 120),
        },
      ],
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Perdería la garantía del fabricante?', a: 'No. Seguimos el plan de mantenimiento oficial y lo sellamos en el libro.' },
        { q: '¿Cuánto tarda una revisión?', a: 'Una mañana. Si lo dejas a primera hora, a mediodía lo tienes.' },
        { q: '¿Tenéis coche de sustitución?', a: 'Sí, para reparaciones de más de un día. Pídelo al reservar.' },
        { q: '¿Puedo llevar mis propias piezas?', a: 'Sí, aunque entonces la garantía de la pieza es la de quien te la vendió.' },
      ],
    },
    cta: {
      title: 'Pide cita en el taller',
      body: 'Dinos qué le pasa al coche y te damos día y un primer precio orientativo.',
      placeholder: 'tu@correo.es',
      hint: 'Te contestamos en el día.',
      primary: 'Pedir cita',
      secondary: 'O llámanos y lo hablamos.',
      success: 'Recibido. Te llamamos hoy para darte día.',
    },
    footer: {
      tagline: 'Taller mecánico de barrio: diagnóstico con fotos y precio cerrado.',
      groups: [
        { title: 'El taller', links: ['Servicios', 'Precios', 'Pre-ITV', 'Garantía'] },
        { title: 'Visítanos', links: ['Dónde estamos', 'Horarios', 'Pedir cita', 'Contacto'] },
      ],
      legal: 'Aviso legal · Privacidad · Cookies',
    },
  },
}
