import { AuthorizationStatus } from '@notifee/react-native'
import { firebase } from '@react-native-firebase/messaging'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { selectNotificationsState } from '../notifications-selectors'
import { setTokens } from '../notifications-slice'
import { notificationsCheckPermissions } from './notifications-check-permissions'

export const notificationsRefreshTokens = createThunk<boolean, void>(
  'notifications/refreshTokens',
  async (_payload, thunkAPI) => {
    const messaging = firebase.messaging()

    const isPermissionGranted = await thunkAPI.dispatch(notificationsCheckPermissions()).unwrap()

    if (isPermissionGranted !== AuthorizationStatus.AUTHORIZED) {
      logger.log('refreshTokens notification permission not granted.')
      return false
    }

    logger.log('--- notifications getting FcmToken')
    const fcmToken = await messaging.getToken()
    const apnsToken = (await messaging.getAPNSToken()) || undefined
    const currentTokens = { fcmToken, apnsToken }

    const state = thunkAPI.getState()
    const { fcmToken: previousFcmToken } = selectNotificationsState(state)

    if (previousFcmToken !== currentTokens.fcmToken) {
      logger.log('refreshTokens fcmToken changed. Updating...')
      thunkAPI.dispatch(setTokens(currentTokens))
    }
    return true
  },
)
