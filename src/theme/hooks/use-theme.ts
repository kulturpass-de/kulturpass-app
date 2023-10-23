import { useContext } from 'react'
import { ThemeContext } from '../components/theme'

export const useTheme = () => {
  return useContext(ThemeContext)
}
