import { authLogin } from '../../auth/store/thunks/auth-login'
import { setTokens } from '../../notifications/store/notifications-slice'
import { notificationsSyncPushToken } from '../../notifications/store/thunks/notifications-sync-push-token'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../listener-middleware'

export const onPushTokenSyncEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof setTokens.match | typeof authLogin.fulfilled.match>
> = async (_action, listenerApi) => {
  listenerApi.dispatch(notificationsSyncPushToken())
}

export const onLoginFulfilled = (startListening: AppStartListening) =>
  startListening({ matcher: authLogin.fulfilled.match, effect: onPushTokenSyncEffect })

export const onSetTokens = (startListening: AppStartListening) =>
  startListening({ matcher: setTokens.match, effect: onPushTokenSyncEffect })
