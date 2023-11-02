import React, { PropsWithChildren, createContext, useEffect, useMemo } from 'react'
import { StatusBar } from 'react-native'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import { useSelector } from 'react-redux'
import { useColorScheme } from '../hooks/use-color-scheme'
import { getDarkThemePreviewEnabled, getForcedTheme } from '../redux/theme-selectors'
import { getTheme, ThemeValue } from '../utils'

export const ThemeContext = createContext<ThemeValue | null>(null)

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const systemColorScheme = useColorScheme()

  const darkModePreviewEnabled = useSelector(getDarkThemePreviewEnabled)
  const forcedTheme = useSelector(getForcedTheme)

  const providerValue = useMemo(
    () => getTheme(forcedTheme ?? systemColorScheme, darkModePreviewEnabled),
    [darkModePreviewEnabled, forcedTheme, systemColorScheme],
  )

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(
      providerValue.colors.secondaryBackground,
      providerValue.colorScheme === 'light' ? 'dark' : 'light',
      'both',
    )
  }, [providerValue.colorScheme, providerValue.colors.secondaryBackground])

  useEffect(() => {
    StatusBar.setBarStyle(providerValue.colorScheme === 'dark' ? 'light-content' : 'dark-content')
  }, [providerValue.colorScheme])

  return <ThemeContext.Provider value={providerValue}>{children}</ThemeContext.Provider>
}
