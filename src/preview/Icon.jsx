import {
  ArrowRight,
  Check,
  Path,
  BellRinging,
  Signature,
  List,
  X,
} from '@phosphor-icons/react'
import {
  IconArrowRight,
  IconCheck,
  IconRoute,
  IconBellRinging,
  IconSignature,
  IconMenu2,
  IconX,
} from '@tabler/icons-react'

// One glyph name maps to a component in each family. Keeps a single icon
// family per render, switchable from the config.
const SETS = {
  phosphor: {
    route: Path,
    bell: BellRinging,
    signature: Signature,
    arrow: ArrowRight,
    check: Check,
    menu: List,
    close: X,
  },
  tabler: {
    route: IconRoute,
    bell: IconBellRinging,
    signature: IconSignature,
    arrow: IconArrowRight,
    check: IconCheck,
    menu: IconMenu2,
    close: IconX,
  },
}

export function Icon({ set = 'phosphor', name, size = 22 }) {
  const family = SETS[set] ?? SETS.phosphor
  const Cmp = family[name]
  if (!Cmp) return null
  // Phosphor reads `weight`, Tabler reads `stroke`; each ignores the other.
  return <Cmp size={size} weight="regular" stroke={1.6} aria-hidden />
}
