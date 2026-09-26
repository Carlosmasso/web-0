import {
  ArrowDown,
  ArrowRight,
  ArrowsClockwise,
  BookmarkSimple,
  CalendarBlank,
  Certificate,
  ChatCircleText,
  Check,
  Clock,
  CursorClick,
  DeviceMobile,
  EnvelopeSimple,
  FileText,
  FolderOpen,
  Gauge,
  Globe,
  Handshake,
  HardDrives,
  Image,
  Key,
  Lightbulb,
  Lightning,
  ListChecks,
  LockSimple,
  MagnifyingGlass,
  PaintBrush,
  Question,
  ShareFat,
  ShieldCheck,
  Stack,
  Storefront,
  Tag,
  TextAa,
  User,
  UsersThree,
  WarningCircle,
  Wrench,
  X,
} from '@phosphor-icons/react'
import { SANS } from '../fuentes'
import { ACENTO, ACENTO_CLARO, FONDO, LINEA, TINTA } from '../marca'
import { RETICULA, TINTE, TIPO } from './formato'

// ============================================================
// PIEZAS DE LOS CARRUSELES
//
// Lo que se repite en todas las diapositivas, con el acabado de los reels:
// Inter con el interletraje del intro, el azul de marca como único acento,
// esquinas grandes, borde fino y sombra suave. Los tamaños salen de `TIPO`
// y `RETICULA` (formato.js); aquí no se inventa ninguno.
// ============================================================

/** Estilo de titular: el de `Palabras` (reels), en estático. */
export const titular = (tamano, color = TINTA) => ({
  fontFamily: SANS,
  fontSize: tamano,
  fontWeight: 700,
  letterSpacing: '-0.04em',
  lineHeight: 1.06,
  color,
  textWrap: 'balance',
  margin: 0,
})

/** Estilo de texto corrido. */
export const cuerpo = (color, tamano = TIPO.texto) => ({
  fontFamily: SANS,
  fontSize: tamano,
  fontWeight: 500,
  letterSpacing: '-0.015em',
  lineHeight: 1.34,
  color,
  textWrap: 'pretty',
  margin: 0,
})

/**
 * Texto con *resaltados*: lo que va entre asteriscos sale en el acento, igual
 * que en los ganchos de los reels.
 */
export function ConAcento({ texto, acento = ACENTO }) {
  return String(texto ?? '')
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((trozo, i) =>
      trozo.startsWith('*') && trozo.endsWith('*') ? (
        <span key={i} style={{ color: acento }}>
          {trozo.slice(1, -1)}
        </span>
      ) : (
        trozo
      ),
    )
}

/** La etiqueta de arriba: mayúsculas pequeñas y espaciadas, como en la landing. */
export function Antetitulo({ children, oscuro = false, style }) {
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: TIPO.etiqueta,
        fontWeight: 700,
        letterSpacing: '0.12em',
        lineHeight: 1.2,
        textTransform: 'uppercase',
        color: oscuro ? ACENTO_CLARO : ACENTO,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ------------------------------------------------------------
// ICONOS — la misma familia que el sitio (Phosphor, `iconSet` por defecto).
// El nombre en el JSON es el concepto, no el del dibujo.

const ICONOS = {
  dominio: Globe,
  hosting: HardDrives,
  accesos: Key,
  movil: DeviceMobile,
  seo: MagnifyingGlass,
  mantenimiento: Wrench,
  textos: TextAa,
  imagenes: Image,
  seguridad: ShieldCheck,
  velocidad: Lightning,
  precio: Tag,
  plazos: CalendarBlank,
  tiempo: Clock,
  pregunta: Question,
  check: Check,
  no: X,
  flecha: ArrowRight,
  abajo: ArrowDown,
  guardar: BookmarkSimple,
  compartir: ShareFat,
  contrato: FileText,
  persona: User,
  equipo: UsersThree,
  tienda: Storefront,
  correo: EnvelopeSimple,
  aviso: WarningCircle,
  idea: Lightbulb,
  archivos: FolderOpen,
  propiedad: Certificate,
  diseno: PaintBrush,
  rendimiento: Gauge,
  privado: LockSimple,
  acuerdo: Handshake,
  lista: ListChecks,
  conversion: CursorClick,
  conversacion: ChatCircleText,
  capas: Stack,
  cambios: ArrowsClockwise,
}

export const ICONOS_DISPONIBLES = Object.keys(ICONOS)

export function Icono({ nombre, tamano = 48, color = 'currentColor', peso = 'bold' }) {
  const Dibujo = ICONOS[nombre]
  if (!Dibujo) throw new Error(`Carrusel: icono desconocido "${nombre}". Hay: ${ICONOS_DISPONIBLES.join(', ')}`)
  return <Dibujo size={tamano} color={color} weight={peso} style={{ flexShrink: 0, display: 'block' }} />
}

/**
 * El icono dentro de un cuadrado de esquinas redondas, sobre el tinte del
 * acento. Con `marcada`, lleva en la esquina la marca de "comprobado" (las
 * diapositivas del checklist).
 */
export function CajaIcono({ nombre, tamano = RETICULA.icono, oscuro = false, marcada = false }) {
  return (
    <div
      style={{
        position: 'relative',
        width: tamano,
        height: tamano,
        borderRadius: tamano * 0.3,
        background: oscuro ? 'rgba(255,255,255,0.08)' : TINTE,
        border: oscuro ? '2px solid rgba(255,255,255,0.14)' : 'none',
        boxSizing: 'border-box',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <Icono nombre={nombre} tamano={tamano * 0.5} color={oscuro ? ACENTO_CLARO : ACENTO} />
      {marcada ? (
        <div
          style={{
            position: 'absolute',
            top: -tamano * 0.14,
            right: -tamano * 0.14,
            width: tamano * 0.42,
            height: tamano * 0.42,
            borderRadius: 999,
            background: ACENTO,
            border: `6px solid ${FONDO}`,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Icono nombre="check" tamano={tamano * 0.2} color="#fff" />
        </div>
      ) : null}
    </div>
  )
}

// Un gris algo más oscuro que la línea: sobre blanco, una casilla vacía con
// el borde de `LINEA` apenas se ve.
const BORDE_CASILLA = '#cfcfca'

/** Casilla de lista: marcada (acento con check) o pendiente (borde). */
export function Casilla({ estado = 'pendiente', tamano = 44 }) {
  const marcada = estado === 'marcada'
  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        borderRadius: tamano * 0.28,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: marcada ? ACENTO : FONDO,
        border: marcada ? 'none' : `3px solid ${BORDE_CASILLA}`,
        boxSizing: 'border-box',
      }}
    >
      {marcada ? <Icono nombre="check" tamano={tamano * 0.62} color="#fff" /> : null}
    </div>
  )
}

/** La tarjeta del intro, en estático: esquinas grandes, borde fino, sombra suave. */
export function Tarjeta({ children, style }) {
  return (
    <div
      style={{
        background: FONDO,
        borderRadius: 40,
        border: `2px solid ${LINEA}`,
        boxShadow: '0 24px 50px -36px rgba(22,23,27,0.35)',
        padding: '40px 48px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** La pastilla de los reels (la que dice qué cambia), aquí para la llamada a la acción. */
export function Pastilla({ icono, children }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 18,
        padding: '20px 34px 20px 24px',
        background: FONDO,
        border: `2px solid ${LINEA}`,
        borderRadius: 999,
        boxShadow: '0 14px 34px -14px rgba(22,23,27,0.28)',
        fontFamily: SANS,
        fontSize: TIPO.detalle,
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color: TINTA,
        // Una línea siempre: si la llamada a la acción no cabe, se acorta.
        whiteSpace: 'nowrap',
      }}
    >
      {icono ? <Icono nombre={icono} tamano={40} color={ACENTO} /> : null}
      <span>{children}</span>
    </div>
  )
}

/** Número de una lista ("01"), en el acento y del tamaño del detalle. */
export function Numero({ children }) {
  return (
    <span
      style={{
        fontFamily: SANS,
        fontSize: TIPO.detalle,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: ACENTO,
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0,
        width: 48,
      }}
    >
      {children}
    </span>
  )
}
