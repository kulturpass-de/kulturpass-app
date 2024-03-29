import { configureStore, isPlain, Middleware } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'
import { cdcApi } from '../api/cdc-api'
import { commerceApi } from '../api/commerce-api'
import { ErrorWithCode } from '../errors/errors'
import { subscribeToNotifications } from '../notifications/subscriptions/subscribe-to-notifications'
import { subscribeToPressAction } from '../notifications/subscriptions/subscribe-to-press-action'
import { listenerMiddleware } from './listener-middleware'
import { reduxPersistIgnoredActions } from './persist-reducer'
import { rootReducer } from './root-reducer'
import { subscribeToAppState } from './subscriptions/subscribe-to-app-state'
import { subscribeToTranslationLanguageChanged } from './subscriptions/subscribe-to-translation-language-changed'

export type SetupStoreProps = {
  preloadedState?: Partial<RootState>
}

export const setupStore = (props?: SetupStoreProps) => {
  const middlewares: Middleware<any>[] = []
  middlewares.push(cdcApi.middleware, commerceApi.middleware, listenerMiddleware.middleware)

  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: reduxPersistIgnoredActions,
          isSerializable: (value: unknown) => {
            if (value instanceof ErrorWithCode) {
              return true
            }
            return isPlain(value)
          },
          warnAfter: 128,
        },
        immutableCheck: { warnAfter: 128 },
      }).concat(middlewares),
    preloadedState: props?.preloadedState,
  })

  const persistor = persistStore(store)

  subscribeToAppState(store)
  subscribeToTranslationLanguageChanged(store)
  subscribeToNotifications(store)
  subscribeToPressAction(store)

  return { store, persistor }
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['store']['dispatch']
