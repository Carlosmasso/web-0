/**
 * Google Apps Script — recibe los leads de /api/lead y los añade a esta hoja.
 *
 * MONTAJE (una vez):
 *  1. Crea una Google Sheet nueva.
 *  2. Extensiones → Apps Script. Borra lo que haya y pega ESTE archivo.
 *  3. Cambia TOKEN por un texto secreto largo (el mismo que pondrás en Vercel
 *     como LEAD_SHEET_TOKEN).
 *  4. Implementar → Nueva implementación → tipo "Aplicación web":
 *       - Ejecutar como: Yo
 *       - Quién tiene acceso: Cualquier usuario
 *     Copia la URL que termina en /exec.
 *  5. En Vercel, variables de entorno:
 *       LEAD_SHEET_URL   = esa URL /exec
 *       LEAD_SHEET_TOKEN = el mismo TOKEN
 */

const TOKEN = 'CAMBIA-ESTE-SECRETO-POR-UNO-LARGO'

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents)

    if (TOKEN && d.token !== TOKEN) {
      return out_({ ok: false, error: 'token' })
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Fecha',
        'Nombre',
        'Email',
        'Teléfono',
        'Negocio',
        'Enlace del diseño',
        'Nota',
        'Consentimiento',
        'Estado',
      ])
    }

    sheet.appendRow([
      d.fecha || new Date(),
      d.nombre || '',
      d.email || '',
      d.telefono || '',
      d.negocio || '',
      d.enlace || '',
      d.nota || '',
      d.consentimiento || '',
      'nuevo',
    ])

    return out_({ ok: true })
  } catch (err) {
    return out_({ ok: false, error: String(err) })
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
