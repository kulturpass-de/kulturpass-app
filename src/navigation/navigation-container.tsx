import { createNavigationContainerRef, NavigationContainer as RNNNavigationContainer } from '@react-navigation/native'
import React from 'react'
import { AccountVerifiedAlertHandler } from '../features/registration/components/account-verified-alert/account-verified-alert-handler'
import { EmailVerificationDeeplinkHandler } from '../features/registration/components/email-verification-deeplink-handler'
import { ErrorAlertProvider } from '../services/errors/error-alert-provider'
import { useTheme } from '../theme/hooks/use-theme'
import { RootStackScreen } from './root-stack'
import { RootStackParams } from './types'

export const rootNavigationRef = createNavigationContainerRef<RootStackParams>()

export const NavigationContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { colors, colorScheme } = useTheme()

  return (
    <RNNNavigationContainer
      theme={{
        dark: colorScheme === 'dark',
        colors: {
          primary: colors.primaryBackground,
          background: colors.primaryBackground,
          card: colors.secondaryBackground,
          text: colors.labelColor,
          border: colors.footerBorder,
          notification: colors.secondaryBackground,
        },
      }}
      ref={rootNavigationRef}>
      {children}
      <RootStackScreen />
      <AccountVerifiedAlertHandler />
      <ErrorAlertProvider />
      <EmailVerificationDeeplinkHandler />
    </RNNNavigationContainer>
  )
}
