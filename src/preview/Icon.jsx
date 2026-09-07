import {
  ArrowRight,
  ArrowUp,
  Check,
  Path,
  BellRinging,
  Signature,
  List,
  X,
  CaretDown,
  ArrowUUpLeft,
  ArrowUUpRight,
  ArrowClockwise,
  WhatsappLogo,
} from '@phosphor-icons/react'
import {
  IconArrowRight,
  IconArrowUp,
  IconCheck,
  IconRoute,
  IconBellRinging,
  IconSignature,
  IconMenu2,
  IconX,
  IconChevronDown,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconRefresh,
  IconBrandWhatsappFilled,
} from '@tabler/icons-react'

// One glyph name maps to a component in each family. Keeps a single icon
// family per render, switchable from the config.
const SETS = {
  phosphor: {
    route: Path,
    bell: BellRinging,
    signature: Signature,
    arrow: ArrowRight,
    'arrow-up': ArrowUp,
    check: Check,
    menu: List,
    close: X,
    chevron: CaretDown,
    undo: ArrowUUpLeft,
    redo: ArrowUUpRight,
    refresh: ArrowClockwise,
    whatsapp: WhatsappLogo,
  },
  tabler: {
    route: IconRoute,
    bell: IconBellRinging,
    signature: IconSignature,
    arrow: IconArrowRight,
    'arrow-up': IconArrowUp,
    check: IconCheck,
    menu: IconMenu2,
    close: IconX,
    chevron: IconChevronDown,
    undo: IconArrowBackUp,
    redo: IconArrowForwardUp,
    refresh: IconRefresh,
    whatsapp: IconBrandWhatsappFilled, // Tabler: la versión rellena es un componente aparte
  },
}

// Iconos que se pintan macizos (el resto va de trazo). En Phosphor es un
// `weight`; en Tabler ya es un componente `*Filled` en el mapa de arriba.
const FILLED = new Set(['whatsapp'])

export function Icon({ set = 'phosphor', name, size = 22, weight }) {
  const family = SETS[set] ?? SETS.phosphor
  const Cmp = family[name]
  if (!Cmp) return null
  // Phosphor lee `weight` (thin|light|regular|bold|fill); Tabler lo ignora y lee
  // `stroke`. `weight` explícito manda; si no, los de FILLED van macizos.
  const w = weight ?? (FILLED.has(name) ? 'fill' : 'regular')
  return <Cmp size={size} weight={w} stroke={1.6} aria-hidden />
}
