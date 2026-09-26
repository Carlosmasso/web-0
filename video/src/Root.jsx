import { Composition } from 'remotion'
import { AvatarInstagram } from './AvatarInstagram'
import { IntroMaketa } from './IntroMaketa'
import { DURACION, PlantillaReel } from './plantilla/PlantillaReel'
import { EJEMPLO } from './plantilla/ejemplo'
import { piezas } from './piezas'
import { Reel, calcularReel } from './motor/Reel'
import { Carrusel, HojaContactos, calcularCarrusel, calcularHoja } from './carrusel/Carrusel'
import { ALTO as ALTO_CARRUSEL, ANCHO as ANCHO_CARRUSEL } from './carrusel/formato'

// Cada JSON de video/reels/ es un reel del motor: se detectan solos, sin
// tener que registrarlos aquí.
const archivosReel = import.meta.webpackContext('../reels', { recursive: false, regExp: /\.json$/ })
const reelsEnDatos = archivosReel.keys().map((ruta) => ({
  id: 'Reel-' + ruta.replace(/^\.\//, '').replace(/\.json$/, ''),
  datos: archivosReel(ruta),
}))

// Lo mismo con los carruseles de video/carruseles/ (subcarpetas incluidas:
// `pruebas/` son los de resistencia).
const archivosCarrusel = import.meta.webpackContext('../carruseles', { recursive: true, regExp: /\.json$/ })
const carruselesEnDatos = archivosCarrusel.keys().map((ruta) => ({
  id: ruta.replace(/^\.\//, '').replace(/\.json$/, '').replace(/[^a-zA-Z0-9]+/g, '-'),
  datos: archivosCarrusel(ruta),
}))

const VERTICAL = { fps: 30, width: 1080, height: 1920 }

// Carrusel: un fotograma por diapositiva, a 1 fps para pasarlas en el editor.
const CARRUSEL = { fps: 1, width: ANCHO_CARRUSEL, height: ALTO_CARRUSEL }

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

    {/* El motor de reels: la composición genérica y un reel por cada JSON. */}
    <Composition
      id="Reel"
      component={Reel}
      durationInFrames={300}
      defaultProps={{ plantilla: 'color', negocio: 'dental', variantes: 'auto', cantidad: 5 }}
      calculateMetadata={calcularReel}
      {...VERTICAL}
    />
    {reelsEnDatos.map((r) => (
      <Composition
        key={r.id}
        id={r.id}
        component={Reel}
        durationInFrames={300}
        defaultProps={r.datos}
        calculateMetadata={calcularReel}
        {...VERTICAL}
      />
    ))}

    {/* Carruseles (imágenes 1080x1350): uno por JSON, y su hoja de contactos. */}
    {carruselesEnDatos.map((c) => (
      <Composition
        key={c.id}
        id={`Carrusel-${c.id}`}
        component={Carrusel}
        durationInFrames={1}
        defaultProps={{ carrusel: c.datos }}
        calculateMetadata={calcularCarrusel}
        {...CARRUSEL}
      />
    ))}
    <Composition
      id="Carrusel"
      component={Carrusel}
      durationInFrames={1}
      defaultProps={{ carrusel: carruselesEnDatos[0]?.datos }}
      calculateMetadata={calcularCarrusel}
      {...CARRUSEL}
    />
    <Composition
      id="CarruselHoja"
      component={HojaContactos}
      durationInFrames={1}
      defaultProps={{ carrusel: carruselesEnDatos[0]?.datos }}
      calculateMetadata={calcularHoja}
      {...CARRUSEL}
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
