import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { selectBackroundPressedNotification } from '../notifications-selectors'
import { setBackgroundPressedNotification } from '../notifications-slice'
import { notificationsOpenReservation } from './notifications-open-reservations'

export const notificationsHandleStoredBackgroundPressNotification = createThunk(
  'notifications/handleStoredBackgroundPressNotification',
  async (_payload, thunkAPI) => {
    const backgroundPressedNotification = selectBackroundPressedNotification(thunkAPI.getState())
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
