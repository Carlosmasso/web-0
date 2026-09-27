// ============================================================
// IDENTIDAD DEL VÍDEO
//
// Los mismos colores que la landing (`public/landing.css`) y el mismo dibujo
// que el favicon: quien vea el vídeo y luego entre en maketa.es tiene que
// reconocer el sitio.
// ============================================================

export const TINTA = '#16171b'
export const TINTA_SUAVE = '#55575e'
export const TINTA_TENUE = '#8b8d95'
export const FONDO = '#ffffff'
export const FONDO_ALT = '#f6f6f4'
export const LINEA = '#e6e6e2'
export const ACENTO = '#3b53d6'
export const ACENTO_CLARO = '#8ba0ff' // el acento de la landing en modo oscuro

// Los tres colores de marca de la demo. `tinte` es el mismo tono casi blanco,
// para los fondos de iconos: así el cambio se nota en toda la tarjeta y no
// solo en el botón.
export const PALETAS = [
  { hex: '#3B53D6', tinte: '#E7EAFB' },
  { hex: '#F0652F', tinte: '#FDE9DF' },
  { hex: '#7C3AED', tinte: '#EFE7FD' },
]

// Muelles. Nada se mueve en línea recta: `suave` no rebota (salidas, color),
// `vivo` rebota un poco (entradas, recolocaciones) y `pop` es el golpe corto
// de cuando algo cambia en el sitio.
export const MUELLE = {
  suave: { damping: 200 },
  vivo: { damping: 14, stiffness: 140, mass: 0.8 },
  pop: { damping: 10, stiffness: 220, mass: 0.5 },
}
