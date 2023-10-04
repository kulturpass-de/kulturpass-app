import { commerceApi } from '../../../api/commerce-api'
import { getIsUserLoggedIn } from '../../../auth/store/auth-selectors'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'

export const notificationsSyncPushToken = createThunk<void, void>(
  'notifications/syncPushToken',
  async (payload, thunkAPI) => {
    const store = thunkAPI.getState()
    const isUserLoggedIn = getIsUserLoggedIn(store)
    if (!isUserLoggedIn) {
      logger.log('syncPushToken user not logged in')
      return
    }

    try {
      const { fcmToken, apnsToken, previousFcmToken } = store.persisted.notifications
      if (fcmToken !== undefined) {
        logger.log('syncPushToken syncing push token')
        await thunkAPI
          .dispatch(commerceApi.endpoints.putPushToken.initiate({ fcmToken, apnsToken, previousFcmToken }))
          .unwrap()
      } else {
        logger.log('syncPushToken no token found')
      }
    } catch (error: unknown) {
      logger.logError('syncPushToken', error)
    }
  },
)
