import notifee from '@notifee/react-native'
import { Platform } from 'react-native'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { selectBackroundPressedNotification } from '../notifications-selectors'
import { setBackgroundPressedNotification } from '../notifications-slice'
import { notificationsOpenReservation } from './notifications-open-reservations'

export const notificationsHandleStoredBackgroundPressNotification = createThunk(
  'notifications/handleStoredBackgroundPressNotification',
  async (_payload, thunkAPI) => {
    logger.log('handleStoredBackgroundPressNotification')
    let backgroundPressedNotification = selectBackroundPressedNotification(thunkAPI.getState())
    if (backgroundPressedNotification !== undefined) {
      logger.log(
        'handleStoredBackgroundPressNotification got notification from store',
        backgroundPressedNotification.id,
      )
    }
    if (Platform.OS === 'android') {
      // On Android it is also recommended to check getInitialNotification. (Deprecated on iOS)
      const initialNotification = await notifee.getInitialNotification()
      if (initialNotification?.notification !== undefined && initialNotification.pressAction?.id === 'default') {
        logger.log(
          'handleStoredBackgroundPressNotification got initial notification',
          initialNotification.notification.id,
        )
        backgroundPressedNotification = initialNotification.notification
      }
    }
    if (backgroundPressedNotification !== undefined) {
      thunkAPI.dispatch(setBackgroundPressedNotification(undefined))
      logger.log('Handle notification that was pressed in background')
      const orderCode = backgroundPressedNotification.data?.orderCode
      if (typeof orderCode === 'string') {
        await thunkAPI.dispatch(notificationsOpenReservation({ orderCode })).unwrap()
      }
    }
  },
)
