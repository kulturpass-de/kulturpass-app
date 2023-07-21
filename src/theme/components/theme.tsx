import React, { PropsWithChildren, useEffect } from 'react'
import { StatusBar } from 'react-native'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import { useTheme } from '../hooks/use-theme'

export const Theme: React.FC<PropsWithChildren> = ({ children }) => {
  const { colorScheme, colors } = useTheme()

  useEffect(() => {
    SystemNavigationBar.setNavigationColor(
      colors.secondaryBackground,
      colorScheme === 'light' ? 'dark' : 'light',
      'both',
    )
  }, [colorScheme, colors.secondaryBackground])

  useEffect(() => {
    StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content')
  }, [colorScheme])

  return <>{children}</>
}
