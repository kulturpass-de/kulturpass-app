import { createNavigationContainerRef, NavigationContainer as RNNNavigationContainer } from '@react-navigation/native'
import React from 'react'
import { AccountVerifiedAlertHandler } from '../features/registration/components/account-verified-alert/account-verified-alert-handler'
import { RootStackScreen } from './root-stack'
import { RootStackParams } from './types'

export const rootNavigationRef = createNavigationContainerRef<RootStackParams>()

export const NavigationContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <RNNNavigationContainer ref={rootNavigationRef}>
      {children}
      <RootStackScreen />
      <AccountVerifiedAlertHandler />
    </RNNNavigationContainer>
  )
}
