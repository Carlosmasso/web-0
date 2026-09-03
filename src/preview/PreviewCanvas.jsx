import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { resolveTheme, schemeOf } from '../theme/resolve'
import { ensureFonts } from '../theme/fonts'

// ============================================================
// MÓDULO 3 — EL LIENZO
//
// Único componente que conoce la configuración cosmética completa. Escribe las
// custom properties con setProperty sobre su nodo y NO pasa nada hacia abajo:
// los hijos leen var(--theme-*) desde CSS. Cambiar un color no reconcilia ni
// un nodo de React.
//
// Además expone la configuración como SELECTORES DE ATRIBUTO en el DOM
// (data-aesthetic, data-radius, data-shadow…). Eso permite que toda la
// cascada mute de golpe a nivel nativo: pasar de un dentista a un
// cyber-brutalismo es un recálculo de estilo, no un re-render del árbol.
// ============================================================

const StructureContext = createContext(null)

export function useStructure() {
  const ctx = useContext(StructureContext)
  if (!ctx) throw new Error('useStructure debe usarse dentro de <PreviewCanvas>')
  return ctx
}

/** Capa de aurora: manchas de luz desenfocadas a la deriva. */
function AuroraLayer() {
  return (
    <div className="pv-aurora" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  )
}

export function PreviewCanvas({ config, doc = document, children }) {
  const rootRef = useRef(null)

  const vars = useMemo(() => resolveTheme(config), [config])

  // useLayoutEffect: escribimos antes del pintado, así que nunca se ve un
  // fotograma con el tema anterior.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    for (const key in vars) el.style.setProperty(key, vars[key])
  }, [vars])

  useLayoutEffect(() => {
    ensureFonts([config.typography.headingFamily, config.typography.bodyFamily], doc)
  }, [config.typography.headingFamily, config.typography.bodyFamily, doc])

  // Las transiciones se activan DESPUÉS del primer pintado. Si no, la carga
  // inicial se ve como un desvanecido de colores en lugar de una página ya
  // puesta, que es exactamente el parpadeo que queremos evitar.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const id = requestAnimationFrame(() => {
      el.dataset.ready = 'true'
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const structureKey = JSON.stringify({
    a: config.aesthetic,
    m: config.motion,
    i: config.iconSet,
    s: config.sections,
    c: config.components,
  })
  const structure = useMemo(
    () => ({
      aesthetic: config.aesthetic,
      motion: config.motion,
      iconSet: config.iconSet,
      sections: config.sections,
      components: config.components,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [structureKey],
  )

  return (
    <StructureContext.Provider value={structure}>
      <div
        ref={rootRef}
        className="pv-canvas"
        /* Selectores de atributo: toda la cascada cuelga de aquí. */
        data-aesthetic={config.aesthetic}
        data-radius={config.borders.radius}
        data-border={config.borders.width}
        data-shadow={config.shadows.style}
        data-density={config.layout.density}
        data-scheme={schemeOf(config)}
        data-noise={config.effects.noise ? 'on' : 'off'}
        data-aurora={config.effects.aurora ? 'on' : 'off'}
        data-glass={config.effects.blur > 0 ? 'on' : 'off'}
        data-motion={config.motion}
      >
        {config.effects.aurora && <AuroraLayer />}
        {children}
      </div>
    </StructureContext.Provider>
  )
}
