import { Event, EventType } from '@notifee/react-native'
import { logger } from '../../../logger'
import { rehydrationPromise } from '../../../redux/effects/on-persist-rehydrate'
import { createThunk } from '../../../redux/utils/create-thunk'
import { setBackgroundPressedNotification } from '../notifications-slice'

export const notificationsHandleBackgroundPressEvent = createThunk<void, Event>(
  'notifications/handleBackgroundPressEvent',
  async (payload, thunkAPI) => {
    if (payload.type === EventType.PRESS) {
      await rehydrationPromise
      logger.log('Notification pressed in background')
      thunkAPI.dispatch(setBackgroundPressedNotification(payload.detail.notification))
    }
  },
)
