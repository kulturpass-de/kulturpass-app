import { authValidateSession } from '../../auth/store/thunks/auth-validate-session'
import { refreshLocation } from '../../location/redux/thunks/refresh-location'
import { AppStartListening, ListenerEffect, ListenerEffectMatcherAction } from '../listener-middleware'
import { appCoreSlice, selectIsStoreRehydrated } from '../slices/app-core'

export const onSetIsInForegroundEffect: ListenerEffect<
  ListenerEffectMatcherAction<(typeof appCoreSlice)['actions']['setIsInForeground']['match']>
> = async ({ payload: isInForeground }, listenerApi) => {
  const isStoreRehydrated = selectIsStoreRehydrated(listenerApi.getState())

  if (!isStoreRehydrated) {
    return
  }

  if (isInForeground) {
    await listenerApi.dispatch(refreshLocation())

    await listenerApi.dispatch(authValidateSession())
  }
}

export const onSetIsInForeground = (startListening: AppStartListening) =>
  startListening({ matcher: appCoreSlice.actions.setIsInForeground.match, effect: onSetIsInForegroundEffect })
