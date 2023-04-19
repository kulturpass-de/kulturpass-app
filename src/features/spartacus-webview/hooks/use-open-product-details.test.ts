import { renderHook } from '@testing-library/react-native'
import { mockListenerOnce } from '../../../services/testing/mock-listener-once'
import { ProductDetailRouteConfig } from '../../product-detail/screens/product-detail-route'
import { SpartacusBridge } from '../services/webview-bridge-adapter/spartacus-bridge'
import { WebViewEvents } from '../services/webview-bridge-adapter/types'
import { mockedBridgeAdapterApi } from '../services/webview-bridge-adapter/__mocks__/create-bridge-adapter-api'
import { useOpenProductDetail } from './use-open-product-detail'

const mockedRouterEvent: WebViewEvents['router.events'] = {
  name: 'test',
  source: SpartacusBridge.EventForwarding.Source.RouterEvents,
  data: {
    id: 1,
    url: '/product/testProduct/something',
  },
}

const mockedNavigateFn = jest.fn(x => x)

jest.mock('../../../navigation/modal/hooks', () => ({
  useModalNavigation: () => ({
    navigate: mockedNavigateFn,
  }),
}))

describe('useOpenProductDetail', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should navigate to product detail', () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useOpenProductDetail(mockedBridgeAdapterApi))

    expect(mockedNavigateFn.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterEvent)

    expect(mockedNavigateFn.mock.calls).toHaveLength(1)

    const navigationResult = {
      screen: ProductDetailRouteConfig.name,
      params: {
        productCode: 'testProduct',
      },
    }

    expect(mockedNavigateFn.mock.results[0].value).toEqual(navigationResult)
  })

  test('Should throttle multiple router events', () => {
    const sendRouterEvent = mockListenerOnce(mockedBridgeAdapterApi.onRouterEvents)
    renderHook(() => useOpenProductDetail(mockedBridgeAdapterApi))

    expect(mockedNavigateFn.mock.calls).toHaveLength(0)

    sendRouterEvent.current?.(mockedRouterEvent)
    sendRouterEvent.current?.(mockedRouterEvent)
    sendRouterEvent.current?.(mockedRouterEvent)

    expect(mockedNavigateFn.mock.calls).toHaveLength(1)

    const navigationResult = {
      screen: ProductDetailRouteConfig.name,
      params: {
        productCode: 'testProduct',
      },
    }

    expect(mockedNavigateFn.mock.results[0].value).toEqual(navigationResult)
  })
})
