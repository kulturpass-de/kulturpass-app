import { createNavigationContainerRef, NavigationContainer as RNNNavigationContainer } from '@react-navigation/native'
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { AccountVerifiedAlertHandler } from '../features/registration/components/account-verified-alert/account-verified-alert-handler'
import { ErrorAlertProvider } from '../services/errors/error-alert-provider'
import { useTheme } from '../theme/hooks/use-theme'
import { DeeplinkHandler } from './deeplink-handler'
import { RootStackScreen } from './root-stack'
import { RootStackParams } from './types'

export const rootNavigationRef = createNavigationContainerRef<RootStackParams>()

let resolveNavigationReady: () => void
export const rootNavigationRefReadyPromise = new Promise<void>(res => {
  resolveNavigationReady = res
})

export const NavigationContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { colors, colorScheme } = useTheme()

  const onReady = useCallback(() => {
    resolveNavigationReady()
  }, [])

  const customNavigationTheme = {
    ...NavigationDefaultTheme,
    dark: colorScheme === 'dark',
    colors: {
      ...NavigationDefaultTheme.colors,
      primary: colors.primaryBackground,
      background: colors.primaryBackground,
      card: colors.secondaryBackground,
      text: colors.labelColor,
      border: colors.footerBorder,
      notification: colors.secondaryBackground,
    },
  }

  return (
    <RNNNavigationContainer theme={customNavigationTheme} ref={rootNavigationRef} onReady={onReady}>
      {children}
      <RootStackScreen />
      <AccountVerifiedAlertHandler />
      <ErrorAlertProvider />
      <DeeplinkHandler />
    </RNNNavigationContainer>
  )
}
