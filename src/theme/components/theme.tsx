import React, { PropsWithChildren, useEffect } from 'react'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import { useTheme } from '../hooks/use-theme'

export const Theme: React.FC<PropsWithChildren> = ({ children }) => {
  const { colorScheme } = useTheme()

  useEffect(() => {
    SystemNavigationBar.setNavigationColor('#00000000', colorScheme, 'both')
  }, [colorScheme])

  return <>{children}</>
}
