import {
  createListenerMiddleware,
  TypedStartListening,
  AnyListenerPredicate,
  ListenerEffect as AnyListenerEffect,
  AnyAction,
} from '@reduxjs/toolkit'

import { addAuthStoreEffects } from '../auth/store/effects'
import { AppDispatch, RootState } from './configure-store'
import { addRootStoreEffects } from './effects'

export const listenerMiddleware = createListenerMiddleware<RootState, AppDispatch>()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type ListenerPredicate = AnyListenerPredicate<RootState>
export type ListenerEffect = AnyListenerEffect<AnyAction, RootState, AppDispatch>

addAuthStoreEffects(listenerMiddleware.startListening)
addRootStoreEffects(listenerMiddleware.startListening)
