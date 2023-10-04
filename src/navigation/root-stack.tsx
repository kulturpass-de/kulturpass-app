import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'
import { getShowOnboardingOnStartup } from '../features/onboarding/redux/onboarding-selectors'
import { useGetProfile } from '../services/user/use-get-profile'
import { EidStack } from './eid/eid-stack'
import { ModalStack } from './modal/modal-stack'
import { ModalStackCardOverlay } from './modal/modal-stack-card-overlay'
import { OnboardingStack } from './onboarding-stack'
import { PdpStack } from './pdp/pdp-stack'
import { Tabs } from './tabs/tabs'
import { OnboardingStackParams, RootStackParams } from './types'

const Stack = createStackNavigator<RootStackParams & OnboardingStackParams>()

export const RootStackScreen: React.FC = () => {
  const showOnboardingOnStartup = useSelector(getShowOnboardingOnStartup)
  const { data: profile } = useGetProfile()

  if (showOnboardingOnStartup) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} detachInactiveScreens={true}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingStack}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            cardOverlay: ModalStackCardOverlay,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
      </Stack.Navigator>
    )
  }

  return (
    <>
      <StatusBar backgroundColor="#00000000" translucent />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        <Stack.Screen
          name="PDP"
          component={PdpStack}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            cardOverlay: ModalStackCardOverlay,
            cardOverlayEnabled: true,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        {profile?.identificationStatus === 'NOT_VERIFIED' && (
          <Stack.Screen
            name="Eid"
            component={EidStack}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              cardOverlay: ModalStackCardOverlay,
              cardOverlayEnabled: true,
              ...TransitionPresets.ModalSlideFromBottomIOS,
            }}
          />
        )}
      </Stack.Navigator>
    </>
  )
}
