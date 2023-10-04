import notifee from '@notifee/react-native'
import { firebase } from '@react-native-firebase/messaging'
import { v4 as uuid } from 'uuid'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { notificationsDebugActions } from '../notifications-debug-slice'
import { notificationsRefreshTokens } from './notifications-refresh-tokens'

export const notificationsStartup = createThunk('notifications/startup', async (_payload, thunkAPI) => {
  logger.log('--- notifications startup')
  await notifee.setBadgeCount(0)
  const isPermissionGranted = await thunkAPI.dispatch(notificationsRefreshTokens()).unwrap()

  if (!isPermissionGranted) {
    return
  }
  logger.log('--- notifications permission granted')

  await firebase.messaging().subscribeToTopic('notify_all')
  logger.log('--- notifications subscribed to topic notify_all')
  /**
   * Check for notifications that need to be processed on boot
   */
  const notification = await firebase.messaging().getInitialNotification()
  if (notification) {
    thunkAPI.dispatch(
      notificationsDebugActions.addEvent({ id: uuid(), type: 'initialNotification', payload: notification }),
    )
  }
})
