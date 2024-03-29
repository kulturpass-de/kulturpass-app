import React, { Suspense } from 'react'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { webViewBridgeAdapter } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { WebViewBridgeAdapterContext } from './features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter-provider'
import { NavigationContainer } from './navigation/navigation-container'
import { persistor, store } from './services/redux/store'
import { ThemeProvider } from './theme/components/theme-provider'
import { AccessibilityProvider } from './utils/accessibility/components/accessibility-provider'
import { TextStyleProvider } from './utils/accessibility/components/text-style-provider'

export const App = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StoreProvider store={store}>
        <ThemeProvider>
          <AccessibilityProvider>
            <TextStyleProvider>
              <PersistGate loading={null} persistor={persistor}>
                <WebViewBridgeAdapterContext.Provider value={webViewBridgeAdapter}>
                  <Suspense fallback={null}>
                    <NavigationContainer />
                  </Suspense>
                </WebViewBridgeAdapterContext.Provider>
              </PersistGate>
            </TextStyleProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </StoreProvider>
    </SafeAreaProvider>
  )
}
