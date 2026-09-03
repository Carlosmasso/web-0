import { createContext, useContext, useLayoutEffect, useMemo, useRef } from 'react'
import { resolveTheme, schemeOf } from '../theme/resolve'
import { ensureFonts } from '../theme/fonts'

// ============================================================
// EL LIENZO
//
// Único componente que conoce la configuración cosmética completa. Escribe las
// custom properties directamente sobre su nodo con setProperty y NO pasa nada
// hacia abajo: los hijos leen var(--theme-*) desde CSS.
//
// Consecuencia: cambiar un color no reconcilia ni un solo nodo de React. El
// trabajo es una llamada a setProperty por token más un recálculo de estilo
// del navegador.
// ============================================================

const StructureContext = createContext(null)

/** El canal estructural: lo único que los componentes necesitan en JavaScript. */
export function useStructure() {
  const ctx = useContext(StructureContext)
  if (!ctx) throw new Error('useStructure debe usarse dentro de <PreviewCanvas>')
  return ctx
}

export function PreviewCanvas({ config, doc = document, children }) {
  const rootRef = useRef(null)

  // Solo se recalcula cuando cambia algo cosmético.
  const vars = useMemo(() => resolveTheme(config), [config])

  // useLayoutEffect, no useEffect: escribimos antes del pintado, así que nunca
  // se ve un fotograma con el tema anterior.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    for (const key in vars) el.style.setProperty(key, vars[key])
  }, [vars])

  useLayoutEffect(() => {
    ensureFonts([config.typography.headingFamily, config.typography.bodyFamily], doc)
  }, [config.typography.headingFamily, config.typography.bodyFamily, doc])

  // Identidad estable mientras la estructura no cambie, para que un cambio de
  // paleta no invalide a ningún consumidor del contexto.
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
        data-aesthetic={config.aesthetic}
        data-density={config.layout.density}
        data-scheme={schemeOf(config)}
        data-noise={config.effects.noise ? 'on' : 'off'}
      >
        {children}
      </div>
    </StructureContext.Provider>
  )
}
