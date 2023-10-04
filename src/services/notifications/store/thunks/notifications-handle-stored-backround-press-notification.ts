import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { openReservation } from '../../subscriptions/open-reservation'
import { selectNotificationsState } from '../notifications-selectors'
import { setBackgroundPressedNotification } from '../notifications-slice'

export const notificationsHandleStoredBackgroundPressNotification = createThunk(
  'notifications/handleStoredBackgroundPressNotification',
  async (_payload, thunkAPI) => {
    const backgroundPressedNotification = selectNotificationsState(thunkAPI.getState()).backgroundPressedNotification
    if (backgroundPressedNotification !== undefined) {
      thunkAPI.dispatch(setBackgroundPressedNotification(undefined))
      logger.log('Handle notification that was pressed in background')
      const orderCode = backgroundPressedNotification.data?.orderCode
      if (typeof orderCode === 'string') {
        openReservation(thunkAPI, orderCode)
      }
    }
  },
)
