# Plan de producto y difusión

> **Qué es esto.** El estado del proyecto y lo siguiente que hay que hacer, en
> orden y con el porqué de cada cosa. Sirve para retomar el trabajo sin tener
> que reconstruir el contexto, y para no volver a debatir lo que ya se decidió.
>
> **Cómo se mantiene.** Al cerrar una tarea, se tacha y se anota qué se aprendió.
> Cuando una decisión cambie, se corrige aquí mismo en vez de dejar dos
> versiones dando vueltas. Última revisión: **25 de septiembre de 2026**.

---

## Dónde estamos

**El producto va por delante del negocio.** El configurador está bien
construido —separación de canal cosmético y estructural, guardarraíles de
contraste, panel podado a conciencia— y por encima de lo que se ve en el
sector. El problema no está ahí.

Lo que falta es evidencia de demanda: **cero clientes, cero precio definido,
sin alta de autónomo**. Y el plan de difusión que hay montado apunta a móvil,
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
[`scripts/social/lib/negocios.mjs`](scripts/social/lib/negocios.mjs) tienen
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

**Por qué.** Hoy el único punto de captura es "Pedir presupuesto", el último
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

### 4. Un precio orientativo en la landing

**Por qué.** El dueño de un bar no sabe si le vas a pedir 300 € o 3.000. Ante
esa duda, la mayoría no escribe. Un rango filtra y tranquiliza.

**Qué hacer.** Un "desde X €" en [`index.html`](index.html), como orientación y
no como oferta. Antes hay que **decidir el precio**, que hoy no existe ni para
responder por teléfono.

**Cuidado.** Choca con la fase 0 (ver Bloqueos). Un rango orientativo no es una
oferta vinculante, pero conviene revisarlo cuando se resuelva el alta.

---

## P2 · Cuando haya tracción

### 5. Casos reales dentro del producto

Un "así quedó la web de X" en la landing, con antes y después. Es la prueba
social que más decide, y no se puede fabricar: depende de tener clientes.

---

## Bloqueos de negocio (no son código)

Estos condicionan todo lo demás y no se resuelven programando:

- [ ] **Decidir el precio**, aunque no se publique. Hoy no hay respuesta si
      alguien pregunta por teléfono.
- [ ] **Alta de autónomo, o un plan B para facturar.** Si mañana escribe una
      clínica dispuesta a pagar 1.200 €, hoy no hay forma de cobrarlos. Mientras
      siga así, todo el sitio es "carácter informativo" (ver
      `public/aviso-legal.html`).
- [ ] **Conseguir dos o tres webs reales**, aunque sean gratis o a precio
      simbólico: un amigo con negocio, la peluquería del barrio, el fisio.
      No es caridad, es el inventario de prueba social y de contenido.

---

## Difusión

### La expectativa correcta

**El primer cliente no va a venir de Instagram.** Una cuenta nueva tarda meses
en generar confianza. El primer cliente saldrá de la red personal, del negocio
de al lado o de un grupo local. Las redes construyen el escaparate para cuando
alguien te busque; no son el canal de captación inicial. Conviene tenerlo claro
para no desanimarse en la semana tres.

### El sistema que ya existe

40 piezas, 3 por semana, 14 semanas sin que se repita ninguna combinación.
Todo en [`scripts/social/`](scripts/social/README.md):

```bash
node scripts/social/grabar.mjs        # ver el calendario
node scripts/social/grabar.mjs 4-6    # grabar de la semana 4 a la 6
```

Grabadas las semanas 1 a 3. Las demás, a razón de unos 23 segundos por pieza.

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

- **Fotos en los reels.** El configurador ya tiene fotos temáticas por sector
  (`src/content/sectores.js`), pero el sistema de reels sigue con una sola foto
  por negocio: al bajar la cámara reaparecen las imágenes de la demo de
  Cartograma. Lo suyo es que los reels tiren del mismo contenido por sector que
  ahora usa el producto, en vez de mantener dos catálogos.
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
