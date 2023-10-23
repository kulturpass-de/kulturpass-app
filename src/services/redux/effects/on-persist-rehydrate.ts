import { REHYDRATE } from 'redux-persist'
import { authValidateSession } from '../../auth/store/thunks/auth-validate-session'
import { refreshLocation } from '../../location/redux/thunks/refresh-location'
import { logger } from '../../logger'
import { AppStartListening, ListenerEffect } from '../listener-middleware'
import { appCoreSlice } from '../slices/app-core'
import { selectIsBootstrapped } from '../slices/persisted-app-core'
import { startup } from '../thunks/startup'

export const onPersistRehydrateEffect: ListenerEffect = async (action, listenerApi) => {
  const isAppAlreadyBootstrapped = selectIsBootstrapped(listenerApi.getState())

  try {
    await listenerApi.dispatch(startup({ appFirstRun: !isAppAlreadyBootstrapped })).unwrap()
  } catch (error: unknown) {
    logger.logError('onPersistRehydrateEffect startup', error)
  }

  await listenerApi.dispatch(refreshLocation())

  await listenerApi.dispatch(authValidateSession())

  listenerApi.dispatch(appCoreSlice.actions.setIsStoreRehydrated(true))
}

export const onPersistRehydrate = (startListening: AppStartListening) =>
  startListening({ type: REHYDRATE, effect: onPersistRehydrateEffect })
