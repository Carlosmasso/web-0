// Emparejamientos tipográficos del marketplace. Cada uno entrega el bloque
// `typography` del contrato. Las familias se cargan bajo demanda desde
// src/theme/fonts.js.

export const TYPE_PAIRINGS = [
  {
    id: 'space-grotesk',
    name: 'Space Grotesk + Inter',
    note: 'Geométrica, tono producto',
    values: {
      headingFamily: '"Space Grotesk", system-ui, sans-serif',
      bodyFamily: '"Inter", system-ui, sans-serif',
      monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
      headingWeight: 700,
      headingCase: 'none',
      headingTracking: '-0.02em',
      scaleRatio: 1.25,
    },
  },
  {
    id: 'archivo-black',
    name: 'Archivo Black + Inter',
    note: 'Titular macizo, para bloques duros',
    values: {
      headingFamily: '"Archivo Black", "Helvetica Neue", sans-serif',
      bodyFamily: '"Inter", system-ui, sans-serif',
      monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
      headingWeight: 400,
      headingCase: 'uppercase',
      headingTracking: '-0.01em',
      scaleRatio: 1.333,
    },
  },
  {
    id: 'newsreader',
    name: 'Newsreader + Inter',
    note: 'Editorial, serif de titular',
    values: {
      headingFamily: '"Newsreader", Georgia, serif',
      bodyFamily: '"Inter", system-ui, sans-serif',
      monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
      headingWeight: 500,
      headingCase: 'none',
      headingTracking: '-0.02em',
      scaleRatio: 1.28,
    },
  },
  {
    id: 'sora',
    name: 'Sora + Inter',
    note: 'Tecnológica, limpia',
    values: {
      headingFamily: '"Sora", system-ui, sans-serif',
      bodyFamily: '"Inter", system-ui, sans-serif',
      monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
      headingWeight: 600,
      headingCase: 'none',
      headingTracking: '-0.03em',
      scaleRatio: 1.25,
    },
  },
  {
    id: 'outfit',
    name: 'Outfit + Work Sans',
    note: 'Amable, redondeada',
    values: {
      headingFamily: '"Outfit", system-ui, sans-serif',
      bodyFamily: '"Work Sans", system-ui, sans-serif',
      monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
      headingWeight: 600,
      headingCase: 'none',
      headingTracking: '-0.025em',
      scaleRatio: 1.24,
    },
  },
  {
    id: 'chakra-mono',
    name: 'Chakra Petch + IBM Plex Mono',
    note: 'Terminal, técnica, en versales',
    values: {
      headingFamily: '"Chakra Petch", "IBM Plex Mono", monospace',
      bodyFamily: '"IBM Plex Mono", ui-monospace, monospace',
      monoFamily: '"IBM Plex Mono", ui-monospace, monospace',
      headingWeight: 600,
      headingCase: 'uppercase',
      headingTracking: '0.08em',
      scaleRatio: 1.2,
    },
  },
]

export const getTypePairing = (id) =>
  TYPE_PAIRINGS.find((t) => t.id === id) ?? TYPE_PAIRINGS[0]
