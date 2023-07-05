import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import 'react-native-get-random-values'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'

import { webViewBridgeAdapter } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { WebViewBridgeAdapterContext } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter-provider'
import { setupStore } from './services/redux/configure-store'
import { NavigationContainer } from './navigation/navigation-container'

SystemNavigationBar.setNavigationColor('white', 'dark', 'navigation')

export const { store, persistor } = setupStore({})

const AppWithProviders = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <WebViewBridgeAdapterContext.Provider value={webViewBridgeAdapter}>
            <Suspense fallback="loading">
              <NavigationContainer />
            </Suspense>
          </WebViewBridgeAdapterContext.Provider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  )
}

export default AppWithProviders
