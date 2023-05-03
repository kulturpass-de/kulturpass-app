import {
  createListenerMiddleware,
  TypedStartListening,
  AnyListenerPredicate,
  ListenerEffect as AnyListenerEffect,
  AnyAction,
} from '@reduxjs/toolkit'
import { GuardedType } from '@reduxjs/toolkit/dist/listenerMiddleware/types'

import { addAuthStoreEffects } from '../auth/store/effects'
import { AppDispatch, RootState } from './configure-store'
import { addRootStoreEffects } from './effects'

export const listenerMiddleware = createListenerMiddleware<RootState, AppDispatch>()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type ListenerPredicate = AnyListenerPredicate<RootState>
export type ListenerEffect<Action extends AnyAction = AnyAction> = AnyListenerEffect<Action, RootState, AppDispatch>
export type ListenerEffectMatcherAction<T> = GuardedType<T>

addAuthStoreEffects(listenerMiddleware.startListening)
addRootStoreEffects(listenerMiddleware.startListening)
