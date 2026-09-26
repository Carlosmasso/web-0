import { useCurrentFrame, useVideoConfig } from 'remotion'
import { entrar, progreso } from '../animaciones'
import { FONDO, LINEA, MUELLE } from '../marca'

/**
 * La tarjeta del intro: esquinas de 44 px, borde fino y sombra suave, centrada
 * en el ancho del vídeo. Entra subiendo con un muelle vivo. Dentro va lo que
 * se quiera (la web real, una imagen, un vídeo).
 */
export function Tarjeta({ arriba, ancho, alto, children }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return (
    <div
      style={{
        position: 'absolute',
        top: arriba,
        left: (1080 - ancho) / 2,
        width: ancho,
        height: alto,
        overflow: 'hidden',
        background: FONDO,
        borderRadius: 44,
        border: `2px solid ${LINEA}`,
        boxShadow: '0 40px 90px -40px rgba(22,23,27,0.35)',
        ...entrar(progreso(frame, fps, 4, MUELLE.vivo)),
      }}
    >
      {children}
    </div>
  )
}
