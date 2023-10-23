import { StackActions } from '@react-navigation/native'
import { rootNavigationRef, rootNavigationRefReadyPromise } from '../../../../navigation/navigation-container'
import { ReservationDetailRouteName } from '../../../../screens/reservations/reservation-detail-route'
import { getIsUserLoggedIn } from '../../../auth/store/auth-selectors'
import { authValidateSession } from '../../../auth/store/thunks/auth-validate-session'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'

const navigateToReservation = (orderCode: string) => {
  const currentNavigationContainer = rootNavigationRef?.current
  if (currentNavigationContainer && currentNavigationContainer.getCurrentRoute()?.name === ReservationDetailRouteName) {
    currentNavigationContainer.dispatch(
      StackActions.replace('PDP', { screen: ReservationDetailRouteName, params: { orderCode } }),
    )
  } else {
    rootNavigationRef.navigate('PDP', { screen: ReservationDetailRouteName, params: { orderCode } })
  }
}

export const notificationsOpenReservation = createThunk<void, { orderCode: string }>(
  'notifications/openReservation',
  async (payload, thunkAPI) => {
    // Validate session, as the commerce login token might be expired
    await thunkAPI.dispatch(authValidateSession())
    // Memoized value updated through authValidateSession, using selector is fine here
    const isUserLoggedIn = getIsUserLoggedIn(thunkAPI.getState())
    if (!isUserLoggedIn) {
      logger.warn('openReservation User is not logged in')
      return
    }

    logger.log('openReservation Opening reservation from notification')
    if (rootNavigationRef.isReady()) {
      navigateToReservation(payload.orderCode)
    } else {
      await rootNavigationRefReadyPromise
      navigateToReservation(payload.orderCode)
    }
  },
)
