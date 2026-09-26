// ============================================================
// EJEMPLO DE REEL — copia este objeto para hacer uno nuevo
//
// Se ve en vivo con `pnpm studio` (composición "PlantillaReel") y los valores
// se pueden tocar desde el panel de props. Tiempos en FOTOGRAMAS (30 por
// segundo) y contados desde que empieza la escena de la demo, que dura 290.
// ============================================================

export const EJEMPLO = {
  // ✏️ GANCHO (escena 1, 3 s): lo que va *entre asteriscos* sale en azul.
  gancho: 'Tu web, *en vivo*, mientras la eliges.',

  // ✏️ LA TARJETA: la web real de un negocio del catálogo
  // (scripts/social/lib/negocios.mjs) y qué cambia en cada fotograma.
  // Cada cambio es uno de: estetica · color · tipografia · portada,
  // o { desde, hasta, titular: true } / { desde, hasta, scroll: true }.
  // La pastilla de arriba se rellena sola con el nombre de cada cambio.
  // Otras opciones: { tipo: 'imagen', src: 'captura.png' } o
  // { tipo: 'video', src: 'clip.mp4' }, con el archivo en video/public/.
  pantalla: {
    tipo: 'web',
    negocio: 'dental',
    cambios: [
      { frame: 30, color: '#1d4ed8' },
      { frame: 60, color: '#b45309' },
      { frame: 90, color: '#be123c' },
      { frame: 140, tipografia: 'playfair' },
      { frame: 175, tipografia: 'space-grotesk' },
      { frame: 225, estetica: 'claymorphism' },
    ],
  },

  // ✏️ FRASES bajo la tarjeta: [desde, hasta, 'texto'].
  frases: [
    [20, 130, 'Tu color, *al momento*.'],
    [135, 215, 'Tu letra, *también*.'],
    [220, 290, 'Y lo ves *antes de pedirla*.'],
  ],

  // ✏️ CIERRE (opcional): las dos líneas bajo la marca.
  cierre: { linea1: 'Diséñala tú.', linea2: 'Yo la construyo.' },
}
