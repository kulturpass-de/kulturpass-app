import { createContext, useContext } from 'react'

export type AlertContext = {
  dismiss: () => void
}

export const AlertContextImpl = createContext<AlertContext | undefined>(undefined)

export const useAlert = () => {
  const value = useContext(AlertContextImpl)
  return value
}
