import React, { Suspense, useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import SystemNavigationBar from 'react-native-system-navigation-bar'
import 'react-native-get-random-values'

import { webViewBridgeAdapter } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { WebViewBridgeAdapterContext } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter-provider'
import { setupStore } from './services/redux/configure-store'
import { useAppState } from './services/app-state/hooks/use-app-state'
import { useRefreshLocation } from './services/location/hooks/use-refresh-location'
import { NavigationContainer } from './navigation/navigation-container'

SystemNavigationBar.setNavigationColor('white', 'dark', 'navigation')

export const { store, persistor } = setupStore({})

const AppWithProviders = () => {
  const { appIsInForeground } = useAppState()
  const { refreshLocation } = useRefreshLocation()

  useEffect(() => {
    if (appIsInForeground) {
      refreshLocation()
    }
  }, [refreshLocation, appIsInForeground])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <WebViewBridgeAdapterContext.Provider value={webViewBridgeAdapter}>
          <Suspense fallback="loading">
            <NavigationContainer />
          </Suspense>
        </WebViewBridgeAdapterContext.Provider>
      </PersistGate>
    </Provider>
  )
}

export default AppWithProviders
