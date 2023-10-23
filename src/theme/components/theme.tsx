import React, { PropsWithChildren, useEffect } from 'react'
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

  return <>{children}</>
}
