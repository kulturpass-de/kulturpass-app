import { authLogin } from '../../auth/store/thunks/auth-login'
import { notificationsSyncPushToken } from '../../notifications/store/thunks/notifications-sync-push-token'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../listener-middleware'

export const onPushTokenSyncEffect: ListenerEffect<
  ListenerEffectMatcherAction<typeof authLogin.fulfilled.match>
> = async (_action, listenerApi) => {
  listenerApi.dispatch(notificationsSyncPushToken())
}

export const onLoginFulfilled = (startListening: AppStartListening) =>
  startListening({ matcher: authLogin.fulfilled.match, effect: onPushTokenSyncEffect })
