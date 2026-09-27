import { createContext, useContext } from 'react'
import { interpolate, spring, useVideoConfig } from 'remotion'
import { clamp } from '../diseno/animaciones'
import { MUELLE } from '../diseno/marca'

// ============================================================
// ANIMAR UNA PIEZA FIJA — el mismo componente, quieto o en movimiento
//
// Las diapositivas y las portadas se pintan igual en PNG que en vídeo. En
// vídeo, `Tiempo` lleva el fotograma actual y cada bloque entra escalonado
// (icono, antetítulo, titular, texto, tarjeta de abajo: "overlapping
// action"). En imagen fija, `Tiempo` es null y todo está en su sitio.
//
// Los muelles son los de la marca (los del intro): entran con decisión y sin
// rebotes, que ya se probaron y se descartaron.
// ============================================================

/** El fotograma actual en un vídeo; null en una imagen fija. */
export const Tiempo = createContext(null)

// Cuándo entra cada bloque, en fotogramas (30 por segundo).
export const ENTRADA = { icono: 0, antetitulo: 6, titular: 10, texto: 18, abajo: 30, extra: 24 }

/** Estilo de entrada de un bloque: sube y aparece. */
export function useEntrada(desde, { dy = 70, config = MUELLE.vivo } = {}) {
  const frame = useContext(Tiempo)
  const { fps } = useVideoConfig()
  if (frame == null) return null
  const p = spring({ frame: frame - desde, fps, config })
  return { opacity: interpolate(p, [0, 0.5], [0, 1], clamp), translate: (1 - p) * dy }
}

/**
 * Flotar: un vaivén lento y pequeño, en bucle exacto con la duración del
 * vídeo (una vuelta entera), para que al repetirse no dé un salto.
 */
export function useFlotar(amplitud = 6) {
  const frame = useContext(Tiempo)
  const { durationInFrames } = useVideoConfig()
  if (frame == null) return 0
  return Math.sin((frame / durationInFrames) * Math.PI * 2) * amplitud
}

/** Un bloque que entra en `desde`; con `flotar`, además se mece. */
export function Aparece({ desde = 0, dy, config, flotar = 0, style, children }) {
  const e = useEntrada(desde, { dy, config })
  const f = useFlotar(flotar)
  if (!e && !flotar) return <div style={style}>{children}</div>
  return (
    <div
      style={{
        ...style,
        opacity: e?.opacity ?? 1,
        transform: `translateY(${(e?.translate ?? 0) + f}px)`,
      }}
    >
      {children}
    </div>
  )
}
