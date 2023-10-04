import { rootNavigationRef, rootNavigationRefReadyPromise } from '../../../navigation/navigation-container'
import { getIsUserLoggedIn } from '../../auth/store/auth-selectors'
import { logger } from '../../logger'
import { AppStore } from '../../redux/configure-store'

export const openReservation = (store: Pick<AppStore['store'], 'getState'>, orderCode: string) => {
  const isUserLoggedIn = getIsUserLoggedIn(store.getState())
  logger.log('Opening Reservation from notification')
  if (!isUserLoggedIn) {
    return
  }

  if (rootNavigationRef.isReady()) {
    rootNavigationRef.navigate('PDP', { screen: 'ReservationDetail', params: { orderCode } })
  } else {
    rootNavigationRefReadyPromise.then(() => {
      rootNavigationRef.navigate('PDP', { screen: 'ReservationDetail', params: { orderCode } })
    })
  }
}
