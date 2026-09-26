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
import { TINTE, TIPO, px } from './formato'

// ============================================================
// PIEZAS DE LOS CARRUSELES
//
// Lo que se repite en todas las diapositivas, con el acabado de los reels:
// Inter con el interletraje del intro, el azul de marca como único acento,
// esquinas grandes, borde fino y sombra suave. Una diapositiva nueva se monta
// con estas piezas, nunca con estilos propios.
// ============================================================

/** Estilo de titular: el de `Palabras` (reels), en estático. */
export const titular = (tamano, color = TINTA) => ({
  fontFamily: SANS,
  fontSize: px(tamano),
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
  fontSize: px(tamano),
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
  if (!children) return null
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: px(TIPO.etiqueta),
        fontWeight: 700,
        letterSpacing: '0.12em',
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
  if (!Dibujo) return null
  // El tamaño va en la caja y no en el SVG: `size` acaba en un atributo, donde
  // `calc()` no vale, y así el icono también encoge con el ajuste.
  return (
    <span style={{ width: px(tamano), height: px(tamano), display: 'inline-flex', flexShrink: 0 }}>
      <Dibujo size="100%" color={color} weight={peso} />
    </span>
  )
}

/** El icono dentro de un cuadrado de esquinas redondas, sobre el tinte del acento. */
export function CajaIcono({ nombre, tamano = 96, fondo = TINTE, color = ACENTO }) {
  if (!ICONOS[nombre]) return null
  return (
    <div
      style={{
        width: px(tamano),
        height: px(tamano),
        borderRadius: px(tamano * 0.3),
        background: fondo,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <Icono nombre={nombre} tamano={tamano * 0.5} color={color} />
    </div>
  )
}

// Un gris algo más oscuro que la línea: sobre blanco, una casilla vacía con
// el borde de `LINEA` apenas se ve.
const BORDE_CASILLA = '#cfcfca'

/** Casilla de lista: marcada (acento con check), pendiente (borde) o actual (borde de acento). */
export function Casilla({ estado = 'marcada', tamano = 56 }) {
  const marcada = estado === 'marcada'
  return (
    <div
      style={{
        width: px(tamano),
        height: px(tamano),
        borderRadius: px(tamano * 0.28),
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        background: marcada ? ACENTO : FONDO,
        border: marcada ? 'none' : `${px(Math.max(3, tamano * 0.06))} solid ${estado === 'actual' ? ACENTO : BORDE_CASILLA}`,
        boxSizing: 'border-box',
      }}
    >
      {marcada ? <Icono nombre="check" tamano={tamano * 0.62} color="#fff" /> : null}
    </div>
  )
}

/** La tarjeta del intro, en estático: esquinas grandes, borde fino, sombra suave. */
export function Tarjeta({ children, fondo = FONDO, style }) {
  return (
    <div
      style={{
        background: fondo,
        borderRadius: px(40),
        border: `2px solid ${LINEA}`,
        boxShadow: '0 24px 50px -36px rgba(22,23,27,0.35)',
        padding: `${px(44)} ${px(48)}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** La pastilla de los reels (la que dice qué cambia), aquí para la llamada a la acción. */
export function Pastilla({ icono, children, oscuro = false }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: px(18),
        padding: `${px(20)} ${px(34)} ${px(20)} ${px(24)}`,
        background: oscuro ? 'rgba(255,255,255,0.06)' : FONDO,
        border: `2px solid ${oscuro ? 'rgba(255,255,255,0.16)' : LINEA}`,
        borderRadius: 999,
        boxShadow: oscuro ? 'none' : '0 14px 34px -14px rgba(22,23,27,0.28)',
        fontFamily: SANS,
        fontSize: px(TIPO.cta),
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        color: oscuro ? '#fff' : TINTA,
      }}
    >
      {icono ? <Icono nombre={icono} tamano={40} color={oscuro ? ACENTO_CLARO : ACENTO} /> : null}
      <span>{children}</span>
    </div>
  )
}

/** Número de la lista ("01"), grande y en el acento. */
export function Numero({ children, tamano = 56, color = ACENTO }) {
  return (
    <span
      style={{
        fontFamily: SANS,
        fontSize: px(tamano),
        fontWeight: 800,
        letterSpacing: '-0.05em',
        lineHeight: 0.9,
        color,
        fontVariantNumeric: 'tabular-nums',
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  )
}
