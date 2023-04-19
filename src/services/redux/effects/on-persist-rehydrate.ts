import { REHYDRATE } from 'redux-persist'

import { AppStartListening, ListenerEffect } from '../listener-middleware'
import { isAppInstalled } from '../slices/installation'
import { startup } from '../thunks/startup'

export const onPersistRehydrateEffect: ListenerEffect = async (action, listenerApi) => {
  const isAppAlreadyInstalled = isAppInstalled(listenerApi.getState())

  await listenerApi.dispatch(startup({ appFirstRun: !isAppAlreadyInstalled })).unwrap()
}

export const onPersistRehydrate = (startListening: AppStartListening) =>
  startListening({ type: REHYDRATE, effect: onPersistRehydrateEffect })
