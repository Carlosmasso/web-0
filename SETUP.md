# Puesta en marcha para producción

Lo que hay que montar una vez para que el botón "Pedir presupuesto" funcione y los
leads no se pierdan. Todo es gratis para empezar.

---

## 1. Google Sheet (registro de solicitudes)

1. Crea una Google Sheet nueva. Ponle nombre, p. ej. *Leads Maqueta*.
2. **Extensiones → Apps Script**. Borra el código de ejemplo y pega el contenido
   de [`apps-script/lead-sheet.gs`](apps-script/lead-sheet.gs).
3. Cambia `TOKEN` por un texto secreto largo (genera uno cualquiera). Anótalo.
4. **Implementar → Nueva implementación**, tipo **Aplicación web**:
   - *Ejecutar como*: Yo
   - *Quién tiene acceso*: Cualquier usuario
5. Copia la **URL** que acaba en `/exec`.

## 2. Resend (envío de correos)

1. Crea cuenta en <https://resend.com> (gratis, 3000 correos/mes).
2. **API Keys → Create** → copia la clave (`re_...`).
3. Remitente:
   - Para **probar ya**: usa `onboarding@resend.dev` como `LEAD_FROM_EMAIL`.
   - Para **producción**: **Domains → Add Domain**, añade tu dominio y los
     registros DNS que te da. Cuando esté *verified*, usa
     `"Maqueta <hola@tudominio.com>"`.

## 3. Variables de entorno en Vercel

Proyecto en Vercel → **Settings → Environment Variables** (para *Production* y
*Preview*). Lista en [`.env.example`](.env.example):

| Variable | Valor |
| --- | --- |
| `LEAD_SHEET_URL` | la URL `/exec` del paso 1.5 |
| `LEAD_SHEET_TOKEN` | el `TOKEN` del paso 1.3 |
| `RESEND_API_KEY` | la clave del paso 2.2 |
| `LEAD_FROM_EMAIL` | `onboarding@resend.dev` o `"Maqueta <hola@tudominio.com>"` |
| `LEAD_TO_EMAIL` | tu correo, donde quieres los avisos |
| `REACT_STUDIO_KEY` | texto largo aleatorio; hará falta `?studio=<esa-clave>` para el modo estudio |

Redeploy después de añadirlas. `REACT_STUDIO_KEY` es de *build*: si la cambias, hay que
volver a desplegar para que entre en el bundle. **Mientras no esté puesta, el modo estudio
no se puede abrir en el deploy** (solo en local) — así un cliente no lo activa por accidente.

Si ya tenías una Sheet de antes: se añadió la columna **"Imágenes (pídelas)"**. O borras
las filas para que regenere la cabecera, o añades tú la columna en la posición 7 (tras "Nota").

## 4. Analítica

En Vercel → pestaña **Analytics** → **Enable**. El script ya está en `index.html`
y `app.html` (`/_vercel/insights/script.js`), sin cookies ni banner. Verás
páginas vistas y de dónde llega la gente.

El configurador manda además cuatro eventos de embudo (solo en modo cliente):
`configurator_opened` → `preset_applied` → `contact_opened` → `lead_submitted`.
Con eso ves en qué paso se cae la gente. En Analytics aparecen bajo **Events**.

## 5. Comprobar (hazlo ANTES de compartir el enlace)

1. Abre la web desplegada, diseña algo, pulsa **Pedir presupuesto**, marca el
   consentimiento y envía.
2. Debe aparecer una **fila en la Sheet** (canal fiable: fecha, contacto, si
   subió imágenes, enlace del diseño, enlace para regenerar, contenido) y
   llegarte un **correo** de aviso, corto y en texto plano.
   - El `.zip` **no** va por correo. Se descarga desde el preview de ese diseño:
     abre la columna **"Descargar proyecto (tú)"** (un enlace `preview.html?studio=…`)
     y pulsa **⬇ Descargar proyecto (.zip)** abajo a la derecha.
   - Las **imágenes que sube el cliente no viajan** en el enlace. La columna
     "Imágenes (pídelas)" y el correo te dicen qué secciones traían fotos; se
     las pides al cliente al responderle con el presupuesto.
   - Con `onboarding@resend.dev` el correo puede ir a spam: revísalo y marca
     "no es spam". La confirmación al cliente solo se envía si su email coincide
     con el de tu cuenta de Resend; si no, falla en silencio y no pasa nada.
3. Si el modal muestra error: falta una variable o no has redesplegado. Mira
   Vercel → deployment → **Functions** → logs de `/api/lead`.
4. **Anti-spam**: el endpoint descarta envíos con el campo trampa relleno o
   hechos en menos de 2,5 s (bots). A un bot le responde "ok" pero no registra
   nada — así que si pruebas muy rápido, espera unos segundos antes de enviar.

En local (`npm run dev`) la función `/api/lead` no corre. Usa `npx vercel dev`
o prueba en el deploy.

### Modo estudio en el deploy

En local es automático. En la versión desplegada necesitas
`https://…/app.html?studio=<REACT_STUDIO_KEY>` con la clave **exacta** para ver el
panel de proyectos y el botón de descargar el `.zip`. Si `REACT_STUDIO_KEY` no está
configurada, el modo estudio no se abre en el deploy de ninguna forma (trabaja en
local). La clave viaja en el bundle JS: es para que un cliente no lo active sin
querer, no un candado.

## 6. Móvil

Abre la web en el teléfono: la landing debe verse bien; el configurador es más
justo en móvil. Si no cuela, decidir si se hace usable o se muestra un aviso
"mejor desde ordenador".

---

## Legal — hecho para fase 0

`aviso-legal.html`, `privacidad.html` y `cookies.html` ya llevan tus datos como
persona física. Cuando te des de alta como autónomo: añadir NIF y domicilio, y
revisar el aviso legal con un gestor.

## Antes de fiarte de una entrega

`npm run verify:export` genera un proyecto desde un preset, hace `npm install` y
`vite build` en un temporal, y comprueba que sale `dist/`. Tarda ~40 s (baja
dependencias). Hazlo tras tocar cualquier componente de `src/preview/`.

## Pendiente (cuando haya tracción)

- Dominio propio (`.es` ~10 €/año) apuntando a Vercel → hace el test real para
  leads y permite verificar el dominio en Resend (mejor entregabilidad). Sin
  esto, la confirmación por correo al cliente NO le llega (Resend sin dominio
  solo envía a tu propia cuenta).
- `og.png` (1200×630) para la tarjeta al compartir el enlace — captura de `og.html`.
- Subir las imágenes del cliente a un bucket (Vercel Blob) al enviar el lead, en
  vez de solo listar qué secciones traían fotos.
- Pasada de móvil en el configurador.
