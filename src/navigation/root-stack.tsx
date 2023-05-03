import React from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import { Tabs } from './tabs/tabs'
import { ModalStack } from './modal/modal-stack'
import { ModalStackCardOverlay } from './modal/modal-stack-card-overlay'
import { RootStackParams } from './types'
import { RootState } from '../services/redux/configure-store'

const Stack = createStackNavigator<RootStackParams>()

export const RootStackScreen: React.FC = () => {
  const showOnboardingOnStartup = useSelector((state: RootState) => state.persisted.onboarding.showOnboardingOnStartup)

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle={'dark-content'} />
      <Stack.Navigator
        initialRouteName={showOnboardingOnStartup ? 'Modal' : 'Tabs'}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="Modal"
          component={ModalStack}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            cardOverlay: ModalStackCardOverlay,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
      </Stack.Navigator>
    </>
  )
}
