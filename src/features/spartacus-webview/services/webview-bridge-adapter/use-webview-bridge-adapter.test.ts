// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { act, renderHook } from '@testing-library/react-native'

import { mockListenerOnce } from '../../../../services/testing/mock-listener-once'
import { SpartacusBridge } from './spartacus-bridge'
import { WebViewId } from './types'
import { useWebViewBridgeAdapter } from './use-webview-bridge-adapter'
import { mockedBridgeAdapterApi } from './__mocks__/create-bridge-adapter-api'

jest.mock('./webview-bridge-adapter-provider')
jest.mock('./create-bridge-adapter-api', () => ({
  createBridgeAdapterApi: () => mockedBridgeAdapterApi,
}))

describe.skip('useWebViewBridgeAdapter', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('bridgeAdapterState.isReady', () => {
    it('should be falsy initially', () => {
      const { result } = renderHook(() => useWebViewBridgeAdapter('myWebViewId' as WebViewId))

      expect(result.current.bridgeAdapterState.isReady).toBeFalsy()
    })

    it('should be set to true after receiveing Bridge EventForwarding', () => {
      const sendBridge = mockListenerOnce(mockedBridgeAdapterApi.onBridge)

      const { result } = renderHook(() => useWebViewBridgeAdapter('myWebViewId' as WebViewId))

      act(() => {
        sendBridge.current?.({
          source: SpartacusBridge.EventForwarding.Source.Bridge,
          name: 'ready',
          data: {},
        })
      })

      expect(result.current.bridgeAdapterState.isReady).toBe(true)
    })
  })
})
