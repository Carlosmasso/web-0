import { useMemo } from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { setIn } from '../../../src/config/patch'
import { MUELLE } from '../marca'
import { Escenario } from './Escenario'
import { webDelReel } from './web'

// ============================================================
// LO QUE VA DENTRO DE LA TARJETA
//
//   { tipo: 'web', negocio: 'rural', cambios: [...] }   la web real que cambia
//   { tipo: 'imagen', src: 'captura.png' }              una captura
//   { tipo: 'video', src: 'clip.mp4' }                  un clip corto
//
// `src` sin http se busca en video/public/ (staticFile).
// ============================================================

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
const origen = (src) => (/^https?:\/\//.test(src) ? src : staticFile(src))
const cubre = { width: '100%', height: '100%', objectFit: 'cover' }

// Un cambio de diseño se funde en un tercio de segundo, como en el propio
// configurador (sus colores transicionan 0,4 s). Nada de golpes: la web se
// transforma, no salta.
const FUNDIDO = 10

/**
 * La web real, con dos capas: debajo el estado anterior y encima el actual,
 * que aparece fundiéndose. Cuando termina el fundido, la de abajo no se ve.
 */
function PantallaWeb({ negocio, cambios, ancho, alto, escala }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const web = useMemo(() => webDelReel(negocio, cambios), [negocio, cambios])
  const todos = useMemo(() => ({ configs: web.estados.map((e) => e.config), contenidos: [web.contenido] }), [web])

  const k = web.estados.findLastIndex((e) => e.frame <= frame)
  const actual = web.estados[k]
  const previo = web.estados[Math.max(0, k - 1)]
  const funde = k === 0 ? 1 : spring({ frame: frame - actual.frame, fps, config: MUELLE.suave, durationInFrames: FUNDIDO })

  // Tecleo: el titular crece letra a letra entre `desde` y `hasta`.
  const letras = web.titular
    ? Math.round(interpolate(frame, [web.titular.desde, web.titular.hasta], [0, web.titular.texto.length], clamp))
    : null
  const contenido = useMemo(
    () => (letras == null ? web.contenido : setIn(web.contenido, 'hero.title', web.titular.texto.slice(0, letras))),
    [web, letras],
  )

  const scroll = web.scroll
    ? interpolate(frame, [web.scroll.desde, web.scroll.hasta], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
    : 0

  const comun = { contenido, todos, scroll, ancho, alto, escala }
  return (
    <>
      <AbsoluteFill>
        <Escenario config={previo.config} {...comun} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: funde }}>
        <Escenario config={actual.config} {...comun} />
      </AbsoluteFill>
    </>
  )
}

export function Pantalla({ pantalla, ancho, alto, escala }) {
  if (pantalla.tipo === 'web') {
    return (
      <PantallaWeb negocio={pantalla.negocio} cambios={pantalla.cambios ?? []} ancho={ancho} alto={alto} escala={escala} />
    )
  }
  if (pantalla.tipo === 'imagen') return <Img src={origen(pantalla.src)} style={cubre} />
  if (pantalla.tipo === 'video') return <OffthreadVideo src={origen(pantalla.src)} muted style={cubre} />
  throw new Error(`tipo de pantalla desconocido: ${pantalla.tipo}`)
}
