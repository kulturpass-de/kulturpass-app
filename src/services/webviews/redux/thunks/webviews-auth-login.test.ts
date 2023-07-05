import { SpartacusBridge } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { webviewsSlice } from '../webviews-slice'
import { webviewsAuthLogin } from './webviews-auth-login'

jest.mock('../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter', () => ({
  webViewBridgeAdapter: {
    callBridgeFunction: jest.fn(),
  },
}))

describe('webviews-auth-login', () => {
  const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should call bridgeAdapterApi.authLogin and setWebViewState with the provided info', async () => {
    await store.dispatch(webviewsAuthLogin({ webViewId: WebViewId.Search, access_token: 'my_access_token' }))

    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledTimes(1)
    expect(webViewBridgeAdapter.callBridgeFunction).toHaveBeenCalledWith(
      WebViewId.Search,
      SpartacusBridge.FunctionCall.Target.AuthLogin,
      [{ access_token: 'my_access_token' }],
    )

    store.expectActions([
      {
        type: webviewsSlice.actions.setWebViewState.type,
        payload: { webViewId: WebViewId.Search, state: { lastAccessToken: 'my_access_token' } },
      },
    ])
  })
})
