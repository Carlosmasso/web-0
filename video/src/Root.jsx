import { Composition } from 'remotion'
import * as sistema from '../contenido/sistema.mjs'
import ideasJson from '../contenido/ideas.json'
import { listaParaCrear, validarTodas } from '../lib/modelo.mjs'
import { celdasFeed, propsDe, propsPortada } from '../lib/props.mjs'
import { Carrusel, CarruselVideo, DURACION_DIAPOSITIVA, HojaContactos, calcularCarrusel, calcularCarruselVideo, calcularHoja } from './carrusel/Carrusel'
import { CARRUSEL, REEL } from './diseno/formatos'
import { Feed, medidasFeed } from './feed/Feed'
import { AvatarInstagram } from './intro/AvatarInstagram'
import { IntroMaketa } from './intro/IntroMaketa'
import { Reel, calcularReel } from './motor/Reel'
import { PortadaComposicion } from './portadas/PortadaPieza'

// ============================================================
// TODAS LAS COMPOSICIONES — salen de contenido/ideas.json
//
//   IR-01, IC-21…   cada idea que se puede crear ya (reel o carrusel)
//   Portada-<id>    su portada
//   Feed            el borrador del feed: props { ids: [...] }
//   Reel · Carrusel · CarruselHoja · CarruselVideo   las genéricas que usa `pnpm crear`
//   IntroMaketa · AvatarInstagram     el vídeo de marca y la foto de perfil
// ============================================================

const ideas = validarTodas(ideasJson, sistema)
const listas = ideas.filter(listaParaCrear)

const VERTICAL = { fps: 30, width: REEL.ancho, height: REEL.alto }
// Carrusel: un fotograma por diapositiva, a 1 fps para pasarlas en el editor.
const FIJO = { fps: 1, width: CARRUSEL.ancho, height: CARRUSEL.alto }

const reel = (id, props) => (
  <Composition key={id} id={id} component={Reel} durationInFrames={300} defaultProps={props} calculateMetadata={calcularReel} {...VERTICAL} />
)
const carrusel = (id, props) => (
  <Composition key={id} id={id} component={Carrusel} durationInFrames={1} defaultProps={props} calculateMetadata={calcularCarrusel} {...FIJO} />
)
const portada = (p) => (
  <Composition
    key={`Portada-${p.id}`}
    id={`Portada-${p.id}`}
    component={PortadaComposicion}
    durationInFrames={1}
    fps={1}
    width={p.formato === 'reel' ? REEL.ancho : CARRUSEL.ancho}
    height={p.formato === 'reel' ? REEL.alto : CARRUSEL.alto}
    defaultProps={propsPortada(p, ideas, sistema)}
  />
)

const calcularFeed = ({ props }) => {
  const celdas = celdasFeed(props.ids ?? [], ideas, sistema)
  return { ...medidasFeed(celdas.length), props: { ...props, celdas } }
}

const primerReel = listas.find((p) => p.formato === 'reel')
const primerCarrusel = listas.find((p) => p.formato === 'carrusel')

export const RemotionRoot = () => (
  <>
    {listas.map((p) => (p.formato === 'reel' ? reel(p.id, propsDe(p, ideas, sistema)) : carrusel(p.id, propsDe(p, ideas, sistema))))}
    {listas.map(portada)}

    <Composition
      id="Feed"
      component={Feed}
      durationInFrames={1}
      fps={1}
      {...medidasFeed(9)}
      defaultProps={{ ids: listas.slice(0, 9).map((p) => p.id) }}
      calculateMetadata={calcularFeed}
    />

    {reel('Reel', propsDe(primerReel, ideas, sistema))}
    {carrusel('Carrusel', propsDe(primerCarrusel, ideas, sistema))}
    <Composition
      id="CarruselHoja"
      component={HojaContactos}
      durationInFrames={1}
      defaultProps={propsDe(primerCarrusel, ideas, sistema)}
      calculateMetadata={calcularHoja}
      {...FIJO}
    />

    <Composition
      id="CarruselVideo"
      component={CarruselVideo}
      durationInFrames={DURACION_DIAPOSITIVA}
      fps={30}
      width={CARRUSEL.ancho}
      height={CARRUSEL.alto}
      defaultProps={{ ...propsDe(primerCarrusel, ideas, sistema), indice: 0 }}
      calculateMetadata={calcularCarruselVideo}
    />

    <Composition id="IntroMaketa" component={IntroMaketa} durationInFrames={450} {...VERTICAL} />
    <Composition id="AvatarInstagram" component={AvatarInstagram} durationInFrames={1} fps={30} width={1080} height={1080} />
  </>
)
