import { renderHook } from '@testing-library/react-native'
import { configureMockStore } from '../../../services/testing/configure-mock-store'
import { mockListenerOnce } from '../../../services/testing/mock-listener-once'
import { webviewsSlice } from '../../../services/webviews/redux/webviews-slice'
import { mockedBridgeAdapterApi } from '../services/webview-bridge-adapter/__mocks__/create-bridge-adapter-api'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { WebViewEvents, WebViewId } from '../services/webview-bridge-adapter/types'
import { useHandleWebviewNavigation } from './use-handle-webview-navigation'

const mockedRouterSearchEvent: WebViewEvents['router.events'] = {
  name: 'test',
  source: SpartacusBridge.EventForwarding.Source.RouterEvents,
  data: {
    id: 1,
    url: '/search/testsearch?query=1234',
  },
}

const mockedRouterHomeEvent: WebViewEvents['router.events'] = {
  name: 'test',
  source: SpartacusBridge.EventForwarding.Source.RouterEvents,
  data: {
    id: 2,
    url: '/',
  },
}

describe('useHandleWebviewNavigation', () => {
  const store = configureMockStore()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should setWebViewState with every navigation', async () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useHandleWebviewNavigation(WebViewId.Home, mockedBridgeAdapterApi), { wrapper: store.wrapper })

    sendRouterEvent.current?.({ data: { url: '/product/123' } } as WebViewEvents['router.events'])

    store.expectActions([
      {
        type: webviewsSlice.actions.setWebViewState.type,
        payload: { webViewId: WebViewId.Home, state: { routerUrl: '/product/123' } },
      },
    ])

    sendRouterEvent.current?.({ data: { url: '/some-url' } } as WebViewEvents['router.events'])

    store.expectActions([
      {
        type: webviewsSlice.actions.setWebViewState.type,
        payload: { webViewId: WebViewId.Home, state: { routerUrl: '/some-url' } },
      },
    ])
  })

  it('should navigate to home instead of search', async () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useHandleWebviewNavigation(WebViewId.Home, mockedBridgeAdapterApi), { wrapper: store.wrapper })

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterHomeEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterSearchEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(1)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls[0][0][0]).toEqual('/')
  })

  it('should navigate to search instead of home', async () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useHandleWebviewNavigation(WebViewId.Search, mockedBridgeAdapterApi), { wrapper: store.wrapper })

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterSearchEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterHomeEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(1)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls[0][0][0]).toEqual('/search')
  })
})
