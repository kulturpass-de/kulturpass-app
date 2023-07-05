import { act, renderHook } from '@testing-library/react-native'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { mockListenerOnce } from '../../../../services/testing/mock-listener-once'
import { webviewsSlice } from '../../../../services/webviews/redux/webviews-slice'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'
import { SpartacusBridge } from './spartacus-bridge'
import { WebViewId } from './types'
import { useWebViewBridgeAdapter } from './use-webview-bridge-adapter'

jest.mock('./webview-bridge-adapter-provider')
jest.mock('./create-bridge-adapter-api', () => ({
  createBridgeAdapterApi: () => mockedBridgeAdapterApi,
}))

describe('useWebViewBridgeAdapter', () => {
  const store = configureMockStore()

  afterEach(() => {
    jest.clearAllMocks()
    store.clearActions()
  })

  describe('bridgeAdapterState.isReady', () => {
    it('should setWebViewState onBridge ready', () => {
      const sendBridge = mockListenerOnce(mockedBridgeAdapterApi.onBridge)

      renderHook(() => useWebViewBridgeAdapter(WebViewId.Home), { wrapper: store.wrapper })

      act(() => {
        sendBridge.current?.({
          source: SpartacusBridge.EventForwarding.Source.Bridge,
          name: 'ready',
          data: {},
        })
      })

      store.expectActions([
        {
          type: webviewsSlice.actions.setWebViewState.type,
          payload: { webViewId: WebViewId.Home, state: { isReady: true } },
        },
      ])
    })
  })
})
