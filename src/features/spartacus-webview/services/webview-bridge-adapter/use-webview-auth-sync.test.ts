import { renderHook } from '@testing-library/react-native'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { mockListenerOnce } from '../../../../services/testing/mock-listener-once'
import { webviewsValidateSession } from '../../../../services/webviews/redux/thunks/webviews-validate-session'
import { webviewsSlice } from '../../../../services/webviews/redux/webviews-slice'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'
import { WebViewEvents, WebViewId } from './types'
import { useWebViewAuthSync } from './use-webview-auth-sync'

describe('useWebViewAuthSync', () => {
  const store = configureMockStore()

  afterEach(() => {
    jest.clearAllMocks()
    store.clearActions()
  })

  it('should setWebViewState onAuthIsUserLoggedIn', async () => {
    const sendAuthIsUserLoggedIn = mockListenerOnce(mockedBridgeAdapterApi.onAuthIsUserLoggedIn)

    renderHook(() => useWebViewAuthSync(WebViewId.Home, mockedBridgeAdapterApi), { wrapper: store.wrapper })

    sendAuthIsUserLoggedIn.current?.({ value: false } as WebViewEvents['auth.isUserLoggedIn'])

    store.expectActions([
      {
        type: webviewsSlice.actions.setWebViewState.type,
        payload: { webViewId: WebViewId.Home, state: { isLoggedIn: false } },
      },
    ])

    sendAuthIsUserLoggedIn.current?.({ value: true } as WebViewEvents['auth.isUserLoggedIn'])

    store.expectActions([
      {
        type: webviewsSlice.actions.setWebViewState.type,
        payload: { webViewId: WebViewId.Home, state: { isLoggedIn: true } },
      },
    ])
  })

  it('should webviewsValidateSession onAuth tokenAwaited', async () => {
    const sendAuth = mockListenerOnce(mockedBridgeAdapterApi.onAuth)

    renderHook(() => useWebViewAuthSync(WebViewId.Home, mockedBridgeAdapterApi), { wrapper: store.wrapper })

    sendAuth.current?.({ name: 'tokenAwaited' } as WebViewEvents['auth'])

    store.expectActions([
      {
        type: webviewsValidateSession.pending.type,
        meta: { arg: WebViewId.Home },
      },
    ])
  })
})
