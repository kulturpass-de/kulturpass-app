import React, { Suspense } from 'react'
import 'react-native-get-random-values'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { webViewBridgeAdapter } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { WebViewBridgeAdapterContext } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter-provider'
import { NavigationContainer } from './navigation/navigation-container'
import { setupStore } from './services/redux/configure-store'
import { Theme } from './theme/components/theme'

export const { store, persistor } = setupStore({})

const AppWithProviders = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <Theme>
          <PersistGate loading={null} persistor={persistor}>
            <WebViewBridgeAdapterContext.Provider value={webViewBridgeAdapter}>
              <Suspense fallback="loading">
                <NavigationContainer />
              </Suspense>
            </WebViewBridgeAdapterContext.Provider>
          </PersistGate>
        </Theme>
      </Provider>
    </SafeAreaProvider>
  )
}

export default AppWithProviders
