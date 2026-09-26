import { Composition } from 'remotion'
import { AvatarInstagram } from './AvatarInstagram'
import { IntroMaketa } from './IntroMaketa'
import { DURACION, PlantillaReel } from './plantilla/PlantillaReel'
import { EJEMPLO } from './plantilla/ejemplo'
import { piezas } from './piezas'

const VERTICAL = { fps: 30, width: 1080, height: 1920 }

export const RemotionRoot = () => (
  <>
    {/* Vídeo de marca, para fijar en el perfil. */}
    <Composition id="IntroMaketa" component={IntroMaketa} durationInFrames={450} {...VERTICAL} />

    {/* Foto de perfil de Instagram (fotograma suelto, 1080x1080). */}
    <Composition id="AvatarInstagram" component={AvatarInstagram} durationInFrames={1} fps={30} width={1080} height={1080} />

    {/* La plantilla suelta, con el ejemplo editable. */}
    <Composition
      id="PlantillaReel"
      component={PlantillaReel}
      durationInFrames={DURACION}
      defaultProps={EJEMPLO}
      {...VERTICAL}
    />

    {/* Las 40 piezas de la cola de publicación. */}
    {piezas().map((p) => (
      <Composition
        key={p.id}
        id={p.id}
        component={PlantillaReel}
        durationInFrames={DURACION}
        defaultProps={p.props}
        {...VERTICAL}
      />
    ))}
  </>
)
