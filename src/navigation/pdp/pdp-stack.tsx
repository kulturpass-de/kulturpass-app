import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { OfferSelectionFilterRouteConfig } from '../../features/product-detail/screens/offer-selection-filter-route'
import { OfferSelectionRouteConfig } from '../../features/product-detail/screens/offer-selection-route'
import { ProductConfirmReservationRouteConfig } from '../../features/product-detail/screens/product-confirm-reservation-route'
import { ProductDetailRouteConfig } from '../../features/product-detail/screens/product-detail-route'
import { ReservationDetailRouteConfig } from '../../features/reservations/screens/reservation-detail-route'
import { ModalStackWrapper } from '../modal/modal-stack-wrapper'
import { PdpParamList } from './types'

const Stack = createStackNavigator<PdpParamList>()

export const PdpStack = () => {
  return (
    <ModalStackWrapper>
      <StatusBar backgroundColor="#00000000" translucent />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <Stack.Screen {...ProductDetailRouteConfig} />
        <Stack.Screen {...OfferSelectionRouteConfig} />
        <Stack.Screen {...OfferSelectionFilterRouteConfig} />
        <Stack.Screen {...ProductConfirmReservationRouteConfig} />
        <Stack.Screen {...ReservationDetailRouteConfig} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
