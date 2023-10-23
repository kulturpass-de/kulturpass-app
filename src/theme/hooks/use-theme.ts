import { useContext } from 'react'
import { ThemeContext } from '../components/theme'

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('ThemeContext used outside of ThemeProvider.')
  }

  return context
}
