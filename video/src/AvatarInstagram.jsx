import { AbsoluteFill } from 'remotion'
import { ACENTO } from './marca'

/**
 * Foto de perfil de Instagram: el dibujo del favicon, pero a sangre. Instagram
 * recorta en círculo, así que el fondo llena todo el cuadrado (sin esquinas
 * redondeadas) y la lámina lleva margen de sobra para que el recorte no la toque.
 * El último bloque va a media opacidad, como en el favicon: "por colocar".
 */
export const AvatarInstagram = () => (
  <AbsoluteFill style={{ backgroundColor: ACENTO }}>
    <svg width="100%" height="100%" viewBox="-3 -3 38 38">
      <rect x="7" y="6.5" width="18" height="19" rx="2.5" fill="none" stroke="#fff" strokeWidth="2" />
      <rect x="10" y="9.5" width="12" height="4" rx="1" fill="#fff" />
      <rect x="10" y="16" width="5.5" height="6.5" rx="1" fill="#fff" />
      <rect x="17.5" y="16" width="4.5" height="6.5" rx="1" fill="#fff" opacity="0.5" />
    </svg>
  </AbsoluteFill>
)
