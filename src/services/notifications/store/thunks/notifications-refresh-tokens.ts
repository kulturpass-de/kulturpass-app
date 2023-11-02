import { AuthorizationStatus } from '@notifee/react-native'
import { firebase } from '@react-native-firebase/messaging'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { selectPersistedNotificationsState } from '../notifications-selectors'
import { setTokens } from '../notifications-slice'
import { notificationsCheckPermissions } from './notifications-check-permissions'
import { notificationsSyncPushToken } from './notifications-sync-push-token'

export const notificationsRefreshTokens = createThunk<boolean, string | undefined>(
  'notifications/refreshTokens',
  async (payload, thunkAPI) => {
    const messaging = firebase.messaging()

    const isPermissionGranted = await thunkAPI.dispatch(notificationsCheckPermissions()).unwrap()

    if (isPermissionGranted !== AuthorizationStatus.AUTHORIZED) {
      logger.log('refreshTokens notification permission not granted.')
      return false
    }

    logger.log('--- notifications getting FcmToken')
    const fcmToken = payload ?? (await messaging.getToken())
    const apnsToken = (await messaging.getAPNSToken()) || undefined
    const currentTokens = { fcmToken, apnsToken }

    const state = thunkAPI.getState()
    const { fcmToken: previousFcmToken } = selectPersistedNotificationsState(state)
    if (previousFcmToken !== currentTokens.fcmToken) {
      logger.log('refreshTokens fcmToken changed. Updating...')
      thunkAPI.dispatch(setTokens(currentTokens))
      try {
        await firebase.messaging().subscribeToTopic('notify_all')
        logger.log('refreshTokens subscribed to topic notify_all')
      } catch (error: unknown) {
        logger.logError('refreshTokens subscribe to topic notify_all', error)
      }
      await thunkAPI.dispatch(notificationsSyncPushToken()).unwrap()
    }
    return true
  },
)
