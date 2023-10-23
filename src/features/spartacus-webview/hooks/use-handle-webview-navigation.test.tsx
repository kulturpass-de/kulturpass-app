import { renderHook } from '@testing-library/react-native'
import React, { PropsWithChildren } from 'react'
import { useStore } from 'react-redux'
import { act } from 'react-test-renderer'
import { NavigationContainer } from '../../../navigation/navigation-container'
import { RootState } from '../../../services/redux/configure-store'
import { mockListenerOnce } from '../../../services/testing/mock-listener-once'
import { StoreProvider } from '../../../services/testing/test-utils'
import { mockedBridgeAdapterApi } from '../services/webview-bridge-adapter/__mocks__/create-bridge-adapter-api'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { WebViewEvents, WebViewId } from '../services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../services/webview-bridge-adapter/webview-bridge-adapter'
import { WebViewBridgeAdapterContext } from '../services/webview-bridge-adapter/webview-bridge-adapter-provider'
import { useHandleWebviewNavigation } from './use-handle-webview-navigation'

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  getInitialURL: jest.fn(() => Promise.resolve(null)),
  addEventListener: jest.fn(() => ({ remove: () => {} })),
}))

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

const Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <StoreProvider>
      <WebViewBridgeAdapterContext.Provider value={webViewBridgeAdapter}>
        <NavigationContainer>{children}</NavigationContainer>
      </WebViewBridgeAdapterContext.Provider>
    </StoreProvider>
  )
}

describe('useHandleWebviewNavigation', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should navigate to search instead of home', async () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useHandleWebviewNavigation(WebViewId.Search, mockedBridgeAdapterApi), { wrapper: Wrapper })

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    await act(() => sendRouterEvent.current?.(mockedRouterSearchEvent))

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    await act(() => sendRouterEvent.current?.(mockedRouterHomeEvent))

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(1)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls[0][0][0]).toEqual('/search')
  })

  it('should setWebViewState routesToLogin if routes to login', async () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    const { result } = renderHook(
      () => {
        useHandleWebviewNavigation(WebViewId.Home, mockedBridgeAdapterApi)
        return useStore<RootState>()
      },
      { wrapper: Wrapper },
    )

    await act(() => sendRouterEvent.current?.({ data: { url: '/login' } } as WebViewEvents['router.events']))

    expect(result.current.getState().webviews.Home.routesToLogin).toBe(true)

    await act(() => sendRouterEvent.current?.({ data: { url: '/some-url' } } as WebViewEvents['router.events']))

    expect(result.current.getState().webviews.Home.routesToLogin).toBe(false)
  })

  it('should setWebViewState showHeader if routes to home page', async () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    const { result } = renderHook(
      () => {
        useHandleWebviewNavigation(WebViewId.Home, mockedBridgeAdapterApi)
        return useStore<RootState>()
      },
      { wrapper: Wrapper },
    )

    await act(() => sendRouterEvent.current?.({ data: { url: '/?abc=123' } } as WebViewEvents['router.events']))

    expect(result.current.getState().webviews.Home.showHeader).toBe(true)

    await act(() => sendRouterEvent.current?.({ data: { url: '/some-url' } } as WebViewEvents['router.events']))

    expect(result.current.getState().webviews.Home.showHeader).toBe(false)

    await act(() => sendRouterEvent.current?.({ data: { url: '/homepage' } } as WebViewEvents['router.events']))

    expect(result.current.getState().webviews.Home.showHeader).toBe(true)

    await act(() =>
      sendRouterEvent.current?.({ data: { url: '/some-other-url?asds=432' } } as WebViewEvents['router.events']),
    )

    expect(result.current.getState().webviews.Home.showHeader).toBe(false)
  })

  it('should not setWebViewState showHeader and routesToLogin if routes to product', async () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    const { result } = renderHook(
      () => {
        useHandleWebviewNavigation(WebViewId.Search, mockedBridgeAdapterApi)
        return useStore<RootState>()
      },
      { wrapper: Wrapper },
    )

    await act(() => sendRouterEvent.current?.({ data: { url: '/product' } } as WebViewEvents['router.events']))

    expect(result.current.getState().webviews.Search.showHeader).toBe(null)
    expect(result.current.getState().webviews.Search.routesToLogin).toBe(null)
  })
})
