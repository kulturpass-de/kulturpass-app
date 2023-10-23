import { REHYDRATE } from 'redux-persist'
import { logger } from '../../logger'
import { AppStartListening, ListenerEffect } from '../listener-middleware'
import { appCoreSlice } from '../slices/app-core'

let rehydrationComplete: () => void

export const rehydrationPromise = new Promise<void>(resolve => {
  rehydrationComplete = resolve
})

export const onPersistRehydrateEffect: ListenerEffect = async (action, listenerApi) => {
  logger.log('onPersistRehydrateEffect rehydration completed')
  rehydrationComplete()
  listenerApi.dispatch(appCoreSlice.actions.setIsStoreRehydrated(true))
}

export const onPersistRehydrate = (startListening: AppStartListening) =>
  startListening({ type: REHYDRATE, effect: onPersistRehydrateEffect })
