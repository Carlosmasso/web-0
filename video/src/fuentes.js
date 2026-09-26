// Las tres familias de la demo de tipografía. Remotion espera a que carguen
// antes de capturar cada fotograma, así que no hay saltos de fuente en el render.
import { loadFont as cargarInter } from '@remotion/google-fonts/Inter'
import { loadFont as cargarFraunces } from '@remotion/google-fonts/Fraunces'
import { loadFont as cargarMono } from '@remotion/google-fonts/JetBrainsMono'

export const SANS = cargarInter('normal', {
  weights: ['500', '600', '700', '800', '900'],
  subsets: ['latin'],
}).fontFamily

export const SERIF = cargarFraunces('normal', {
  weights: ['600'],
  subsets: ['latin'],
}).fontFamily

export const MONO = cargarMono('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
}).fontFamily
