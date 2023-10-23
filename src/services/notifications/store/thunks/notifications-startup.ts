import notifee from '@notifee/react-native'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { subscribeToPushTokenChanges } from '../../subscriptions/subscribe-to-push-token-changes'
import { notificationsHandleStoredBackgroundPressNotification } from './notifications-handle-stored-backround-press-notification'
import { notificationsRefreshTokens } from './notifications-refresh-tokens'

export const notificationsStartup = createThunk('notifications/startup', async (_payload, thunkAPI) => {
  logger.log('--- notifications startup')
  await notifee.setBadgeCount(0)
  await thunkAPI.dispatch(notificationsHandleStoredBackgroundPressNotification())
  const isPermissionGranted = await thunkAPI.dispatch(notificationsRefreshTokens()).unwrap()

  if (!isPermissionGranted) {
    return
  }
  logger.log('--- notifications permission granted')

  subscribeToPushTokenChanges(thunkAPI)
})
