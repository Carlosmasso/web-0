# Difusión en Reels y TikTok — plan de 30 días

> **Qué es esto.** Cómo se comercializa Maketa en Instagram y TikTok el primer
> mes: qué se publica, cómo se engancha en los tres primeros segundos, qué hacer
> después de publicar y cómo convierte cada web entregada en un escaparate.
> Cuelga de la sección "Difusión" de [`PLAN.md`](PLAN.md) y respeta sus
> decisiones cerradas. Última revisión: **26 de septiembre de 2026**.

---

## Las cuatro reglas que condicionan todo el plan

| Regla | Qué implica en redes |
| --- | --- |
| **El cliente diseña, yo la construyo.** No hay autoservicio (PLAN, "Lo que NO hacemos"). | Nunca "hazte tu web en 5 minutos" ni "publícala hoy". La promesa es *verla en vivo antes de comprometerte*. |
| **Fase 0: no se habla de dinero.** | Ni "presupuesto", ni precios, ni "oferta" en vídeos, pies ni bio. El gancho es probar y trastear, no contratar. |
| **Nada de audios de moda ni bailes.** | El activo es un producto que se transforma en directo. Los vídeos salen mudos y el sonido se elige en la app, al ritmo de 120 bpm. |
| **El primer cliente no va a venir de Instagram.** | Las redes montan el escaparate. En este mes pesan más las dos o tres webs reales (PLAN, Bloqueos) que el número de seguidores. |

La voz pública es la de la landing, **en primera persona**: "Diseña tu web tú
mismo. Yo la construyo." Detrás hay una persona y no una empresa, y eso es lo
que la distingue de Wix.

---

## 1 · Estrategia de contenido (días 1-30)

### A quién le hablamos

Todos son pequeños negocios locales, el público de la landing y de los contenidos
por sector. Hay tres situaciones que se reconocen enseguida:

| Persona | Situación | Lo que le frena | Lo que le mueve |
| --- | --- | --- | --- |
| **La dueña sin web** (peluquería, taller, obrador) | Vive de Instagram y del boca a boca | "No sé por dónde empezar" · "Eso es para empresas grandes" | Ver *su* web, con *su* nombre, sin tener que imaginársela |
| **El profesional con web vieja** (clínica, despacho, fisio) | Tiene una web de 2015 que le da vergüenza enseñar | "Rehacerla es un proyecto" · "Me va a quitar semanas" | Una web que dé confianza, sin tener que meterse en un proyecto |
| **El que se lo iba a hacer el sobrino** | Lleva un año con la web "a medio hacer" | "Ya tengo a alguien" (que no la termina) | Decidir él cómo se ve y que alguien la termine de verdad |

### Frecuencia

**Dos piezas fijas a la semana y una opcional.** Es lo que marca el PLAN para
las semanas 1-4: la prioridad del mes es conseguir webs reales, y las redes no
pueden comérsela.

- **Las fijas salen de la cola**: piezas 1 a 8 de `scripts/social/`,
  producidas con la plantilla de **Remotion** (`cd video && pnpm reels 1`
  renderiza una semana con sus pies). Los reels grabados antes con Playwright
  se descartan: la cuenta arranca con un solo formato.
- **La opcional** es de los pilares educativo o de humor, que la cola no cubre.
  Se hace si hay tiempo, nunca a costa de una web real.
- **Instagram y TikTok comparten el mismo MP4**, sin marca de agua, pero cada
  red lleva su propio pie: `instagram.txt` y `tiktok.txt` de cada carpeta.
- **Horario:** entre semana, de 13:00 a 14:30 o de 20:30 a 22:00, cuando el
  dueño de un negocio mira el móvil. A partir de la segunda semana, se ajusta
  con los datos de la propia cuenta en Estadísticas.

### Los tres pilares

| Pilar | Peso | Para qué sirve | De dónde sale |
| --- | --- | --- | --- |
| **Escaparate** (estética) | ~65 % | Enseña el producto: una web que se transforma delante de ti La cola de reels (`rafaga`, `identidad`, `portada`, `escribir`, `recorrido`), producida con Remotion, y el vídeo de marca, todo en `video/` |
| **Educativo** | ~20 % | Aporta algo aunque no contraten: consejos de web para dueños de negocio | Grabación nueva: el configurador de fondo y rótulos encima |
| **Dolor / humor** | ~15 % | Que se reconozcan: "esto me pasa a mí" | Grabación nueva: solo texto en pantalla, formato `escribir` |

**Ideas por pilar** (todas se pueden hacer con el producto real):

- **Educativo**
  - "Lo único que tiene que decir la portada de tu web" (titular, qué haces, dónde, y un botón).
  - "El botón que más clientes trae a un negocio pequeño" → el de WhatsApp flotante.
  - "Tres colores y ya": por qué una paleta de marca se construye desde un solo color.
  - "Tu web no es tu Instagram": qué debería tener la web que no esté en Instagram.
- **Dolor / humor** (el humor va en el texto, no en el audio)
  - "Mi web la hizo mi cuñado en 2014" → corte a una portada limpia de despacho.
  - "Cuando me preguntan si tengo web: *tengo Instagram*" → corte a la web de la peluquería.
  - "Llevo un año con la web 'casi terminada'" → rafaga de tres estilos en 9 s.
- **Escaparate**
  - La cola tal cual. Cuando haya casos reales: **antes / después**, el formato
    que según el PLAN se come a todo lo demás.

### Calendario de los 30 días

| Semana | Lunes · fija | Jueves · fija | Sábado · opcional |
| --- | --- | --- | --- |
| **0** (antes de empezar) | Bio, foto de perfil y 3 publicaciones fijadas (ver §2) | — | — |
| **1** | **Vídeo de marca** `IntroMaketa` (se fija) | #1 Turismo rural · `rafaga` | Educativo: "Lo único que tiene que decir tu portada" |
| **2** | #2 Obrador · `identidad` | #3 Peluquería · `portada` | Humor: "Tengo Instagram" |
| **3** | #4 Clínica dental · `escribir` | #5 Fisioterapia · `recorrido` | Educativo: "El botón de WhatsApp" |
| **4** | #6 Taller · `rafaga` | #7 Abogados · `identidad` | Humor: "Mi web la hizo mi cuñado" |
| **5** (días 29-30) | #8 Arquitectura · `portada` | — | Repaso del mes (ver "Qué medir") |

Los números son los de la cola de `scripts/social/` (`cd video && pnpm reels`
enseña el calendario). La pieza 9 y las siguientes ya
son del mes 2.

### Ganchos para los tres primeros segundos

El producto tiene una ventaja que no hay que desperdiciar: **el primer
fotograma ya puede ser un cambio**. Nada de intros, logos ni "hola, soy Carlos"
al principio. La marca va al final.

**Visuales (lo que se ve en el segundo 0):**

| Fórmula | Cómo se hace con el producto | Ejemplo |
| --- | --- | --- |
| **El corte en frío** | Arranca en mitad de un cambio de estilo, con `.destello()` entre estados | Taller mecánico: de neo-brutalismo a cristal en el segundo 0,5 |
| **El nombre propio** | La web ya lleva el nombre del negocio en el primer fotograma | "Estudio Vera" en grande, antes de que pase nada |
| **El dedo que toca** | Primer plano de un control justo antes de pulsarlo (`.camara()` entrando) | El selector de color a punto de cambiar |
| **La lista imposible** | Tres estilos en tres segundos (`rafaga`) | "La misma clínica, tres veces" |

**Rótulos (lo que se lee), con `.golpe()` para el impacto y `.rotulo()` para explicar:**

| Fórmula | Ejemplo |
| --- | --- |
| **Identidad directa** | "Si tienes una peluquería y no tienes web, mira esto." |
| **La confesión** | "Tu web la hizo tu cuñado en 2014. Lo sabemos." |
| **La pregunta que duele** | "¿Cuánto tiempo lleva tu web 'casi terminada'?" |
| **La prueba** | "Esta web se ha diseñado en lo que dura este vídeo." |
| **El contraste** | "Esto es lo que ve tu cliente. Esto es lo que podría ver." |

**Si algún día hay voz**, que sea la misma frase del rótulo y en los primeros
1,5 s. Los rótulos, a 430 px del borde inferior como mínimo, porque la interfaz
de Instagram tapa esa franja (`scripts/social/README.md`).

---

## 2 · El algoritmo y la conversión

### Biografía de Instagram

```
Nombre:   Maketa · Webs para negocios
Usuario:  @maketa.es

Diseña tu web tú mismo. Yo la construyo.
Pruébala en vivo, gratis y sin registro.
Para negocios y profesionales · Madrid
👇 Diseña la tuya
maketa.es
```

- **El campo "Nombre" cuenta para el buscador de Instagram**: por eso lleva
  "Webs para negocios" y no solo la marca.
- **"Gratis y sin registro"** está permitido en la fase 0: dice que probar no
  cuesta nada, no pone precio a un servicio. Es la misma línea que ya usa la landing.
- **Foto de perfil:** el logo del favicon sobre azul `#3b53d6`, que se lee
  bien en círculo pequeño.
- **Cuenta profesional** (categoría "Diseñador web"). Da acceso a las
  estadísticas y al botón de correo (hola@maketa.es).
- **Tres publicaciones fijadas**, en este orden: el vídeo de marca (qué es),
  un educativo "Cómo funciona en 3 pasos" (diseñas, me lo pides, te la
  entrego) y, en cuanto exista, el primer caso real.

**TikTok:** la misma bio, recortada a 80 caracteres ("Diseña tu web tú mismo.
Yo la construyo. Pruébala en maketa.es"). Puede que TikTok no deje poner
enlace clicable en la bio hasta tener cierto número de seguidores. Mientras
tanto, `maketa.es` va escrito en la bio y en el cierre de cada vídeo.

### El enlace de la bio

**Un solo enlace, a la landing (`maketa.es`), sin Linktree.**

- A la landing y no directamente al configurador: quien llega desde un reel
  tiene que leer primero "yo la construyo". Si aterriza en la herramienta,
  pensará que es un Wix más y se irá cuando descubra que no puede publicar él.
  El botón "Diseñar mi web" está a un toque.
- Sin Linktree, porque cada enlace más es una decisión más y el objetivo
  del mes es uno solo: que abran el configurador.
- **En las historias, la pegatina de enlace** apunta a lo mismo. Es la vía
  de conversión más directa que tiene una cuenta pequeña (ver el protocolo).

**Aviso sobre la medición.** Instagram y TikTok **no envían un referrer
fiable**, así que en Vercel Analytics esas visitas salen como tráfico directo
(PLAN, "Pendiente largo"). Si hace falta separarlas, la solución ya está hecha y
revertida en el commit `216d3e7`: un parámetro distinto en el enlace de cada red.
Mientras no se recupere, se usa como referencia el salto de visitas directas del
día de cada publicación.

### Protocolo tras publicar (los primeros 30 minutos)

**Antes de publicar (15 min):**
- [ ] Comentar de verdad (una frase con sentido, no un emoji) en 5-10
      publicaciones de negocios locales o de cuentas de pequeño comercio.
      Así la cuenta está activa y el algoritmo la asocia a ese público.
- [ ] Revisar el pie: el gancho en la primera línea y la llamada a la acción en la última.

**Al publicar:**
- [ ] **Portada** elegida a mano: un fotograma con la web entera y el nombre del
      negocio, nunca uno a medio cambio. Es lo que se ve en la cuadrícula.
- [ ] En Instagram, **"Compartir también en el feed"** activado.
- [ ] **Comentario propio fijado** con una pregunta: "¿Qué sector quieres ver el
      próximo?". Da una razón para comentar y alimenta la cola.

**Minutos 0-30:**
- [ ] **Responder a todos los comentarios**, con una pregunta de vuelta cuando
      tenga sentido: cada respuesta cuenta como conversación.
- [ ] **Compartir el reel en historias** y, en una segunda historia, la
      **pegatina de enlace** a maketa.es con un "Pruébalo con tu negocio".
- [ ] Enviarlo por privado a 2-3 personas a las que de verdad les interese (un
      conocido con negocio, no un grupo de "apoyo mutuo").
- [ ] **No** borrarlo ni volver a subirlo si arranca flojo: se penaliza y el
      reel puede despegar horas después.

**Lo que no se hace:** grupos de interacción, seguir para dejar de seguir,
comprar seguidores. Inflan números que no convierten y confunden al algoritmo
sobre quién es el público.

**A las 24 h:** anotar en la tabla de "Qué medir" la retención a los 3 s
(Instagram: tasa de omisión; TikTok: gráfica de retención), los guardados, los
compartidos y los toques en el enlace. El gancho se juzga por la retención; el
contenido, por los guardados.

### Crecimiento: cada web entregada, un escaparate

En Maketa el cliente no publica su web, así que el bucle viral no puede
salir de la gente que trastea. Tiene que salir de **las webs que entrego** y
de **los diseños que la gente comparte**. Hay tres palancas, de la más barata a
la más potente:

#### 1. El enlace compartido ya circula: que se note de dónde sale

Quien diseña algo casi siempre se lo enseña a alguien antes de decidir (el
socio, la pareja), con "Copiar enlace", y ese enlace (`preview.html`) llega
por WhatsApp con su tarjeta. Hoy quien lo recibe ve una web y ninguna
pista de dónde sale.

- **Propuesta:** una píldora discreta abajo, "Diseñada en maketa.es · Diseña la
  tuya", **solo** cuando `preview.html` se abre fuera del iframe, es decir,
  cuando es un enlace compartido y no el lienzo del configurador.
- No es un control nuevo ni toca el panel, así que no choca con la regla de
  panel mínimo.
- **Coste:** poco. Va en `src/preview/Preview.jsx`, la entrada del
  `preview.html`, que el scaffold **no** copia al `.zip`: la web entregada no
  la lleva. Se sabe si es un enlace compartido comprobando `window.parent === window`.

#### 2. "Web hecha con maketa.es" en las webs entregadas

- Una línea en el pie de la web entregada, enlazada a maketa.es.
  **Pactada con el cliente, nunca impuesta**: es su web. Se puede proponer
  como condición natural de las primeras webs a precio simbólico (PLAN,
  Bloqueos).
- Técnicamente va en el pie que genera el export (`FooterFull` / `FooterSlim`)
  como un campo de contenido que el estudio activa. El cliente no ve ningún control nuevo.
- Hacia fuera no se habla de ningún incentivo económico mientras dure la fase 0.

#### 3. El caso real, publicado a dos voces (la más potente)

- Cada web entregada se convierte en un **reel de antes / después** publicado
  como **colaboración de Instagram** con la cuenta del negocio: sale en los dos
  perfiles y llega a *sus* seguidores, que son justo el público local que interesa.
- El negocio tiene motivos para compartirlo (es su web nueva), así que la
  difusión le sale gratis a los dos.
- Con permiso del cliente, entra en la landing como "así quedó la web de X"
  (PLAN, P2 · 5).

**Orden recomendado:** primero la 1 (código, sin depender de nadie), luego la 3
en cuanto exista la primera web real, y la 2 como acuerdo con cada cliente.

---

## 3 · Guion de ejemplo: "La peluquera sin tiempo" (15 s)

Es para **la dueña sin web**. Se hace con la plantilla de reels
(`video/src/plantilla/`) sobre el negocio `peluqueria` (Estudio Vera, Málaga):
la columna de la derecha es lo que se escribe en `pantalla.cambios`. Va sin
audio: el sonido se añade en la app, a 120 bpm.

| Tiempo | Escena | Texto | En la plantilla |
| --- | --- | --- | --- |
| **0,0-3,0 s** | Gancho, fondo tinta | **"Tienes una peluquería y *no tienes tiempo*."** | `gancho` |
| **3,0-6,0 s** | La web de Estudio Vera entra; el titular "Sales con el pelo que pediste" se teclea | "Pon *tu frase*." | `{ desde: 25, hasta: 110, titular: true }` |
| **6,0-8,5 s** | El color de marca cambia tres veces, fundiéndose | "Tu color, *al momento*." | `{ frame, color }` ×3 |
| **8,5-11,0 s** | Cambio de portada | "Tú la diseñas. *Yo la construyo.*" | `{ frame, portada }` |
| **11,0-15,0 s** | Cierre de marca: maketa.es | — | `cierre` |

Por qué funciona:
- **En el segundo 0 ya hay un nombre propio y un cambio**, sin intro.
- **Se nombra al público** en la primera frase: quien no tiene peluquería
  se va, y quien la tiene se queda. Es lo que queremos.
- **"Lo ves en vivo"** es la promesa verificable del producto. "En minutos"
  no aparece, porque la web no la termina ella.
- **El cierre deja claro el modelo** ("yo la construyo") antes de mandar al enlace.

### Pie de foto (Instagram)

```
Tu web no tiene por qué ser un proyecto de meses. ✂️

Si tienes una peluquería (o cualquier negocio pequeño) y sigues sin web
porque no sabes por dónde empezar: empieza por verla.

En maketa.es eliges cómo se ve —colores, tipografía, secciones— y la ves
en vivo con el nombre de tu negocio. Cuando te guste, me la pides y yo la
construyo con tu contenido.

Pruébalo gratis y sin registro 👉 enlace en la bio

¿Qué sector quieres ver en el próximo vídeo? Te leo en comentarios.

#diseñoweb #peluqueria #pequeñocomercio #negociolocal #webparanegocios
```

### Pie de foto (TikTok)

```
Tu peluquería merece web y no tienes tiempo. Diséñala en vivo en maketa.es ✂️ #diseñoweb #peluqueria #negociolocal
```

**Sobre las etiquetas:** de 3 a 5, específicas y siempre en el mismo orden (el
oficio + el sector + el ámbito). Las genéricas con millones de publicaciones
(#marketing, #emprendedor) hunden la pieza entre cuentas que no son el
público. El generador ya las compone así: `#diseñoweb` + las del negocio +
`#pequeñocomercio`.

---

## Qué medir (cada domingo, 10 minutos)

| Número | Dónde | Qué dice | Señal de alarma |
| --- | --- | --- | --- |
| Retención a los 3 s | Estadísticas de IG / TikTok | Si el gancho funciona | Por debajo del 50 %: cambiar la fórmula de gancho |
| Guardados + compartidos | Estadísticas de IG | Si el contenido aporta | Cero en los educativos: el consejo es obvio |
| Visitas al perfil → toques en el enlace | Estadísticas de IG | Si la bio convierte | Muchas visitas y pocos toques: reescribir la bio |
| Visitas → abren el configurador | Vercel Analytics | Si la landing convence (PLAN, "Qué medir") | — |
| Abren → tocan un preset | Evento `preset_applied` | Si el producto engancha en móvil | — |
| Solicitudes | Google Sheet de leads | Lo único que paga | — |

**Al final del mes**, una sola pregunta: ¿qué pilar ha traído visitas a la
landing (no reproducciones)? El mes 2 se reparte según esa respuesta.

---

## Tareas que salen de este plan

- [ ] Bio, foto de perfil y cuenta profesional en Instagram y TikTok.
- [ ] Publicar el vídeo de marca (`video/out/intro-maketa.mp4`) y fijarlo.
- [ ] Hacer los cuatro opcionales (2 educativos, 2 de humor) con la plantilla
      de reels: copiando `video/src/plantilla/ejemplo.js` y cambiando
      gancho, frases y cambios, o como un formato nuevo en `formatos.mjs`.
- [ ] **Código:** la píldora "Diseñada en maketa.es" en el `preview.html`
      compartido (Crecimiento · 1).
- [ ] **Código:** el crédito opcional en el pie del export (Crecimiento · 2).
- [ ] Decidir si se recuperan los parámetros por red del commit `216d3e7`.
