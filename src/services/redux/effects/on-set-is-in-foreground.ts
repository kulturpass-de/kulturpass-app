import notifee from '@notifee/react-native'
import { authValidateSession } from '../../auth/store/thunks/auth-validate-session'
import { refreshLocation } from '../../location/redux/thunks/refresh-location'
import { notificationsHandleStoredBackgroundPressNotification } from '../../notifications/store/thunks/notifications-handle-stored-backround-press-notification'
import { notificationsRefreshTokens } from '../../notifications/store/thunks/notifications-refresh-tokens'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../listener-middleware'
import { appCoreSlice, selectIsAppStarted } from '../slices/app-core'

export const onSetIsInForegroundEffect: ListenerEffect<
  ListenerEffectMatcherAction<(typeof appCoreSlice)['actions']['setIsInForeground']['match']>
> = async ({ payload: isInForeground }, listenerApi) => {
  const isAppStarted = selectIsAppStarted(listenerApi.getState())

  if (!isAppStarted) {
    return
  }

  if (isInForeground) {
    await notifee.setBadgeCount(0)

    await listenerApi.dispatch(notificationsHandleStoredBackgroundPressNotification())

    await listenerApi.dispatch(refreshLocation())

    await listenerApi.dispatch(authValidateSession())

    await listenerApi.dispatch(notificationsRefreshTokens())
  }
}

export const onSetIsInForeground = (startListening: AppStartListening) =>
  startListening({ matcher: appCoreSlice.actions.setIsInForeground.match, effect: onSetIsInForegroundEffect })
