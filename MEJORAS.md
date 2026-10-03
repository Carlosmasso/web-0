# Mejoras de producto a medio plazo

El banco de ideas para después de lo que ya está en `PLAN.md`. **PLAN manda**:
cuando una de estas se prioriza, pasa allí y se tacha aquí.

## Criterio

El configurador va por delante del sector; no es el cuello de botella. Lo que
falta es **pasar de "me gusta" a "encárgamela"** y que **"yo la construyo"
escale** cuando haya demanda. Las mejoras se ordenan por eso.

Cada idea pasa tres filtros:

1. ¿Acerca un lead o acelera una entrega?
2. ¿Respeta "Lo que NO hacemos" (`PLAN.md`)?
3. ¿Se puede hacer en la fase 0, o depende del alta y de tener precio?

Esfuerzo: **S** (un día o menos), **M** (unos días), **L** (una semana o más,
o con dependencias externas).

---

## A · Del "me gusta" al "encárgamela"

**1. Guardar por correo.** Ya es P1·3 en `PLAN.md`: quien juega y no está
listo para escribir se pierde para siempre. Es la primera de la lista.

**2. Abrir el diseño en tu móvil con un QR** · S · fase 0
Desde el ordenador, un QR con el enlace `?c=` del diseño para verlo en el
propio teléfono. Es el "wow" más barato: ver tu web en tu móvil. Reutiliza el
enlace que ya existe (`src/config/encode.js`).

**3. "Háblalo conmigo por WhatsApp"** · S · fase 0
Junto a "Quiero esta web", un enlace `wa.me` con el enlace del diseño ya
escrito en el mensaje. El dueño de un negocio local escribe antes por WhatsApp
que por un formulario. Se registra como un lead más.

**4. Tres preguntas al pedirla** · S · fase 0
En `src/configurator/ContactModal.jsx`: sector, para cuándo la necesita y si ya
tiene dominio. Ahorra la primera ronda de correos y cualifica el lead. No es un
control de diseño: es el formulario de contacto.

**5. Vista previa rica al compartir** · M · tras el alta
Cuando alguien manda su enlace por WhatsApp, que se vea una imagen de **su**
web (og:image generada, por ejemplo con Vercel OG) en vez de la genérica. Cada
diseño compartido se convierte en un anuncio de Maketa.

**6. La píldora "Diseñada en maketa.es"** en el preview compartido. Ya está en
DIFUSION (Crecimiento · 1). Es el bucle de crecimiento más directo.

---

## B · El contenido, que es donde se atasca un negocio pequeño

**7. Asistente de textos** · M
Tres preguntas (qué haces, dónde, para quién) y una propuesta de titular,
entradilla y servicios en tono cercano, todo editable. Resuelve la página en
blanco sin añadir controles de diseño. Reglas: nada inventado (ni cifras ni
reseñas) y el usuario lo revisa todo. Un endpoint en `api/`, como
`api/lead.js`.

**8. Buscador de fotos de Pexels en la pestaña Contenido** · M · explorar
Buscar "peluquería" y elegir es más rápido que pegar URLs, y respeta la regla
de enlazar Pexels sin descargar. Las fotos propias ya se comprimen
(`src/content/image.js`).

**9. "Lo que falta para que la construya"** · S · fase 0
Convertir `src/content/checklist.js` en un progreso visible: "te faltan el
horario y dos fotos". A Carlos le llega un contenido más completo y hay menos
idas y venidas.

**10. Rellenar desde la ficha de Google** · L · explorar
Pegar el enlace de Google Maps y traer nombre, dirección, horario y teléfono.
Mucho valor, pero depende de la API de Google: primero, validar si compensa.

---

## C · Que "yo la construyo" escale

**11. Brief automático de cada lead** · S/M
Al llegar una solicitud, un documento con el enlace del diseño, el contenido,
lo que falta (del checklist) y el sector. Carlos presupuesta en minutos. Se
apoya en `api/lead.js` y en la Sheet de leads.

**12. Del `.zip` a publicada con un comando** · M · tras el alta
Un script de estudio que toma el proyecto exportado (`src/export/scaffold.js`),
lo despliega en Vercel y deja la lista de pasos del dominio. Una entrega
repetible y rápida es lo que permite atender a más clientes.

**13. Comentarios del cliente sobre su web** · M · tras el alta
Antes de construirla, que el cliente marque "esto cámbialo" sobre cada sección
del enlace compartido. Sustituye los correos con capturas.

---

## D · Confianza y prueba social

**14. Casos reales.** Ya es P2·5 en `PLAN.md`: la prueba social que más decide.

**15. Empieza desde una web real** · M · con clientes
Las webs de clientes reales (con su permiso) como puntos de partida del
configurador, junto a los presets de sector. Es prueba social dentro del
producto y no añade controles: son presets.

**16. Sello de calidad visible** · S · fase 0
"Contraste accesible ✓ · Pensada para móvil ✓ · Carga rápida ✓" junto a la
vista previa. Los guardarraíles ya lo garantizan (`src/config/guardrails.js`,
WCAG); hoy es invisible, y es un argumento frente a "me la hace mi sobrino".

---

## E · Que te encuentren

**17. Landings por sector** · M · tras el alta
`maketa.es/peluquerias`, `/clinicas`… que abren el configurador con el preset y
el contenido de ese sector ya cargados (`src/content/sectores.js`). Sirven para
el SEO local y serán la página de destino de los anuncios cuando lleguen.

**18. Las guías de los carruseles, como artículos** · S/M
Los 29 carruseles escritos (`video/contenido/ideas.json`) ya son contenido
útil. Publicados como guías en maketa.es ("Antes de firmar tu web, comprueba
estas 7 cosas") traen tráfico de búsqueda con un trabajo que ya está hecho.

---

## F · Saber qué funciona

**19. El origen de cada lead** · S · fase 0
Instagram y TikTok no envían referrer (ver los UTM en `PLAN.md`). Sin UTM:
enlaces cortos por canal (`maketa.es/ig`, `/tt`, `/in`) que guardan el origen,
y un "¿Cómo me conociste?" opcional en el formulario. Así se sabe qué red trae
clientes, no solo visitas.

**20. El embudo, por dispositivo y por origen** · S
Los eventos ya existen (`src/config/analytics.js`). Falta cruzarlos con el
origen del punto 19 en la revisión semanal de "Qué medir".

---

## G · Después de la entrega

**21. Cambios pequeños sin fricción** · M · con clientes
Que el cliente pida "cambia el horario" desde su propio diseño en el
configurador y a Carlos le llegue el cambio listo para publicar. No es
autoservicio: publica Carlos.

**22. Un resumen mensual para el cliente** · M · con clientes
Visitas y contactos de su web, en un correo. Da motivos para seguir en
contacto y, más adelante, para ofrecer mantenimiento. Depende del alta y de
decidir si habrá esa línea de negocio.

---

## H · Contenido para redes

**23. Plantilla "caso real" en el motor de reels** · M · con clientes
La web de un cliente de verdad: antes (su web vieja o nada) y después. Es el
reel que más convierte, y se hace con el motor que ya existe
(`video/src/motor/`).

---

## Priorización

| Cuándo | Mejoras | Por qué ahí |
| --- | --- | --- |
| **Ahora** (fase 0, sin coste) | 2 QR · 3 WhatsApp · 4 tres preguntas · 9 lo que falta · 16 sello · 19 origen | Más leads y mejores, sin dinero ni alta |
| **El mes siguiente** | 1 guardar por correo · 7 asistente de textos · 11 brief · 18 guías | Quitan fricción al cliente y a Carlos |
| **Tras el alta** | 5 vista previa rica · 12 publicar con un comando · 13 comentarios · 17 landings por sector | Preparan la entrega a volumen y los anuncios |
| **Con clientes** | 14 casos · 15 webs reales como punto de partida · 21 cambios · 22 resumen · 23 reel de caso | Necesitan clientes reales |
| **Explorar** | 8 buscador de Pexels · 10 ficha de Google | Mucho valor, pero coste o dependencia por validar |

---

## Lo que se descarta a propósito

Coherente con "Lo que NO hacemos" (`PLAN.md`):

- **Más opciones de diseño en el panel.** Ya hay más de las que un cliente
  necesita para decidir. Las mejoras de arriba tocan contenido, contacto y
  entrega, no controles.
- **Que el cliente se descargue su web.** Cambia el modelo de negocio y quita
  lo que diferencia: que la construye Carlos.
- **Más estéticas, o pulir las que hay.** Lo que no convierte no es el
  glassmorfismo.
- **Audios de moda en redes.** El activo es el producto transformándose.
- **Webs de varias páginas.** Las webs son de una sola página, y así se venden.
