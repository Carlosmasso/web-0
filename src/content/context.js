import { createContext, useContext } from 'react'
import { DEFAULT_CONTENT } from './defaults'

export const ContentContext = createContext(DEFAULT_CONTENT)

export function useContent() {
  return useContext(ContentContext)
}
