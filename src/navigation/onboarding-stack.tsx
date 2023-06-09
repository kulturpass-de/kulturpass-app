import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { OnboardingAboutAppRouteConfig } from '../features/onboarding/screens/onboarding-about-app-route'
import { OnboardingLocationPermissionRouteConfig } from '../features/onboarding/screens/onboarding-location-permission-route'
import { ModalStackWrapper } from './modal/modal-stack-wrapper'
import { OnboardingParamList } from './onboarding/types'

const Stack = createStackNavigator<OnboardingParamList>()

export const OnboardingStack = () => {
  return (
    <ModalStackWrapper>
      <StatusBar backgroundColor="#00000000" translucent barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen {...OnboardingAboutAppRouteConfig} />
        <Stack.Screen {...OnboardingLocationPermissionRouteConfig} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
