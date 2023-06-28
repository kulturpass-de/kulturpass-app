import {
  createListenerMiddleware,
  TypedStartListening,
  AnyListenerPredicate,
  ListenerEffect as AnyListenerEffect,
  AnyAction,
} from '@reduxjs/toolkit'
import { GuardedType } from '@reduxjs/toolkit/dist/listenerMiddleware/types'

import { addUserEffects } from '../user/redux/effects'
import { addWebviewsEffects } from '../webviews/redux/effects'
import { AppDispatch, RootState } from './configure-store'
import { addRootStoreEffects } from './effects'

export const listenerMiddleware = createListenerMiddleware<RootState, AppDispatch>()

export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type ListenerPredicate = AnyListenerPredicate<RootState>
export type ListenerEffect<Action extends AnyAction = AnyAction> = AnyListenerEffect<Action, RootState, AppDispatch>
export type ListenerEffectMatcherAction<T> = GuardedType<T>

addRootStoreEffects(listenerMiddleware.startListening)
addUserEffects(listenerMiddleware.startListening)
addWebviewsEffects(listenerMiddleware.startListening)
