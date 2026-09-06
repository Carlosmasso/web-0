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

## 4. Comprobar

1. Abre la web desplegada, diseña algo, pulsa **Pedir presupuesto**, marca el
   consentimiento y envía.
2. Debe aparecer una fila en la Sheet, llegarte el correo con el `.zip`, y al
   cliente (el email que pusiste) un "recibido".
3. Si algo falla, el modal muestra un `mailto:` de reserva y en la consola del
   navegador hay pistas.

En local (`npm run dev`) la función `/api/lead` no corre. Usa `npx vercel dev`
o prueba en una *preview deployment*.

---

## Legal — a completar antes de cobrar

Rellena los `[[ CARLOS: … ]]` en:

- [`public/aviso-legal.html`](public/aviso-legal.html) — nombre, NIF, dirección, localidad.
- [`public/privacidad.html`](public/privacidad.html) — lo mismo + proveedor de correo + plazo de conservación.
- [`public/cookies.html`](public/cookies.html) — fecha; revisar si añades analítica.

No es asesoramiento legal; si puedes, que lo revise un gestor.

## Pendiente antes de lanzar (ver revisión)

- Nombre de producto + dominio + favicon + meta OG.
- Landing con precio visible.
- Analítica (Plausible/Umami).
- Tests del núcleo (`npm i -D vitest`).
