import { commerceApi } from '../../../api/commerce-api'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { notificationsRefreshTokens } from './notifications-refresh-tokens'

export const notificationsSyncPushToken = createThunk<void, void>(
  'notifications/syncPushToken',
  async (_payload, thunkAPI) => {
    logger.log('syncPushTokens')
    const store = thunkAPI.getState()

    try {
      if (!store.persisted.notifications.fcmToken) {
        logger.log('syncPushToken no token found - refreshing')
        await thunkAPI.dispatch(notificationsRefreshTokens()).unwrap()
      }

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
