# Puesta en marcha para producción

Lo que hay que montar una vez para que el botón "Pedir presupuesto" funcione y los
leads no se pierdan. Todo es gratis para empezar.

---

## 1. Google Sheet (registro de solicitudes)

1. Crea una Google Sheet nueva. Ponle nombre, p. ej. *Leads Estudio*.
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
     `"Estudio <hola@tudominio.com>"`.

## 3. Variables de entorno en Vercel

Proyecto en Vercel → **Settings → Environment Variables** (para *Production* y
*Preview*). Lista en [`.env.example`](.env.example):

| Variable | Valor |
| --- | --- |
| `LEAD_SHEET_URL` | la URL `/exec` del paso 1.5 |
| `LEAD_SHEET_TOKEN` | el `TOKEN` del paso 1.3 |
| `RESEND_API_KEY` | la clave del paso 2.2 |
| `LEAD_FROM_EMAIL` | `onboarding@resend.dev` o `"Estudio <hola@tudominio.com>"` |
| `LEAD_TO_EMAIL` | tu correo, donde quieres los avisos |

Redeploy después de añadirlas.

## 4. Analítica

En Vercel → pestaña **Analytics** → **Enable**. El script ya está en `index.html`
y `app.html` (`/_vercel/insights/script.js`), sin cookies ni banner. Verás
páginas vistas y de dónde llega la gente.

## 5. Comprobar (hazlo ANTES de compartir el enlace)

1. Abre la web desplegada, diseña algo, pulsa **Pedir presupuesto**, marca el
   consentimiento y envía.
2. Debe aparecer una **fila en la Sheet** (canal fiable), llegarte el **correo**
   con el `.zip` adjunto, y al email de prueba una **confirmación**.
   - Con `onboarding@resend.dev` los correos pueden ir a spam: revisa esa
     carpeta y marca "no es spam". La Sheet no falla.
3. Si el modal muestra error: falta alguna variable de entorno o no has
   redesplegado. La consola del navegador da pistas.

En local (`npm run dev`) la función `/api/lead` no corre. Usa `npx vercel dev`
o prueba en el deploy.

## 6. Móvil

Abre la web en el teléfono: la landing debe verse bien; el configurador es más
justo en móvil. Si no cuela, decidir si se hace usable o se muestra un aviso
"mejor desde ordenador".

---

## Legal — hecho para fase 0

`aviso-legal.html`, `privacidad.html` y `cookies.html` ya llevan tus datos como
persona física. Cuando te des de alta como autónomo: añadir NIF y domicilio, y
revisar el aviso legal con un gestor.

## Pendiente (cuando haya tracción)

- Dominio propio (`.es` ~10 €/año) apuntando a Vercel → hace el test real para
  leads y permite verificar el dominio en Resend (mejor entregabilidad).
- Nombre definitivo del producto (ahora "Estudio" de placeholder).
- `og.png` (1200×630) para la tarjeta al compartir el enlace.
- Pasada de móvil en el configurador.
