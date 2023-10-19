import { firebase } from '@react-native-firebase/messaging'
import { logger } from '../../logger'
import { AppStore } from '../../redux/configure-store'
import { notificationsRefreshTokens } from '../store/thunks/notifications-refresh-tokens'

export const subscribeToPushTokenChanges = (store: Pick<AppStore['store'], 'dispatch'>) => {
  const messaging = firebase.messaging()

  /**
   * Token was invalidated by server or is expired
   */
  messaging.onTokenRefresh(fcmToken => {
    logger.log('--- notifications tokenRefresh')
    store.dispatch(notificationsRefreshTokens(fcmToken))
  })
}
