import React from 'react'
import { createNavigationContainerRef, NavigationContainer as RNNNavigationContainer } from '@react-navigation/native'

import { AccountVerifiedAlertHandler } from '../features/registration/components/account-verified-alert/account-verified-alert-handler'
import { RootStackParams } from './types'
import { RootStackScreen } from './root-stack'

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
