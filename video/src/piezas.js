// ============================================================
// LAS PIEZAS DE LA COLA, COMO COMPOSICIONES
//
// Qué se publica y en qué orden lo decide scripts/social/plan.mjs (formato ×
// negocio, sin repetir). Aquí cada pieza se convierte en las props de la
// plantilla: el gancho, las frases y los cambios de su formato, y el cierre
// del ejemplo. Lo usan Root.jsx (studio) y publicar.mjs (render por semanas).
// ============================================================

import { cola } from '../../scripts/social/plan.mjs'
import { FORMATOS } from '../../scripts/social/lib/formatos.mjs'
import { NEGOCIOS } from '../../scripts/social/lib/negocios.mjs'
import { EJEMPLO } from './plantilla/ejemplo.js'

/** P01-rural-rafaga: número de pieza, negocio y formato. */
export const idDe = ({ i, negocio, formato }) => `P${String(i + 1).padStart(2, '0')}-${negocio}-${formato}`

export function propsDe({ negocio, formato }) {
  const { gancho, frases, cambios } = FORMATOS[formato].reel(NEGOCIOS[negocio])
  return { gancho, frases, pantalla: { tipo: 'web', negocio, cambios }, cierre: EJEMPLO.cierre }
}

export const piezas = () => cola().map((p) => ({ ...p, id: idDe(p), props: propsDe(p) }))
