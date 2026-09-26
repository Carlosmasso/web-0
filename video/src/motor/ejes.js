import { PRESETS } from '../../../src/registry/presets'
import { AESTHETIC_OPTIONS, getAesthetic } from '../../../src/registry/aesthetics'
import { TYPE_PAIRINGS, getTypePairing } from '../../../src/registry/fonts'
import { SECTION_META } from '../../../src/registry/options'
import { deepMerge, setIn } from '../../../src/config/patch'
import { hexToHsl, hslToHex, safePalette } from '../../../src/theme/color'
import { HUE_FAMILIES } from '../../../src/theme/randomize'

// ============================================================
// LOS EJES — las variables visuales que un reel puede cambiar
//
// Cada eje sabe tres cosas:
//   aplicar(raw, valor)  cómo se cambia en el contrato, con el MISMO parche
//                        que usa el configurador (nada de reimplementarlo)
//   etiqueta(valor)      cómo se nombra en pantalla, con las palabras del panel
//   transicion           'morph' si se puede interpolar (el color) o
//                        'barrido' si es un cambio discreto (fuentes, acabados)
//
// Y `ritmo`: cuántos fotogramas se queda cada variante en pantalla. Lo que se
// lee de un vistazo (un color) va más rápido que lo que hay que mirar (un
// preset entero).
// ============================================================

const buscar = (lista, id, que) => {
  const hallado = lista.find((x) => x.id === id)
  if (!hallado) throw new Error(`${que} desconocido: "${id}". Disponibles: ${lista.map((x) => x.id).join(', ')}`)
  return hallado
}

// ---------- color ----------

/** Nombre corto de un color de marca, a partir de las familias de tono del dado. */
export function nombreColor(hex) {
  const { h, s, l } = hexToHsl(hex)
  if (s < 12) return l < 30 ? 'Carbón' : l > 75 ? 'Hueso' : 'Gris'
  const dist = (f) => {
    const centro = (f.range[0] + f.range[1]) / 2
    const d = Math.abs(h - centro) % 360
    return Math.min(d, 360 - d)
  }
  const familia = [...HUE_FAMILIES].sort((a, b) => dist(a) - dist(b))[0]
  const nombre = { teal: 'turquesa' }[familia.name] ?? familia.name
  return nombre[0].toUpperCase() + nombre.slice(1)
}

/** Un color representativo de cada familia de tono: el centro de sus rangos. */
const mitad = ([a, b]) => (a + b) / 2
export const COLORES_CANDIDATOS = HUE_FAMILIES.map((f) =>
  hslToHex({ h: mitad(f.range), s: mitad(f.sat), l: mitad(f.light) }),
)

// ---------- tipografía ----------

/** Familia de una tipografía, para medir cuánto se parecen dos. */
export function claseTipografia(id) {
  const t = getTypePairing(id)
  const f = t.values.headingFamily
  if (/monospace|Mono|Chakra/i.test(f)) return 'mono'
  if (/serif/i.test(f) && !/sans-serif/i.test(f)) return 'serif'
  if (t.values.headingWeight >= 800 || /Black/i.test(f)) return 'display'
  return 'sans'
}

// ------------------------------------------------------------

export const EJES = {
  preset: {
    nombre: 'Preset',
    ritmo: 42,
    transicion: 'barrido',
    valores: () => PRESETS.map((p) => p.id),
    // Un preset es un punto de partida entero: se aplica tal cual, como en el
    // configurador. El contenido del negocio no se toca.
    aplicar: (_raw, id) => structuredClone(buscar(PRESETS, id, 'preset').config),
    etiqueta: (id) => {
      const p = buscar(PRESETS, id, 'preset')
      return { titulo: p.label, muestras: p.swatch }
    },
  },

  estilo: {
    nombre: 'Estilo',
    ritmo: 36,
    transicion: 'barrido',
    valores: () => AESTHETIC_OPTIONS.map((a) => a.id),
    aplicar: (raw, id) => {
      const { patch } = buscar(AESTHETIC_OPTIONS, id, 'estilo')
      return deepMerge(raw, { aesthetic: id, ...patch, meta: { aestheticId: id } })
    },
    etiqueta: (id) => ({ titulo: getAesthetic(id).label }),
  },

  color: {
    nombre: 'Color principal',
    ritmo: 32,
    transicion: 'morph',
    valores: () => COLORES_CANDIDATOS,
    aplicar: (raw, hex) => {
      const scheme = raw.meta?.mode === 'dark' ? 'dark' : 'light'
      return deepMerge(raw, { palette: safePalette(hex, { scheme }), meta: { mode: scheme } })
    },
    etiqueta: (hex) => ({ titulo: nombreColor(hex), valor: hex.toUpperCase(), muestras: [hex] }),
  },

  portada: {
    nombre: 'Portada',
    ritmo: 60, // la portada entera cambia de composición: pide más tiempo de lectura
    transicion: 'barrido',
    valores: () => SECTION_META.hero.variants.map((v) => v.id),
    aplicar: (raw, id) => setIn(raw, 'sections.hero', id),
    etiqueta: (id) => ({ titulo: SECTION_META.hero.variants.find((v) => v.id === id)?.label ?? id }),
  },

  tipografia: {
    nombre: 'Tipografía',
    ritmo: 36,
    transicion: 'barrido',
    valores: () => TYPE_PAIRINGS.map((t) => t.id),
    aplicar: (raw, id) => {
      const t = buscar(TYPE_PAIRINGS, id, 'tipografía')
      return deepMerge(raw, { typography: t.values, meta: { typeId: id } })
    },
    etiqueta: (id) => ({ titulo: getTypePairing(id).name.split(' + ')[0] }),
  },
}

// El orden en que se aplican los ejes de una combinación: primero lo que
// define la base (preset), después el acabado y la letra, y el color al final
// para que siempre se vea el que se ha elegido.
export const ORDEN_EJES = ['preset', 'portada', 'estilo', 'tipografia', 'color']
