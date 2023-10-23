import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { OnboardingAboutAppRouteConfig } from '../screens/app/onboarding/onboarding-about-app-route'
import { OnboardingLocationPermissionRouteConfig } from '../screens/app/onboarding/onboarding-location-permission-route'
import { OnboardingNotificationPermissionRouteConfig } from '../screens/app/onboarding/onboarding-notification-permission-route'
import { ModalStackWrapper } from './modal/modal-stack-wrapper'
import { OnboardingParamList } from './onboarding/types'

const Stack = createStackNavigator<OnboardingParamList>()

export const OnboardingStack = () => {
  return (
    <ModalStackWrapper>
      <StatusBar backgroundColor="#00000000" translucent />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen {...OnboardingAboutAppRouteConfig} />
        <Stack.Screen {...OnboardingLocationPermissionRouteConfig} />
        <Stack.Screen {...OnboardingNotificationPermissionRouteConfig} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
