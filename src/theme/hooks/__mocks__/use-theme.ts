import { colorMappings } from '../../light/color-mappings'
import { ThemeValue } from '../../utils'

export const useTheme = (): ThemeValue => {
  return {
    colorScheme: 'light',
    colors: colorMappings,
  }
}
