import { renderHook } from '@testing-library/react-native'
import { mockListenerOnce } from '../../../services/testing/mock-listener-once'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { WebViewEvents } from '../services/webview-bridge-adapter/types'
import { mockedBridgeAdapterApi } from '../services/webview-bridge-adapter/__mocks__/create-bridge-adapter-api'
import { useHandleWebviewNavigation } from './use-handle-webview-navigation'
import { HomeRouteName } from '../../../screens/home/home-route'
import { useRoute } from '@react-navigation/native'
import { SearchRouteName } from '../../../screens/search/search-route'

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

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}))

const mockUseRoute = useRoute as jest.Mock

describe('useHandleWebviewNavigation', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should navigate to home instead of search', async () => {
    mockUseRoute.mockReturnValue({ name: HomeRouteName })

    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useHandleWebviewNavigation(mockedBridgeAdapterApi))

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterHomeEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterSearchEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(1)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls[0][0][0]).toEqual('/')
  })

  test('should navigate to search instead of home', async () => {
    mockUseRoute.mockReturnValue({ name: SearchRouteName })

    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useHandleWebviewNavigation(mockedBridgeAdapterApi))

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterSearchEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterHomeEvent)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls).toHaveLength(1)

    expect(mockedBridgeAdapterApi.routerNavigate.mock.calls[0][0][0]).toEqual('/search')
  })
})
