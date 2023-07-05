import { SpartacusBridge } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { webviewsAuthLogout } from './webviews-auth-logout'

jest.mock('../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter', () => ({
  webViewBridgeAdapter: {
    callBridgeFunction: jest.fn(),
  },
}))

describe('webviews-auth-logout', () => {
  const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should call bridgeAdapterApi.authLogout with the provided info', async () => {
    await store.dispatch(webviewsAuthLogout({ webViewId: WebViewId.Home }))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(1)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Home,
      SpartacusBridge.FunctionCall.Target.AuthLogout,
      [],
    )
  })
})
