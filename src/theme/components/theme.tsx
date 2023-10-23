import React, { PropsWithChildren, createContext, useEffect, useMemo } from 'react'
import { Appearance, StatusBar } from 'react-native'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import { useSelector } from 'react-redux'
import { store } from '../../app'
import { useColorScheme } from '../hooks/use-color-scheme'
import { getDarkThemePreviewEnabled, getForcedTheme } from '../redux/theme-selectors'
import { getTheme } from '../utils'

const initialTheme = getTheme(
  store.getState().theme.forcedTheme ?? Appearance.getColorScheme(),
  store.getState().theme.darkThemePreviewEnabled,
)

export const ThemeContext = createContext(initialTheme)

export const Theme: React.FC<PropsWithChildren> = ({ children }) => {
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
