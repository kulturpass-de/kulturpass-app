import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { EidAboutServiceProviderRouteConfig } from '../../features/eid-verification/screens/eid-about-service-provider-route'
import { EidAboutVerificationRouteConfig } from '../../features/eid-verification/screens/eid-about-verification-route'
import { EidCanRouteConfig } from '../../features/eid-verification/screens/eid-can-route'
import { EidChangePinCompletionRouteConfig } from '../../features/eid-verification/screens/eid-change-pin-completion-route'
import { EidInsertCardRouteConfig } from '../../features/eid-verification/screens/eid-insert-card-route'
import { EidNewPinRouteConfig } from '../../features/eid-verification/screens/eid-new-pin-route'
import { EidNFCNotSupportedRouteConfig } from '../../features/eid-verification/screens/eid-nfc-not-supported-route'
import { EidPinRouteConfig } from '../../features/eid-verification/screens/eid-pin-route'
import { EidPukInoperativeRouteConfig } from '../../features/eid-verification/screens/eid-puk-inoperative-route'
import { EidPukRouteConfig } from '../../features/eid-verification/screens/eid-puk-route'
import { EidServiceProviderDetailsRouteConfig } from '../../features/eid-verification/screens/eid-service-provider-details-route'
import { EidTransportPinRouteConfig } from '../../features/eid-verification/screens/eid-transport-pin-route'
import { EidVerificationCompletionRouteConfig } from '../../features/eid-verification/screens/eid-verification-completion-route'
import { ModalStackWrapper } from '../modal/modal-stack-wrapper'
import { EidParamList } from './types'

const Stack = createStackNavigator<EidParamList>()

export const EidStack = () => {
  return (
    <ModalStackWrapper>
      <StatusBar backgroundColor="#00000000" translucent />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Group screenOptions={{ gestureEnabled: false, detachPreviousScreen: true }}>
          <Stack.Screen {...EidAboutVerificationRouteConfig} />
          <Stack.Screen {...EidAboutServiceProviderRouteConfig} />
          <Stack.Screen {...EidInsertCardRouteConfig} />
          <Stack.Screen {...EidPinRouteConfig} />
          <Stack.Screen {...EidCanRouteConfig} />
          <Stack.Screen {...EidPukRouteConfig} />
          <Stack.Screen {...EidTransportPinRouteConfig} />
          <Stack.Screen {...EidNewPinRouteConfig} />
          <Stack.Screen {...EidVerificationCompletionRouteConfig} />
          <Stack.Screen {...EidChangePinCompletionRouteConfig} />
          <Stack.Screen {...EidNFCNotSupportedRouteConfig} />
          <Stack.Screen {...EidPukInoperativeRouteConfig} />
        </Stack.Group>
        <Stack.Screen {...EidServiceProviderDetailsRouteConfig} options={{ gestureEnabled: true }} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
