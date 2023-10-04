import { firebase } from '@react-native-firebase/messaging'
import { logger } from '../../logger'
import { AppStore } from '../../redux/configure-store'
import { selectNotificationsState } from '../store/notifications-selectors'
import { setTokens } from '../store/notifications-slice'

export const subscribeToPushTokenChanges = (store: AppStore['store']) => {
  const messaging = firebase.messaging()

  /**
   * Token was invalidated by server or is expired
   */
  messaging.onTokenRefresh(fcmToken => {
    logger.log('--- notifications tokenRefresh')
    const state = store.getState()

    const { fcmToken: previousFcmToken } = selectNotificationsState(state)

    if (previousFcmToken !== fcmToken) {
      messaging.getAPNSToken().then(apnsToken => {
        logger.log('tokenRefresh fcmToken changed. Updating...')
        store.dispatch(setTokens({ fcmToken, apnsToken: apnsToken ?? undefined }))
      })
    }
  })
}
