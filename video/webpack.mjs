import fs from 'node:fs'
import path from 'node:path'

// ============================================================
// Ajustes de webpack que comparten `remotion studio`/`render`
// (remotion.config.js) y el script de publicación (publicar.mjs).
//
// 1. Una sola copia de React. Los componentes del sitio (`../src/preview/`)
//    resuelven `react` desde el node_modules de la raíz; con dos copias en el
//    mismo bundle los hooks revientan.
// 2. Imports sin extensión. La raíz declara `"type": "module"` y webpack exige
//    entonces `./defaults.js`; Vite no, y el código de la app no la lleva.
// ============================================================

export const crearWebpackOverride = (dirVideo) => {
  const deVideo = (paquete) => fs.realpathSync(path.join(dirVideo, 'node_modules', paquete))
  return (config) => ({
    ...config,
    module: {
      ...config.module,
      rules: [...(config.module?.rules ?? []), { test: /\.(m?js|jsx)$/, resolve: { fullySpecified: false } }],
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        react: deVideo('react'),
        'react-dom': deVideo('react-dom'),
      },
    },
  })
}
