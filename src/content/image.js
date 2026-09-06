// ============================================================
// SUBIR IMÁGENES SIN BACKEND
//
// El cliente elige una foto de su disco; se redimensiona y comprime en el
// navegador a un data URI. Ese string viaja igual que una URL: se guarda en el
// contenido, entra en el enlace y llega dentro del .zip. No hay servidor.
//
// Límite práctico: localStorage ronda los 5 MB, así que las imágenes se bajan
// a MAX_DIM en el lado largo y calidad 0.8. Un original de 6 000 px acaba en
// ~200-400 KB.
// ============================================================

const MAX_SOURCE_BYTES = 12 * 1024 * 1024
const MAX_DIM = 1400
const QUALITY = 0.8

/**
 * @param {File} file
 * @returns {Promise<string>} data URI listo para `<img src>`
 */
export async function fileToDataUrl(file) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Eso no parece una imagen.')
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('La imagen pesa más de 12 MB. Prueba con una más ligera.')
  }

  const source = await loadImage(file)
  const w = source.width || source.naturalWidth
  const h = source.height || source.naturalHeight
  const scale = Math.min(1, MAX_DIM / Math.max(w, h))

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(w * scale))
  canvas.height = Math.max(1, Math.round(h * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('El navegador no pudo procesar la imagen.')
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  source.close?.()

  // WebP comprime mejor; si el navegador no lo soporta, devuelve un PNG y se
  // cae a JPEG.
  let url = canvas.toDataURL('image/webp', QUALITY)
  if (!url.startsWith('data:image/webp')) {
    url = canvas.toDataURL('image/jpeg', QUALITY)
  }
  return url
}

async function loadImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file)
    } catch {
      /* algunos formatos fallan aquí; se prueba con <img> */
    }
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.readAsDataURL(file)
  })
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo abrir la imagen.'))
    img.src = dataUrl
  })
}
