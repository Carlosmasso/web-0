# Plan de producto y difusión

> **Qué es esto.** El estado del proyecto y lo siguiente que hay que hacer, en
> orden y con el porqué de cada cosa. Sirve para retomar el trabajo sin tener
> que reconstruir el contexto, y para no volver a debatir lo que ya se decidió.
>
> **Cómo se mantiene.** Al cerrar una tarea, se tacha y se anota qué se aprendió.
> Cuando una decisión cambie, se corrige aquí mismo en vez de dejar dos
> versiones dando vueltas. Última revisión: **26 de septiembre de 2026**.

---

## Dónde estamos

**El producto va por delante del negocio.** El configurador está bien
construido —separación de canal cosmético y estructural, guardarraíles de
contraste, panel podado a conciencia— y por encima de lo que se ve en el
sector. El problema no está ahí.

Lo que falta es evidencia de demanda: **cero clientes, sin alta de autónomo**
(el precio ya está decidido y la landing enseña el "desde 249 €"). Y el plan de difusión que hay montado apunta a móvil,
que es justo donde el producto flojea.

### El dato que ordena las prioridades

Medido en un iPhone 14 (390 × 844) contra el build de producción:

```
panel:   390 × 472 px   ← ocupa el 56% de la pantalla
lienzo:  empieza en el píxel 472, fuera de vista
```

En móvil **el usuario no ve su web mientras la toca**. El "wow" del producto
—tocas algo y cambia delante de ti— no ocurre en el dispositivo desde el que se
ven los reels. Hay un aviso ("El configurador va mejor desde un ordenador") que
es honesto pero es una rendición.

---

## P0 · Antes de publicar un solo reel  ·  HECHO

### 1. ~~Que el configurador funcione en móvil~~ HECHO

**Por qué.** Los reels se ven en el móvil, prometen una web que cambia en vivo,
y llevan a una pantalla donde eso no se ve sin hacer scroll. Cada visita que
traigamos se evapora en los primeros diez segundos.

**Qué hacer.** Invertir la disposición en móvil, sin rehacer nada:

1. Lienzo **arriba y fijo**, ocupando el 55-60% de la altura.
2. Panel abajo, en una hoja deslizable con dos alturas (asomada y extendida).
   Es el patrón de Google Maps: nadie necesita que se lo expliquen.
3. Al tocar un preset o una estética, la hoja baja a su altura mínima para que
   el cambio se vea sin tocar nada más.
4. Quitar el aviso de "va mejor desde un ordenador" cuando deje de ser cierto.

**Dónde.** `src/configurator/shell.css` (el bloque `@media (max-width: 1000px)`)
y el estado de la hoja en `src/configurator/App.jsx`. El componente `.stage` y
`.shell__panel` ya existen; es disposición, no lógica nueva.

**Hecho cuando.** En un iPhone 14, al abrir `/app.html` se ve la web del cliente
sin hacer scroll, y al tocar un preset el cambio es visible en la misma pantalla.

**Resuelto (sept. 2026).** El lienzo ocupa fijo la mitad de arriba y el panel vive
en una hoja con dos alturas, con tirador arrastrable. Medido en 390x844: de **0 px
de web visible a 408**. La hoja se aparta sola al tocar un preset, una estética o
una opción, mediante un único `onClickCapture` en el panel, para que cualquier
control futuro quede cubierto sin tocarlo. El arrastre escribe el desplazamiento
directamente sobre el nodo y solo al soltar decide React la altura: pasar cada
píxel del dedo por el estado haría renderizar el panel entero y se vería a
tirones. Fuera el aviso de "va mejor desde un ordenador", que ya no es cierto.

---

### 2. ~~Contenido de demostración por sector~~ HECHO

**Por qué.** Quien entra hoy ve "Cartograma · Reparto de última milla", un SaaS
de reparto. Una peluquera no se reconoce y el producto le pide que imagine. El
salto de "imagínate tu web" a "mira tu web" es el que más convierte.

**Qué hacer.** Conectar cada preset por sector con un contenido propio. **Los
textos ya están escritos**: los ocho negocios de
[`video/datos/negocios.mjs`](video/datos/negocios.mjs) tienen
titular, entradilla, botones, enlaces de menú y foto de Pexels verificada.

1. Mover esos negocios a `src/content/` como contenidos de demostración.
2. Emparejar cada preset de "Por sector" con el suyo (salud → clínica dental,
   hostelería → obrador, corporativo → despacho…).
3. Al aplicar un preset de sector, ofrecer cambiar también el contenido — o
   cambiarlo directamente si el cliente no ha escrito nada aún, que es el caso
   normal en los primeros minutos.

**Ojo con las fotos.** Las imágenes de las secciones interiores siguen siendo
las de la demo de Cartograma. Cada negocio declara `portada: 'imagen'` o
`'centrada'` según si su foto aguanta el hero. Para que el recorrido completo
sea creíble hace falta un banco de fotos por sector (ver Pendiente largo).

**Hecho cuando.** Elegir "Salud y bienestar" deja en pantalla la web de una
clínica con textos de clínica, no de software de reparto.

**Resuelto (sept. 2026).** `src/content/sectores.js` tiene los seis sectores
completos: clínica dental, obrador, despacho, estudio de arquitectura, escuela
infantil y restaurante. Los nombres coinciden con los de los reels, así que quien
llega desde un vídeo reconoce el sitio.

La regla que hay que respetar si se toca esto: **el contenido solo se pisa si
sigue siendo el de demostración**. En cuanto alguien escribe una línea suya, el
preset cambia el diseño y no toca ni una palabra. No hace falta ninguna bandera:
se compara el contenido actual con los de demostración conocidos, así que la
respuesta vive en el propio contenido y sobrevive a recargar la página.

Y una lección sobre las fotos: `picsum` devuelve una imagen **aleatoria** por
semilla. En la primera versión salía un barco en alta mar bajo el epígrafe
"Radiología". Todas las imágenes de sector son ahora de Pexels y temáticas; solo
los retratos de los testimonios siguen en picsum, donde un rostro genérico sí es
un marcador honesto.

---

## P1 · El mes siguiente

### 3. Capturar el correo antes del final

**Por qué.** Hoy el único punto de captura es "Quiero esta web", el último
paso. Quien juega diez minutos, le gusta y no está listo para escribir, **se
pierde para siempre**. Existe "Copiar enlace para seguir", pero obliga a que el
usuario se auto-gestione el enlace.

**Qué hacer.** Un "Guárdatelo y te lo mando al correo" que envíe el enlace del
diseño. Un solo campo. Reutiliza la función que ya existe en
[`api/lead.js`](api/lead.js), marcando el registro como *guardado* y no como
*solicitud*, para no ensuciar los leads de verdad.

**Cuidado.** Es un tratamiento de datos: consentimiento explícito y mención en
`public/privacidad.html`, igual que el formulario de contacto.

**Hecho cuando.** Se puede guardar un diseño dejando solo el correo, llega el
email con el enlace, y el registro queda separado de las solicitudes.

---

### 4. ~~Un precio orientativo en la landing~~ HECHO

**Por qué.** El dueño de un bar no sabe si le vas a pedir 300 € o 3.000. Ante
esa duda, la mayoría no escribe. Un rango filtra y tranquiliza.

**Qué hacer.** Un "desde X €" en [`index.html`](index.html), como orientación y
no como oferta. Antes hay que **decidir el precio**, que hoy no existe ni para
responder por teléfono.

**Cuidado.** Choca con la fase 0 (ver Bloqueos). Un rango orientativo no es una
oferta vinculante, pero conviene revisarlo cuando se resuelva el alta.

**Hecho (oct. 2026).** Carlos decide publicarlo sin alta, sabiendo el riesgo:
el precio quita el paso de preguntar. Sección `#precio` antes de `cta-final`
(enlazada en el menú) con **una sola tarjeta**: la web de una página, desde
249 €, y una línea para más páginas, reservas o pagos. La oferta completa
está en [`TARIFAS.md`](TARIFAS.md): la base (con un mes de cambios incluido) y
tres extras sencillos —páginas extra, reservas o venta de pocos productos
conectando herramientas que ya existen, y cambios sueltos—, más lo que no se
hace. En la landing los extras salen **sin precio** ("¿Te hace falta más?"); el
precio va por correo. El JSON-LD sigue sin precio. Pendiente de mirar
en analítica si suben las solicitudes.

---

## P2 · Cuando haya tracción

### 5. Casos reales dentro del producto

Un "así quedó la web de X" en la landing, con antes y después. Es la prueba
social que más decide, y no se puede fabricar: depende de tener clientes.

---

## Bloqueos de negocio (no son código)

Estos condicionan todo lo demás y no se resuelven programando:

- [x] ~~**Decidir el precio**.~~ Hecho: la landing enseña el "desde" y la
      tarifa completa va por correo (ver punto 4).
- [ ] **Alta de autónomo.** Si mañana escribe una clínica dispuesta a pagar
      1.200 €, hoy no hay forma de cobrarlos. Mientras siga así, todo el sitio es
      "carácter informativo" (ver `public/aviso-legal.html`).
      **Decidido (oct. 2026):** el alta se tramita, con tarifa plana, la misma
      semana en que el primer cliente diga que sí, y se le ofrecen la web y el plan
      mensual desde el principio (`TARIFAS.md`). Descartado cobrar como trabajo
      esporádico (el plan mensual es recurrente por definición) y por cooperativa
      de facturación. Confirmar los detalles con un gestor antes de la primera
      factura.
- [ ] **Conseguir dos o tres webs reales**, aunque sean gratis o a precio
      simbólico: un amigo con negocio, la peluquería del barrio, el fisio.
      No es caridad, es el inventario de prueba social y de contenido.

---

## Difusión

> **Plan de los primeros 30 días en Reels y TikTok** —pilares, calendario,
> ganchos, bio, protocolo tras publicar, crecimiento y un guion de ejemplo—
> en [`DIFUSION.md`](DIFUSION.md).

### La expectativa correcta

**El primer cliente no va a venir de Instagram.** Una cuenta nueva tarda meses
en generar confianza. El primer cliente saldrá de la red personal, del negocio
de al lado o de un grupo local. Las redes construyen el escaparate para cuando
alguien te busque; no son el canal de captación inicial. Conviene tenerlo claro
para no desanimarse en la semana tres.

### El sistema que ya existe

Cada pieza es una idea de `video/contenido/ideas.json` (30 reels y 29
carruseles, no todos con las diapositivas escritas). Qué se publica y cuándo
lo decide Carlos; el vídeo se produce con **Remotion** en
[`video/`](video/README.md):

```bash
cd video
pnpm crear                 # las ideas y cuáles se pueden crear ya
pnpm crear IR-19           # vídeo, portada, pies y ficha en out/IR-19/
pnpm crear feed IR-03 IC-21 IR-19   # cómo quedan juntas en el perfil
```

**Decidido (sept. 2026): todos los reels se hacen con Remotion, desde la primera
pieza.** Los que estaban grabados con Playwright (semanas 1 a 3) se descartan y
no se publican, para que la cuenta arranque con un solo formato.

Todos salen de **un solo motor** (`video/src/motor/`), en la línea del vídeo
de marca: gancho sobre fondo tinta, la web real del negocio en una tarjeta que
se transforma con la pastilla que dice qué cambia, y el cierre del intro. Se
probó un estilo de subtítulos Hormozi en amarillo y se descartó: parecía un
vídeo cualquiera. La web de la tarjeta son los **componentes reales** del
sitio con un config por fotograma: es el producto de verdad, no una maqueta.
Un reel nuevo es una idea más en `ideas.json`, nunca una composición nueva.

### Reparto del esfuerzo

| Cuándo | Qué |
| --- | --- |
| Semanas 1-4 | Conseguir dos o tres webs reales. Publicar dos reels por semana sin obsesionarse con los números: se está construyendo un archivo. |
| En paralelo | Ficha de Google Business y aparecer en "diseño web [ciudad]". Aburrido, pero convierte más que mil reproducciones. |
| Cuando haya casos | Formato antes/después, que se come a todo lo demás. |

### El inventario se agota

Las 40 piezas son unos tres meses. Pasado eso, la salida no es estirar la cola
sino meter ejes nuevos: clientes reales, antes/después, consejos para dueños de
negocio. Un generador evita que las ideas se pisen; no las tiene por ti.

### Carruseles educativos (sept. 2026)

El eje de "consejos para dueños de negocio" ya tiene sistema: **carruseles**
para Instagram y LinkedIn sobre cómo encargar, tener y mejorar una web, con el
mismo acabado que los reels y el mismo motor (Remotion renderiza también
imágenes fijas). Cada carrusel es una idea de `video/contenido/ideas.json`;
`pnpm crear IC-xx` saca los PNG, el PDF de LinkedIn y una hoja de contactos.
Hay diez plantillas y una decena de carruseles escritos. Detalle en
[`video/README.md`](video/README.md).

**Choque con la fase 0, sin resolver.** Los carruseles hablan de contratar una
web, y la regla de difusión dice que no se habla de dinero ni de presupuesto.
Criterio aplicado mientras Carlos no diga otra cosa: los carruseles hablan de
propiedad, accesos, proceso y calidad, que no son dinero; **las seis ideas de
precio quedan en espera** (⏸ en `IDEAS.md`) y ninguno usa "presupuesto" ni
cifras. Cuando haya alta, se revisa.

---

## Lo que NO hacemos

Decidido y cerrado. Si vuelve a salir, esto es la respuesta:

- **No añadir más opciones al configurador.** Ya tiene más capacidad de la que
  un cliente necesita para decidir, y cada control nuevo es ruido. El histórico
  de podas está en el README.
- **No construir el modo autoservicio** (que el cliente se descargue su web).
  Cambia el modelo de negocio, mete a competir con Wix y quita lo único que
  diferencia: que la monta Carlos.
- **No perseguir la perfección visual de las seis estéticas.** Ya están bien.
  Lo que no convierte no es el glassmorfismo.
- **No perseguir audios de moda ni formatos de baile** en redes. El activo es
  enseñar un producto que se transforma en directo; disfrazarlo lo destruye.

---

## Qué medir

Con Vercel Web Analytics y los eventos de `src/config/analytics.js`, tres
números por semana:

| Número | Qué dice |
| --- | --- |
| Visitas → abren el configurador | Si el mensaje de la landing funciona |
| Abren → tocan un preset | Si el producto engancha en los primeros segundos |
| Tocan → escriben | Si la propuesta convence |

Si el segundo se hunde en móvil, es la confirmación de que **P0 · 1** era lo
correcto.

---

## Pendiente largo

- **Ideas de producto a medio plazo:** están en [`MEJORAS.md`](MEJORAS.md),
  ordenadas por fase (ahora, tras el alta, con clientes). Se pasan aquí cuando
  se prioricen.
- ~~**Fotos en los reels.**~~ Resuelto: los reels montan el contenido por
  sector del producto, y los cuatro negocios cuyo preset no es de su sector
  llevan secciones propias con fotos temáticas (`video/datos/secciones.mjs`).
- ~~**Iconos de las secciones de sector.**~~ Resuelto: los 29 iconos que pide el
  contenido (`bread`, `tooth`, `scissors`…) están en el mapa de
  `src/preview/Icon.jsx` en las dos familias, y `src/preview/icon.test.js`
  falla si algún contenido pide uno que no exista. Coste: unos 30 kB
  comprimidos más en el bundle.
- **Los UTM.** Se implementaron y se revirtieron: con el referrer basta para
  LinkedIn. Aviso para el futuro: Instagram y TikTok **no envían referrer
  fiable** —su navegador interno lo pierde— y aparecerán como tráfico directo.
  Si eso molesta, el trabajo está hecho en el commit `216d3e7` y se puede
  recuperar.

---

## Registro de lo hecho

| Fecha | Qué |
| --- | --- |
| sept. 2026 | Sistema de generación de reels: 8 negocios × 5 formatos, fotos de Pexels enlazadas, producción por semanas con fichas de publicación. |
| sept. 2026 | Vídeo largo y post para LinkedIn. |
| sept. 2026 | Arreglado el campo de listas del formulario de contenido: no dejaba pulsar Intro ni escribir espacios. |
| sept. 2026 | Arregladas las estéticas: tres redefinían `--theme-border-color` sin efecto porque el estilo en línea las pisaba. "Material limpio" y "Minimalista plano" se distinguen más, aunque siguen siendo vecinas. |
| sept. 2026 | Dominio: `maketa.es` pasa a ser el principal y `www` redirige, coherente con el `canonical` y el `og:url`. |
| sept. 2026 | Páginas legales al día: reconocen Vercel Web Analytics, que antes se negaba. |
| sept. 2026 | **P0 · 1**: el configurador en móvil pasa a lienzo fijo arriba y panel en hoja deslizable. De 0 a 408 px de web visible al abrir. |
| sept. 2026 | **P0 · 2**: contenido de demostración para los seis sectores, con fotos temáticas de Pexels y la garantía de no pisar lo que el cliente haya escrito. |
| sept. 2026 | Vídeo de marca en Remotion (`video/`, composición `IntroMaketa`): 15 s en vertical, problema → demostración abstracta de color, tipografía y variantes → cierre "Diséñala tú. Yo la construyo." Es una pieza de marca: los reels de la cola enseñan el producto real. |
| sept. 2026 | Los reels pasan a Remotion con una plantilla de 15 s (`video/src/plantilla/`) con el acabado del vídeo de marca: gancho, web real en tarjeta con fundidos entre cambios y pastilla, cierre de marca. Los cinco formatos, reescritos como datos; `pnpm reels N` renderiza una semana con sus pies. Fuera Playwright (`grabar.mjs`, `plato.mjs`, `mux.swift` y la dependencia). |
| sept. 2026 | Voz única en primera persona: el cierre del intro y de los reels dice "Diséñala tú. Yo la construyo.", como la landing. Secciones propias para casa rural, fisio, peluquería y taller, que heredaban el contenido de otro sector. |
| sept. 2026 | Motor de reels "¿qué cambia si modifico X?" (`video/src/motor/`): un JSON por reel, plantillas de preset, estilo, color, tipografía y combinaciones, selección automática de las variantes más distintas, el color transformándose en continuo sobre la web real. `pnpm reel reels/x.json`. Seis reels de ejemplo y 30 ideas en `video/reels/IDEAS.md`. |
| sept. 2026 | Un solo sistema de reels: la cola semanal pasa a producirse con el motor (plantillas nuevas `portada`, `titular` y `recorrido`), y `pnpm reel` también saca pies y ficha. Fuera la plantilla antigua de la cola y `scripts/social/` entero (los catálogos viven en `video/datos/`), y los vídeos grabados con Playwright. |
| sept. 2026 | Carruseles educativos en Remotion (`video/src/carrusel/`): un JSON por carrusel, plantillas `pregunta`, `errores` y `checklist`, una diapositiva por fotograma exportada a PNG 1080x1350, PDF para LinkedIn y hoja de contactos. Tras la primera revisión, **una sola retícula** para todos: escala fija (96/72/40/36/26 px), icono, antetítulo y titular siempre en el mismo sitio; nada encoge y, si un texto no cabe, el render falla. Cuatro carruseles reales (dominio, mantenimiento, errores al encargar, checklist antes de contratar), cuatro de resistencia y 100 ideas. |
| sept. 2026 | Barra de navegación del sitio en móvil: la hamburguesa ya no se aplasta con marcas largas (la marca baja a dos líneas y la hamburguesa es una zona táctil de 44 px), la barra "centrada" deja el botón y la hamburguesa a la derecha, los enlaces del menú se alinean con la marca, y el panel tiene sombra y se desplaza por dentro si no cabe. |
| sept. 2026 | El contenido para redes se simplifica a un archivo y un comando: `video/contenido/ideas.json` (cada idea es la pieza entera) y `pnpm crear <id>`, más `pnpm crear feed <id…>` para ver el perfil antes de subir. Fuera el planificador, el calendario, los estados y la armonía automática: cuándo publicar lo decide Carlos. |
| sept. 2026 | Fuera el "Enlace de acceso" ("Entrar") del menú: venía del contenido de ejemplo de tipo software, no tiene sentido para un negocio local, apuntaba a `#` (enlace muerto) y en el formulario aparecía como "pendiente" aunque los sectores lo dejan vacío a propósito. |
| sept. 2026 | Pulido de interacción del configurador: la hoja de móvil se lanza con la inercia del dedo (proyección de velocidad, resistencia elástica en los bordes, se puede agarrar a medio camino) y los botones se hunden al pulsarlos. El formulario de contacto ya no tiene el botón apagado sin explicación: valida al enviar, dice qué falta debajo de cada campo, lleva el foco al primero y el botón dice "Pedir presupuesto". Emoji y glifos del panel (🎲, ✕, ✓, ↑↓) pasan a iconos Tabler. |
| sept. 2026 | La landing enseña el producto: captura real del configurador en modo cliente (preset de obrador) bajo el hero, más ancha que el texto y enlazada a `/app.html` (`public/configurador-{720,1440,2160}.webp`, 47–233 KB). Si el panel cambia mucho, se recaptura `/app.html` a 1440×900 desde una dirección que no sea `localhost` (p. ej. `[::1]`) para que salga el modo cliente. |
| oct. 2026 | Sección nueva **"Dónde estamos"** (`location`): dirección, teléfono, horario por tramos, botón "Cómo llegar" (Google Maps con la dirección) y **mapa de Google incrustado** a partir de la propia dirección (sin clave de API, carga diferida, invertido en los temas oscuros). Visible de partida en todos los presets, de sector y de estilo, antes de la llamada a la acción. "Dónde estamos", "Visítanos", "Cómo llegar" y "Horarios" bajan a ella. Lo guardado antes la recibe con su ejemplo sin perder nada. **Al entregar:** el mapa de Google pone cookies de terceros, así que en la web publicada va detrás del aviso de cookies. |
| oct. 2026 | Fuera los enlaces muertos del sitio: los del pie bajan a la sección que nombran (o al contacto si no nombran ninguna), la marca sube a la portada y los legales son texto hasta la entrega. Antes eran `href="#"`: no llevaban a nada y vaciaban el diseño de la URL. |
| oct. 2026 | Landing: el texto se alinea con la captura del configurador (mismo ancho, 1040 px; los párrafos conservan su medida de lectura) y los pasos y el precio pasan a columnas en escritorio. Tono del precio: primero el resultado ("que acabes con una web de la que estés orgulloso"), el precio como "la parte fácil", y la entrega no se publica hasta que el cliente está contento. |
| oct. 2026 | Oferta simplificada a lo que Carlos puede entregar solo ([`TARIFAS.md`](TARIFAS.md)): base de una página + un mes de cambios, y tres extras (páginas, reservas/venta con herramientas existentes, cambios sueltos); fuera tiendas completas, paneles, usuarios, idiomas y SEO mensual. Landing: bloque "¿Te hace falta más?" sin precios. Pedido: casillas opcionales de extras que llegan dentro de la nota (sin tocar `/api/lead` ni la hoja) y se miden en `lead_submitted`. |
| oct. 2026 | Tono de la landing: el dinero pasa a segundo plano. Fuera "Precio" del menú y la cifra de la frase del botón principal; el precio solo sale en su tarjeta, más discreto, bajo "Lo que te llevas". Paso 2 pasa a "Hablamos", sección nueva "Cómo trabajo" (hablas conmigo, hasta que te guste, que me recomiendes) y cierre "¿Le damos forma a tu web?". Criterio: Maketa crece por recomendación, y se recomienda a quien te trató bien. |
| oct. 2026 | El configurador habla como la landing: el botón principal pasa de "Pedir presupuesto" a **"Quiero esta web"**, el formulario a "Cuéntame y te escribo yo" (botón "Escríbeme"), y la confirmación, el recorrido guiado y el final del panel dejan de hablar de presupuesto y precio. `og.png` regenerada: "Gratis y sin registro · Hecha contigo, a tu medida" (antes "Presupuesto sin compromiso", que chocaba con la fase 0 al compartir el enlace). Los eventos de analítica no cambian de nombre. |
| oct. 2026 | `TARIFAS.md`: el margen pasa a los extras que dan dinero o ahorran trabajo (precios de lanzamiento: página extra 99 €, reservas 129 €, vender online 179 €; se suben hacia 120/180/240 € con cinco webs entregadas) y a un plan mensual "Web tranquila" de 25 €/mes (hosting, dominio y hasta 3 cambios), que requiere el alta. La base sigue en 249 € y los cambios sueltos se quedan baratos (30 €) para que el cliente no deje de escribir. |
| oct. 2026 | Reels con vídeo real: plantilla `historia` en el motor (misma composición `Reel`). Gancho sobre un clip del oficio, la web de antes en un móvil, Maketa en uso (un dedo toca punto de partida, color y portada con foto), dos planos reales con frase y la web terminada ("Así quedaría la tuya"). Clips de Pexels por URL en `video/datos/historias.json`. Primera pieza: IR-31, el obrador ("Tu pan es de verdad. ¿Tu web también?"), 24 s, portada duelo Antes/Ahora. |
| oct. 2026 | Siete historias más (IR-32 a IR-38): casa rural, clínica dental, despacho de abogados, fisio, estudio de arquitectura, peluquería y taller, cada una con tres clips de su oficio. El toque del dedo es más pequeño y discreto, el fondo del móvil pasa a ser la foto del negocio (un clip corto ya no corta la escena) y el color intermedio se elige lejos de la marca. |
| oct. 2026 | Las historias dejan de ser iguales: tres formas (`antes` con toques elegidos de un catálogo de cinco, `escribe` con teclado y galería del móvil, `partida` con el oficio arriba y su sección de la web abajo) y dos portadas nuevas (`foto`, con la foto real a sangre, y `titular`). Reparto: obrador, rural y taller en pantalla partida; peluquería, fisio y arquitectura escriben; clínica y abogados, antes y ahora con toques distintos. Arreglado de paso: al bajar a una sección, el escenario ya no deja asomar la anterior cuando el menú no se queda fijo (también en el carrusel escaparate). |
| oct. 2026 | Landing tras la primera revisión de diseño (22/32): tira "Así quedaría la tuya" con cuatro webs de ejemplo (recortadas del móvil de los reels, `public/ejemplo-*.jpg`), bloque "Soy Carlos" con el correo y firma en el cierre; la captura del hero ya no arranca invisible. Pendiente de esa revisión: llegada desde el móvil, secciones repetidas, textos de los botones y la foto de Carlos. |
| oct. 2026 | Landing destilada: de nueve bloques a siete. "Cómo trabajo" entra en "Soy Carlos"; "Qué es, y qué no" desaparece (lo esencial pasa al hero y a "Para quién es", ahora en dos columnas: comercio y profesionales); la llamada es "Diseñar mi web" en todas partes y el og:description habla en primera persona. |
| oct. 2026 | Llegada desde el móvil: cada ejemplo de la landing abre el configurador en su sector (`/app.html?sector=<preset>`, se aplica una vez con la regla de contenido de demostración y se quita de la URL); la peluquería se cambia por el obrador, que sí tiene punto de partida. Zonas táctiles de 44 px en la cabecera y el pie (`pointer: coarse`). Pendiente: un enlace por reel (`?sector=` en la bio o en el pie de cada historia). |
| oct. 2026 | Los ejemplos de la landing pasan de capturas de móvil a la portada de cada web: su foto de Pexels (la del contenido por sector, enlazada por URL) a sangre en 4:5, su titular encima sobre un degradado y un leve acercamiento al pasar. Se borran `public/ejemplo-*.jpg`. |
| oct. 2026 | Configurador tras su primera revisión (27/40): la visita guiada pasa de 10 pasos a 3 y su primer paso pregunta "¿A qué te dedicas?" (cinco respuestas que abren su sector; "Otra cosa" deja el ejemplo neutro), anclada abajo en el móvil. Formulario de contacto con la foto de Carlos, lo opcional plegado en "Añadir algo más" y el botón de enviar siempre a la vista. Las franjas de logos y las FAQ de ejemplo ya no nombran marcas reales (aseguradoras, guías, hoteles). Pasos del panel en lenguaje llano: Tu tipo de negocio · Tu marca · Retoques; "Tu web" en vez de "Maketa · proyecto" para el cliente. Pendiente de esa revisión: escala de tamaños y radios del panel, contraste del pie legal, "Reiniciar" con el peso de Deshacer. |
