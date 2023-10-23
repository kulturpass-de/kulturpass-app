import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { RootStackParams } from '../../navigation/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { LogInRouteConfig } from '../log-in/log-in-route'
import { ReservationsScreen, ReservationsScreenProps } from './reservations-screen'
import { ReservationsUnauthorizedScreen, ReservationsUnauthorizedScreenProps } from './reservations-unauthorized-screen'

export const ReservationsRouteName = 'Reservations'

export type ReservationsRouteParams = undefined

export const ReservationsRoute: React.FC = () => {
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const modalNavigation = useModalNavigation()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const onSignInRequested: ReservationsUnauthorizedScreenProps['onSignInRequested'] = useCallback(() => {
    modalNavigation.navigate({
      screen: LogInRouteConfig.name,
    })
  }, [modalNavigation])

  const onReservationPressed: ReservationsScreenProps['onReservationPressed'] = useCallback(
    (orderCode, completedReservation) => {
      rootNavigation.navigate('PDP', { screen: 'ReservationDetail', params: { orderCode, completedReservation } })
    },
    [rootNavigation],
  )

  return isLoggedIn ? (
    <ReservationsScreen onReservationPressed={onReservationPressed} />
  ) : (
    <ReservationsUnauthorizedScreen onSignInRequested={onSignInRequested} />
  )
}

export const ReservationsRouteConfig = createRouteConfig({
  name: ReservationsRouteName,
  component: ReservationsRoute,
})
