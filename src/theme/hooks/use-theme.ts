import { useMemo } from 'react'
import { StatusBarStyle, useColorScheme } from 'react-native'
import { useSelector } from 'react-redux'
import { colorMappings as colorMappingsDark } from '../dark/color-mappings'
import { colorMappings as colorMappingsLight } from '../light/color-mappings'
import { getDarkThemePreviewEnabled, getForcedTheme } from '../redux/theme-selectors'
import { ColorMappings } from '../types'

export const useTheme = () => {
  const systemColorScheme = useColorScheme()

  const darkModePreviewEnabled = useSelector(getDarkThemePreviewEnabled)
  const forcedTheme = useSelector(getForcedTheme)

  const colorScheme: 'light' | 'dark' = useMemo(() => {
    if (!darkModePreviewEnabled) {
      return 'light'
    }

    if (forcedTheme !== null) {
      return forcedTheme
    }

    return systemColorScheme ?? 'light'
  }, [darkModePreviewEnabled, forcedTheme, systemColorScheme])

  const barStyle: StatusBarStyle = useMemo(() => {
    if (darkModePreviewEnabled) {
      return 'dark-content'
    }

    return colorScheme === 'dark' ? 'light-content' : 'dark-content'
  }, [colorScheme, darkModePreviewEnabled])

  const colors: ColorMappings = useMemo(() => {
    if (colorScheme === 'dark') {
      return colorMappingsDark
    } else {
      return colorMappingsLight
    }
  }, [colorScheme])

  return {
    colorScheme,
    barStyle,
    colors,
  }
}
