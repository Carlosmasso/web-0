import JSZip from 'jszip'

/** Empaqueta el mapa {ruta: contenido} en un Blob .zip (sin descargar). */
export async function buildZipBlob(files, projectName) {
  const zip = new JSZip()
  const root = zip.folder(projectName)
  for (const [path, content] of Object.entries(files)) {
    root.file(path, content)
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  return { blob, filename: `${projectName}.zip` }
}

/** Empaqueta y dispara la descarga en el navegador. */
export async function downloadProjectZip(files, projectName) {
  const { blob, filename } = await buildZipBlob(files, projectName)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
