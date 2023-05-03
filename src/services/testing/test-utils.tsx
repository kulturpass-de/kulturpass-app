import React, { PropsWithChildren, useEffect } from 'react'
import '@testing-library/jest-native/extend-expect'
import { NavigationContainer, NavigationContainerProps } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { RootStackScreen } from '../../navigation/root-stack'
import { setupStore } from '../redux/configure-store'
import { WebViewBridgeAdapterContext } from '../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter-provider'
import { WebViewBridgeAdapter } from '../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { authSlice } from '../auth/store/auth-slice'
import { setEnvironmentConfiguration } from '../environment-configuration/redux/environment-configuration-slice'
import { userSlice } from '../user/redux/user-slice'

export const renderApp = () => {
  const component = (
    <AppProviders>
      <StoreProvider>
        <NavigationProvider />
      </StoreProvider>
    </AppProviders>
  )
  render(component)
}

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const bridgeAdapter = new WebViewBridgeAdapter()
  return (
    <SafeAreaProvider>
      <WebViewBridgeAdapterContext.Provider value={bridgeAdapter}>{children}</WebViewBridgeAdapterContext.Provider>
    </SafeAreaProvider>
  )
}

export const StoreProvider: React.FC<
  { reduxStore?: ReturnType<typeof setupStore>; withLoginSession?: boolean } & PropsWithChildren
> = ({ reduxStore = setupStore({}), withLoginSession = false, children }) => {
  const { store, persistor } = reduxStore

  useEffect(() => {
    if (withLoginSession) {
      reduxStore.store.dispatch(setEnvironmentConfiguration('test'))
      const testTimestamp = new Date(2032, 1, 1).getTime()
      reduxStore.store.dispatch(
        authSlice.actions.setCdcSession({
          uid: '0',
          user: { firstName: 'Max', email: 'max@test.test' },
          idToken: 'dummy',
          sessionToken: 'dummy',
          uidSignature: 'dummy',
          sessionSecret: 'dummy',
          sessionValidity: testTimestamp,
          sessionStartTimestamp: testTimestamp,
          isVerified: true,
        }),
      )
      reduxStore.store.dispatch(
        authSlice.actions.setCommerceSession({
          access_token: 'C2chI8nvTVVFA92RzzXFmalN6id',
          token_type: 'bearer',
          expires_in: 43199,
          scope: 'basic openid',
        }),
      )
      reduxStore.store.dispatch(userSlice.actions.setUserProfile({ firstName: 'Max' }))
    }
  }, [reduxStore.store, withLoginSession])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export const NavigationProvider: React.FC<Omit<NavigationContainerProps, 'children'>> = props => {
  return (
    <NavigationContainer {...props}>
      <RootStackScreen />
    </NavigationContainer>
  )
}
