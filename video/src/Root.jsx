import { Composition } from 'remotion'
import { AvatarInstagram } from './AvatarInstagram'
import { IntroMaketa } from './intro/IntroMaketa'
import { Reel, calcularReel } from './motor/Reel'
import { Carrusel, HojaContactos, calcularCarrusel, calcularHoja } from './carrusel/Carrusel'
import { ALTO as ALTO_CARRUSEL, ANCHO as ANCHO_CARRUSEL } from './carrusel/formato'
import { cola, idDe, reelDe } from '../datos/cola.mjs'

// ============================================================
// TODAS LAS COMPOSICIONES
//
//   IntroMaketa       el vídeo de marca
//   AvatarInstagram   la foto de perfil
//   Reel              EL motor de reels: una sola composición para todos
//     Reel-<nombre>     cada JSON de video/reels/
//     P01-rural-rafaga  cada pieza de la cola semanal (datos/cola.mjs)
//   Carrusel          los carruseles de video/carruseles/
//
// Los reels y los carruseles se detectan solos: añadir uno no toca este archivo.
// ============================================================

const archivosReel = import.meta.webpackContext('../reels', { recursive: false, regExp: /\.json$/ })
const reelsEnDatos = archivosReel.keys().map((ruta) => ({
  id: 'Reel-' + ruta.replace(/^\.\//, '').replace(/\.json$/, ''),
  datos: archivosReel(ruta),
}))

// Los carruseles admiten subcarpetas (`pruebas/` son los de resistencia).
const archivosCarrusel = import.meta.webpackContext('../carruseles', { recursive: true, regExp: /\.json$/ })
const carruselesEnDatos = archivosCarrusel.keys().map((ruta) => ({
  id: ruta.replace(/^\.\//, '').replace(/\.json$/, '').replace(/[^a-zA-Z0-9]+/g, '-'),
  datos: archivosCarrusel(ruta),
}))

const VERTICAL = { fps: 30, width: 1080, height: 1920 }

// Carrusel: un fotograma por diapositiva, a 1 fps para pasarlas en el editor.
const CARRUSEL = { fps: 1, width: ANCHO_CARRUSEL, height: ALTO_CARRUSEL }

// Un reel del motor: la duración la calcula `calcularReel` a partir de los datos.
const reel = (id, datos) => (
  <Composition
    key={id}
    id={id}
    component={Reel}
    durationInFrames={300}
    defaultProps={datos}
    calculateMetadata={calcularReel}
    {...VERTICAL}
  />
)

export const RemotionRoot = () => (
  <>
    <Composition id="IntroMaketa" component={IntroMaketa} durationInFrames={450} {...VERTICAL} />
    <Composition id="AvatarInstagram" component={AvatarInstagram} durationInFrames={1} fps={30} width={1080} height={1080} />

    {/* El motor: la composición genérica, los reels sueltos y la cola. */}
    {reel('Reel', { plantilla: 'color', negocio: 'dental', variantes: 'auto', cantidad: 5 })}
    {reelsEnDatos.map((r) => reel(r.id, r.datos))}
    {cola().map((p) => reel(idDe(p), reelDe(p)))}

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
  </>
)
