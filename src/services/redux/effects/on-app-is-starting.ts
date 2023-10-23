import { isAnyOf } from '@reduxjs/toolkit'
import { logger } from '../../logger'
import { AppStartListening, ListenerEffect } from '../listener-middleware'
import { appCoreSlice, selectIsAppRendered, selectIsStoreRehydrated } from '../slices/app-core'
import { selectIsBootstrapped } from '../slices/persisted-app-core'
import { startup } from '../thunks/startup'

export const onAppIsStartingEffect: ListenerEffect = async (_action, listenerApi) => {
  const state = listenerApi.getState()
  if (!selectIsAppRendered(state) || !selectIsStoreRehydrated(state)) {
    return
  }

  logger.log('onAppIsStartingEffect starting app')
  const isAppAlreadyBootstrapped = selectIsBootstrapped(listenerApi.getState())

  try {
    await listenerApi.dispatch(startup({ appFirstRun: !isAppAlreadyBootstrapped })).unwrap()
  } catch (error: unknown) {
    logger.logError('onAppIsStartingEffect startup', error)
  }

  listenerApi.dispatch(appCoreSlice.actions.setIsAppStarted(true))
}

export const onAppIsStarting = (startListening: AppStartListening) =>
  startListening({
    matcher: isAnyOf(appCoreSlice.actions.setIsAppRendered.match, appCoreSlice.actions.setIsStoreRehydrated.match),
    effect: onAppIsStartingEffect,
  })
