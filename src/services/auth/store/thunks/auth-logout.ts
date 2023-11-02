import notifee from '@notifee/react-native'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { resetCommerceApiCache } from '../../../api/redux/api-offline-cache-slice'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'
import { userSlice } from '../../../user/redux/user-slice'
import { authCdcLogout } from './auth-cdc-logout'
import { authCommerceLogout } from './auth-commerce-logout'

export const authLogout = createThunk('auth/logout', async (_payload, thunkAPI) => {
  let errors: Array<unknown> = []
  await thunkAPI.dispatch(authCdcLogout(errors)).unwrap()
  await thunkAPI.dispatch(authCommerceLogout(errors)).unwrap()
  thunkAPI.dispatch(userSlice.actions.clearUser())
  thunkAPI.dispatch(cdcApi.util.resetApiState())
  thunkAPI.dispatch(commerceApi.util.resetApiState())
  thunkAPI.dispatch(resetCommerceApiCache())

  try {
    // Cancel all notifications with an orderCode, as they are not usable when logged out
    const displayedNotificationsWithOrderCodes = (await notifee.getDisplayedNotifications())
      .filter(notification => notification.notification.data?.orderCode !== undefined && notification.id !== undefined)
      .map(notification => notification.id!)

    if (displayedNotificationsWithOrderCodes.length > 0) {
      await notifee.cancelDisplayedNotifications(displayedNotificationsWithOrderCodes)
    }
  } catch (error: unknown) {
    logger.logError('Logout cancelling displayed notifications', error)
  }

  if (errors.length > 0) {
    // We can only show one error. If both API calls fail, it also might be the same problem occuring.
    throw errors[0]
  }
})

export const authLogoutWithoutErrors = createThunk('auth/logout/silent', async (_payload, thunkAPI) => {
  try {
    await thunkAPI.dispatch(authLogout()).unwrap()
  } catch (error: unknown) {
    logger.logError('authLogout', error)
  }
})
