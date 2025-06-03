import {
  AnyAction,
  AnyListenerPredicate,
  createListenerMiddleware,
  ListenerEffect as AnyListenerEffect,
  TypedStartListening,
} from '@reduxjs/toolkit'
import { addApiEffects } from '../api/redux/effects'
import { addLocationEffects } from '../location/redux/effects'
import { addUserEffects } from '../user/redux/effects'
import { addWebviewsEffects } from '../webviews/redux/effects'
import { AppDispatch, RootState } from './configure-store'
import { addRootStoreEffects } from './effects'

export const listenerMiddleware = createListenerMiddleware<RootState, AppDispatch>()
export type AppStartListening = TypedStartListening<RootState, AppDispatch>
export type ListenerPredicate = AnyListenerPredicate<RootState>
export type ListenerEffect<Action extends AnyAction = AnyAction> = AnyListenerEffect<Action, RootState, AppDispatch>
export type ListenerEffectMatcherAction<T> = T extends (x: any, ...args: unknown[]) => x is infer U ? U : never

addApiEffects(listenerMiddleware.startListening)
addRootStoreEffects(listenerMiddleware.startListening)
addUserEffects(listenerMiddleware.startListening)
addWebviewsEffects(listenerMiddleware.startListening)
addLocationEffects(listenerMiddleware.startListening)
