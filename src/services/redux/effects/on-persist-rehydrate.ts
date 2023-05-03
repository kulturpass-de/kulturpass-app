import { REHYDRATE } from 'redux-persist'

import { AppStartListening, ListenerEffect } from '../listener-middleware'
import { selectIsBootstrapped } from '../slices/app-core'
import { startup } from '../thunks/startup'

export const onPersistRehydrateEffect: ListenerEffect = async (action, listenerApi) => {
  const isAppAlreadyBootstrapped = selectIsBootstrapped(listenerApi.getState())

  await listenerApi.dispatch(startup({ appFirstRun: !isAppAlreadyBootstrapped })).unwrap()
}

export const onPersistRehydrate = (startListening: AppStartListening) =>
  startListening({ type: REHYDRATE, effect: onPersistRehydrateEffect })
