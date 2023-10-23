import { configureStore, isPlain, Middleware } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'
import { cdcApi } from '../api/cdc-api'
import { commerceApi } from '../api/commerce-api'
import { ErrorWithCode } from '../errors/errors'
import { listenerMiddleware } from './listener-middleware'
import { reduxPersistIgnoredActions } from './persist-reducer'
import { rootReducer } from './root-reducer'
import { subscribeToAppState } from './subscriptions/subscribe-to-app-state'
import { subscribeToTranslationLanguageChanged } from './subscriptions/subscribe-to-translation-language-changed'

export type SetupStoreProps = {
  preloadedState?: Partial<RootState>
}

export const setupStore = (props: SetupStoreProps) => {
  const { preloadedState } = props

  const middlewares: Middleware<any>[] = []
  if (__DEV__ && !process.env.JEST_WORKER_ID) {
    const createReduxDebugger = require('redux-flipper').default
    middlewares.push(createReduxDebugger())
  }
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
        },
      }).concat(middlewares),
    preloadedState,
  })

  const persistor = persistStore(store)

  subscribeToAppState(store)
  subscribeToTranslationLanguageChanged(store)

  return { store, persistor }
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['store']['dispatch']
