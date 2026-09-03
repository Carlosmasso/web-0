// Las seis estéticas maestras. Cada una es un PARCHE que se superpone a la
// paleta y la tipografía que el cliente ya haya elegido: gobierna bordes,
// sombras, efectos y la forma de los controles, no el color.
//
// El valor `id` viaja al DOM como [data-aesthetic] y es lo que activa los
// bloques de comportamiento en demo.css (el gesto al pulsar un botón, el
// anillo de foco, el tratamiento de superficie).

export const AESTHETIC_OPTIONS = [
  {
    id: 'material-clean',
    label: 'Material limpio',
    note: 'Elevación suave que responde al puntero. El estándar SaaS.',
    patch: {
      borders: { radius: 'soft', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'soft-elevation', color: 'auto', intensity: 1 },
      effects: { blur: 0, noise: false, aurora: false },
      components: {
        hero: { background: 'solid' },
        button: { shape: 'inherit', fill: 'solid' },
        input: { variant: 'outline' },
      },
    },
  },
  {
    id: 'minimalist-flat',
    label: 'Minimalista plano',
    note: 'Sin sombras, líneas finísimas, todo el peso en el aire.',
    patch: {
      borders: { radius: 'soft', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'none', color: 'auto', intensity: 1 },
      effects: { blur: 0, noise: false, aurora: false },
      components: {
        hero: { background: 'solid' },
        button: { shape: 'inherit', fill: 'solid' },
        input: { variant: 'underline' },
      },
    },
  },
  {
    id: 'neo-brutalism',
    label: 'Neo-brutalismo',
    note: 'Bordes de 3 px, sombra sólida desplazada. El botón cae al pulsarlo.',
    patch: {
      borders: { radius: 'none', width: 'thick', style: 'solid', color: 'auto' },
      shadows: { style: 'flat-hard', color: 'auto', intensity: 1.4 },
      effects: { blur: 0, noise: false, aurora: false },
      components: {
        hero: { background: 'solid' },
        button: { shape: 'sharp', fill: 'solid' },
        input: { variant: 'outline' },
      },
    },
  },
  {
    id: 'glassmorphism',
    label: 'Glassmorfismo',
    note: 'Superficies translúcidas con desenfoque sobre una aurora a la deriva.',
    patch: {
      borders: { radius: 'round', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'soft-elevation', color: 'auto', intensity: 1.5 },
      effects: { blur: 18, noise: true, aurora: true },
      components: {
        hero: { background: 'aurora' },
        button: { shape: 'pill', fill: 'gradient' },
        input: { variant: 'filled' },
      },
    },
  },
  {
    id: 'claymorphism',
    label: 'Claymorfismo',
    note: 'Volumen de arcilla: luz interior arriba, sombra dentro al hundirse.',
    patch: {
      borders: { radius: 'round', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'inset-3d', color: 'auto', intensity: 1.1 },
      effects: { blur: 0, noise: false, aurora: false },
      components: {
        hero: { background: 'gradient' },
        button: { shape: 'pill', fill: 'solid' },
        input: { variant: 'filled' },
      },
    },
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    note: 'Neón con resplandor exterior y un destello que barre al pasar.',
    patch: {
      borders: { radius: 'none', width: 'thin', style: 'solid', color: 'auto' },
      shadows: { style: 'glowing-neon', color: 'auto', intensity: 1.3 },
      effects: { blur: 0, noise: true, aurora: false },
      components: {
        hero: { background: 'gradient' },
        button: { shape: 'sharp', fill: 'outline' },
        input: { variant: 'underline' },
      },
    },
  },
]

export const getAesthetic = (id) =>
  AESTHETIC_OPTIONS.find((a) => a.id === id) ?? AESTHETIC_OPTIONS[0]
