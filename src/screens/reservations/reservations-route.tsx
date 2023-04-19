import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useModalNavigation } from '../../navigation/modal/hooks'

import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { LogInRouteConfig } from '../log-in/log-in-route'
import { ReservationsScreen, ReservationsScreenProps } from './reservations-screen'
import { ReservationsUnauthorizedScreen, ReservationsUnauthorizedScreenProps } from './reservations-unauthorized-screen'

export const ReservationsRouteName = 'Reservations'

export type ReservationsRouteParams = undefined

export const ReservationsRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const onSignInRequested: ReservationsUnauthorizedScreenProps['onSignInRequested'] = useCallback(() => {
    modalNavigation.navigate({
      screen: LogInRouteConfig.name,
    })
  }, [modalNavigation])

  const onReservationPressed: ReservationsScreenProps['onReservationPressed'] = useCallback(
    orderCode => {
      modalNavigation.navigate({ screen: 'ReservationDetail', params: { orderCode } })
    },
    [modalNavigation],
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
