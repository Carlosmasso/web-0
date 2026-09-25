// ============================================================
// CATÁLOGO DE NEGOCIOS
//
// El eje de variación que de verdad importa. Dos reels con el mismo montaje
// pero distinto negocio son dos piezas distintas para quien las ve; dos reels
// del mismo negocio con distinto montaje son el mismo vídeo otra vez. Y cada
// negocio le habla a un gremio, que es quien se etiqueta entre sí.
//
// SOBRE LAS FOTOS. Cada negocio tiene la suya en `imagenes.json`, enlazada a
// Pexels y nunca descargada: el tamaño y el recorte se le piden por parámetros
// al propio CDN, así que de una sola foto salen las dos proporciones que usa
// el producto. Para cambiar una, se pega otra URL en ese archivo.
//
// `portada` decide qué forma se le pide y cómo se encuadra el hero:
//
//   'imagen'   -> foto a sangre (apaisada, con velo y texto encima).
//   'centrada' -> manifiesto tipográfico; el hero no enseña foto, pero la
//                 vertical sigue haciendo falta para la variante "Dividida".
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const NEGOCIOS = {
  rural: {
    sector: 'Turismo rural',
    preset: 'Hostelería y artesanía',
    portada: 'imagen',
    etiquetas: ['casarural', 'turismorural', 'negociolocal'],
    contenido: {
      'brand.name': 'El Robledal',
      'brand.navLinks': 'La casa\nHabitaciones\nEl entorno\nReservar',
      'brand.navCta': 'Reservar',
      'brand.login': '',
      'hero.eyebrow': 'Casa rural · Sierra de Francia',
      'hero.title': 'Dormir donde solo se oye el bosque',
      'hero.subtitle':
        'Seis habitaciones, chimenea encendida de octubre a mayo y desayuno con pan del horno del pueblo.',
      'hero.primary': 'Ver disponibilidad',
      'hero.secondary': 'Cómo llegar',
    },
  },

  dental: {
    sector: 'Clínica dental',
    preset: 'Salud y bienestar',
    portada: 'centrada',
    etiquetas: ['clinicadental', 'dentista', 'saludbucodental'],
    contenido: {
      'brand.name': 'Clínica Ordóñez',
      'brand.navLinks': 'Tratamientos\nEl equipo\nPrimera visita\nPedir cita',
      'brand.navCta': 'Pedir cita',
      'brand.login': '',
      'hero.eyebrow': 'Odontología familiar · Valladolid',
      'hero.title': 'Ir al dentista sin que se te haga un nudo',
      'hero.subtitle':
        'Te explicamos qué tienes, qué cuesta y qué pasa si esperas. Sin prisa y sin tratamientos que no necesitas.',
      'hero.primary': 'Pedir cita',
      'hero.secondary': 'Ver tratamientos',
    },
  },

  abogados: {
    sector: 'Despacho de abogados',
    preset: 'Corporativo y legal',
    portada: 'centrada',
    etiquetas: ['abogados', 'despacho', 'asesoria'],
    contenido: {
      'brand.name': 'Ferrer & Nieto',
      'brand.navLinks': 'Áreas\nEl despacho\nCasos\nContacto',
      'brand.navCta': 'Consulta inicial',
      'brand.login': '',
      'hero.eyebrow': 'Laboral y mercantil · Zaragoza',
      'hero.title': 'Que el papeleo no decida por ti',
      'hero.subtitle':
        'Cuatro abogados, treinta años de sala y una norma: si no hay caso, te lo decimos en la primera reunión.',
      'hero.primary': 'Consulta inicial',
      'hero.secondary': 'Áreas de trabajo',
    },
  },

  obrador: {
    sector: 'Panadería y obrador',
    preset: 'Hostelería y artesanía',
    portada: 'centrada',
    etiquetas: ['panaderia', 'obrador', 'masamadre', 'comerciolocal'],
    contenido: {
      'brand.name': 'Obrador Mendieta',
      'brand.navLinks': 'El pan\nDulces\nEncargos\nDónde estamos',
      'brand.navCta': 'Hacer un encargo',
      'brand.login': '',
      'hero.eyebrow': 'Masa madre desde 1998',
      'hero.title': 'Pan que huele a las siete de la mañana',
      'hero.subtitle':
        'Horneamos tres veces al día en el obrador de la esquina. Si llegas tarde, mañana madruga un poco más.',
      'hero.primary': 'Hacer un encargo',
      'hero.secondary': 'Ver la carta',
    },
  },

  fisio: {
    sector: 'Fisioterapia',
    preset: 'Salud y bienestar',
    portada: 'centrada',
    etiquetas: ['fisioterapia', 'fisio', 'saludydeporte'],
    contenido: {
      'brand.name': 'Aravaca Fisio',
      'brand.navLinks': 'Tratamientos\nEl equipo\nTarifas\nPedir cita',
      'brand.navCta': 'Pedir cita',
      'brand.login': '',
      'hero.eyebrow': 'Fisioterapia y readaptación',
      'hero.title': 'Que volver a moverte no duela',
      'hero.subtitle':
        'Sesiones de una hora, sin prisa y con el mismo fisio de principio a fin. La primera es de valoración.',
      'hero.primary': 'Pedir cita',
      'hero.secondary': 'Ver tratamientos',
    },
  },

  arquitectura: {
    sector: 'Estudio de arquitectura',
    preset: 'Inmobiliaria y arquitectura',
    portada: 'imagen',
    etiquetas: ['arquitectura', 'estudiodearquitectura', 'reformas'],
    contenido: {
      'brand.name': 'Estudio Lomas',
      'brand.navLinks': 'Proyectos\nEl estudio\nProceso\nHablemos',
      'brand.navCta': 'Hablemos',
      'brand.login': '',
      'hero.eyebrow': 'Vivienda unifamiliar · Asturias',
      'hero.title': 'Casas que se parecen a quien vive en ellas',
      'hero.subtitle':
        'Trabajamos ocho proyectos al año. Ni uno más, porque el décimo empieza a parecerse al primero.',
      'hero.primary': 'Ver proyectos',
      'hero.secondary': 'Cómo trabajamos',
    },
  },

  peluqueria: {
    sector: 'Peluquería y estética',
    preset: 'Infancia y educación',
    portada: 'centrada',
    etiquetas: ['peluqueria', 'estetica', 'comerciolocal'],
    contenido: {
      'brand.name': 'Estudio Vera',
      'brand.navLinks': 'Servicios\nEl equipo\nPrecios\nReservar',
      'brand.navCta': 'Reservar',
      'brand.login': '',
      'hero.eyebrow': 'Color y corte · Málaga',
      'hero.title': 'Sales con el pelo que pediste',
      'hero.subtitle':
        'Diagnóstico antes de tocar las tijeras y presupuesto cerrado. Sin sorpresas al llegar a la caja.',
      'hero.primary': 'Reservar hora',
      'hero.secondary': 'Ver servicios',
    },
  },

  taller: {
    sector: 'Taller mecánico',
    preset: 'Corporativo y legal',
    portada: 'centrada',
    etiquetas: ['tallermecanico', 'mecanica', 'negociolocal'],
    contenido: {
      'brand.name': 'Talleres Sanz',
      'brand.navLinks': 'Servicios\nRevisiones\nPresupuesto\nDónde estamos',
      'brand.navCta': 'Pedir cita',
      'brand.login': '',
      'hero.eyebrow': 'Multimarca · Getafe',
      'hero.title': 'Te llamamos antes de tocar nada',
      'hero.subtitle':
        'Diagnóstico, llamada y presupuesto por escrito. Si sale más caro de lo dicho, la diferencia la ponemos nosotros.',
      'hero.primary': 'Pedir cita',
      'hero.secondary': 'Ver servicios',
    },
  },
}

// ------------------------------------------------------------
// Las fotos se enchufan aquí, ya con su recorte, para que los guiones no
// tengan que saber nada de esto.
// ------------------------------------------------------------
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const IMAGENES = JSON.parse(fs.readFileSync(path.join(AQUI, 'imagenes.json'), 'utf8'))

/** URL de la foto de un negocio, recortada por el CDN a lo que pide el hueco. */
export function foto(clave, forma) {
  const base = IMAGENES[clave]?.[forma]
  if (!base) return ''
  const medidas = forma === 'vertical' ? 'w=1200&h=1500' : 'w=1600&h=900'
  return `${base}?auto=compress&cs=tinysrgb&${medidas}&fit=crop`
}

for (const [clave, n] of Object.entries(NEGOCIOS)) {
  const url = foto(clave, n.portada === 'imagen' ? 'apaisada' : 'vertical')
  if (url) n.contenido['hero.image'] = url
}

export const listaNegocios = () => Object.keys(NEGOCIOS)
export { IMAGENES }
