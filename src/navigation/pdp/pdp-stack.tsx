import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { StatusBar } from 'react-native'
import { OfferSelectionFilterRouteConfig } from '../../screens/product-details/offer-selection-filter-route'
import { OfferSelectionRouteConfig } from '../../screens/product-details/offer-selection-route'
import { ProductConfirmReservationRouteConfig } from '../../screens/product-details/product-confirm-reservation-route'
import { ProductDetailRouteConfig } from '../../screens/product-details/product-detail-route'
import { ProductReportRouteConfig } from '../../screens/product-details/product-report-route'
import { OrderReportRouteConfig } from '../../screens/reservations/order-report-route'
import { ReservationDetailRouteConfig } from '../../screens/reservations/reservation-detail-route'
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
        <Stack.Screen {...ProductReportRouteConfig} />
        <Stack.Screen {...OrderReportRouteConfig} />
      </Stack.Navigator>
    </ModalStackWrapper>
  )
}
