import React from 'react'
import { createNavigationContainerRef, NavigationContainer as RNNNavigationContainer } from '@react-navigation/native'

import { RootStackParams } from './types'
import { RootStackScreen } from './root-stack'

export const rootNavigationRef = createNavigationContainerRef<RootStackParams>()

export const NavigationContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <RNNNavigationContainer ref={rootNavigationRef}>
      {children}
      <RootStackScreen />
    </RNNNavigationContainer>
  )
}
