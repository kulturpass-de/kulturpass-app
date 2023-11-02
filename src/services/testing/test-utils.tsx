import { NavigationContainer, NavigationContainerProps } from '@react-navigation/native'
import { Action } from '@reduxjs/toolkit'
import '@testing-library/jest-native/extend-expect'
import { render } from '@testing-library/react-native'
import { HttpResponse, http } from 'msw'
import { setupServer as setupMswServer } from 'msw/node'
import React, { PropsWithChildren, useRef } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { WebViewBridgeAdapter } from '../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { WebViewBridgeAdapterContext } from '../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter-provider'
import { RootStackScreen } from '../../navigation/root-stack'
import { CDC_SESSION_EXPIRATION_INFINITE } from '../api/cdc-constants'
import { AccountsGetAccountInfoResponse } from '../api/types'
import { GetProfileResponseBody } from '../api/types/commerce/commerce-get-profile'
import { authSlice } from '../auth/store/auth-slice'
import { setEnvironmentConfiguration } from '../environment-configuration/redux/environment-configuration-slice'
import { RootState, setupStore } from '../redux/configure-store'
import { rootReducer } from '../redux/root-reducer'
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

export const renderScreen = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <StoreProvider withLoginSession>
        <NavigationContainer>{children}</NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const bridgeAdapter = useRef(new WebViewBridgeAdapter())
  return (
    <SafeAreaProvider>
      <WebViewBridgeAdapterContext.Provider value={bridgeAdapter.current}>
        {children}
      </WebViewBridgeAdapterContext.Provider>
    </SafeAreaProvider>
  )
}

const actionsFreshStart: Action[] = [setEnvironmentConfiguration('test')]

const testTimestamp = new Date(2032, 1, 1).getTime()
const actionsLoggedIn: Action[] = [
  setEnvironmentConfiguration('test'),
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
  authSlice.actions.setCommerceSession({
    access_token: 'C2chI8nvTVVFA92RzzXFmalN6id',
    token_type: 'bearer',
    expires_in: 43199,
    scope: 'basic openid',
    token_valid_until: Date.now() + 43189 * 1000,
  }),
  userSlice.actions.setUserProfile({ firstName: 'Max' }),
]

export const StoreProvider: React.FC<{ withLoginSession?: boolean } & PropsWithChildren> = ({
  withLoginSession = false,
  children,
}) => {
  const preloadedState: RootState = (withLoginSession ? actionsLoggedIn : actionsFreshStart).reduce((state, action) => {
    return rootReducer(state, action)
  }, {} as RootState)

  const { store, persistor } = setupStore({ preloadedState })

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

type ServerHandler = Parameters<typeof setupMswServer>[0]

export const serverHandlersRequired: ServerHandler[] = [
  http.get('http://localhost/appConfig/url', () =>
    HttpResponse.text(
      'eyJhbGciOiJFUzI1NiJ9.eyJhcHBWZXJzaW9ucyI6eyJtaW4iOiIwLjUuMCJ9LCJjZXJ0aWZpY2F0ZXMiOnsiY2RjIjpbeyJmaW5nZXJwcmludDI1NiI6IjUyRTdDRDZFNTNDOTAxM0NEMkU1ODdGNDEyODlGMjZERDBCNkIwQjc1RjMxQ0ZFRTAzQzQyQzEyMkRCMTYwNEEifV0sImNvbW1lcmNlIjpbeyJmaW5nZXJwcmludDI1NiI6IkNCQjk2MkVCOTYxNjAwMDI4QUE4MkRBODk5NzNCMkVGMjY3RUI1OUVBQTE0M0Q4MzY5NUM1MENGQTBDRjVGRDIifV19fQ.sqRxPvRh2TYgwmu6fGUamkSOREuoFP0Vo5ONAZeGnSemK4557jnKTsZ0J0bA3JNnrLODGcVk-8Eyu7NFRiuyIQ',
      { status: 200 },
    ),
  ),
]

export const serverHandlersLoggedIn: ServerHandler[] = [
  http.post('*/cdc/accounts.getAccountInfo', () =>
    HttpResponse.json(
      {
        time: new Date().toISOString(),
        isActive: true,
        isVerified: true,
        isRegistered: true,
        callId: `${new Date().getTime()}`,
        errorCode: 0,
        statusCode: 200,
        apiVersion: 2,
        statusReason: 'OK',
        profile: {
          firstName: 'Max',
          email: 'max.mustermann@example.org',
        },
      } as AccountsGetAccountInfoResponse,
      { status: 200 },
    ),
  ),
  http.get('*/cc/kulturapp/users/current', () =>
    HttpResponse.json(
      {
        firstName: 'Max',
        name: 'Max Mustermann',
        identificationStatus: 'VERIFIED',
        balanceStatus: 'ENTITLED',
        balance: {
          availableBalance: { value: 100.0, currencyIso: 'EUR' },
          grantedBalance: { value: 200.0, currencyIso: 'EUR' },
          reservedBalance: { value: 42.5, currencyIso: 'EUR' },
        },
      } as GetProfileResponseBody,
      { status: 200 },
    ),
  ),
]

export const setupServer = (...customHandlers: ServerHandler[]) =>
  setupMswServer(...serverHandlersRequired, ...customHandlers)

export const mockedCdcLoginResponse = {
  profile: { firstName: 'Tester' },
  sessionInfo: {
    sessionToken: 'MySessionToken',
    sessionSecret: 'MySessionSecret',
    expires_in: CDC_SESSION_EXPIRATION_INFINITE,
    signatureTimestamp: (Date.now() / 1000 - 1).toString(),
  },
  id_token: 'my_token',
}
