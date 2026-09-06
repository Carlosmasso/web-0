import { useCallback, useRef, useState } from 'react'

// Historial de un solo valor (aquí, la configuración de diseño). El contenido
// no entra: se edita en un formulario y ahí el deshacer nativo del campo ya
// funciona. Lo que este historial protege son las acciones destructivas de un
// clic — Sorpréndeme, reiniciar, cambiar de preset — que si no no tienen vuelta.

const HISTORY_MAX = 60

// Cambios encadenados en menos de este margen (arrastrar un deslizador) cuentan
// como un solo paso: deshacer te devuelve a antes del arrastre, no píxel a píxel.
const COALESCE_MS = 400

/** @param {T | (() => T)} initial */
export function useHistory(initial) {
  const [hist, setHist] = useState(() => ({
    past: [],
    present: typeof initial === 'function' ? initial() : initial,
    future: [],
  }))
  const lastPush = useRef(0)

  const set = useCallback((next) => {
    const now = Date.now()
    const coalesce = now - lastPush.current < COALESCE_MS
    lastPush.current = now
    setHist((h) => {
      const value = typeof next === 'function' ? next(h.present) : next
      if (Object.is(value, h.present)) return h
      const past =
        coalesce && h.past.length ? h.past : [...h.past, h.present].slice(-HISTORY_MAX)
      return { past, present: value, future: [] }
    })
  }, [])

  const undo = useCallback(() => {
    lastPush.current = 0
    setHist((h) => {
      if (!h.past.length) return h
      return {
        past: h.past.slice(0, -1),
        present: h.past[h.past.length - 1],
        future: [h.present, ...h.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    lastPush.current = 0
    setHist((h) => {
      if (!h.future.length) return h
      return {
        past: [...h.past, h.present],
        present: h.future[0],
        future: h.future.slice(1),
      }
    })
  }, [])

  // Reemplaza el valor y vacía el historial. Para cuando cambias de proyecto:
  // no tiene sentido deshacer de un proyecto al anterior.
  const reset = useCallback((value) => {
    lastPush.current = 0
    setHist({ past: [], present: typeof value === 'function' ? value() : value, future: [] })
  }, [])

  return {
    state: hist.present,
    set,
    reset,
    undo,
    redo,
    canUndo: hist.past.length > 0,
    canRedo: hist.future.length > 0,
  }
}
