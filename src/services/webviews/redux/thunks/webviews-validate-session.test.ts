import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { authCommerceRefreshSession } from '../../../auth/store/thunks/auth-commerce-refresh-session'
import { configureMockStore, mockedLoggedInAuthState } from '../../../testing/configure-mock-store'
import * as selectors from '../webviews-selectors'
import { webviewsAuthLogin } from './webviews-auth-login'
import { webviewsAuthLogout } from './webviews-auth-logout'
import { webviewsValidateSession } from './webviews-validate-session'

jest.mock('../webviews-selectors', () => ({
  selectWebViewAuthSyncAction: jest.fn(),
}))

describe('webviews-validate-session', () => {
  const server = setupServer()
  const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware] })

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  it('should dispatch webviewsAuthLogin if selectWebViewAuthSyncAction returns `webviewsAuthLogin`', async () => {
    jest.spyOn(selectors, 'selectWebViewAuthSyncAction').mockImplementation(() => {
      return { action: 'webviewsAuthLogin', validCommerceAccessToken: 'my_valid_access_token' }
    })

    await store.dispatch(webviewsValidateSession(WebViewId.Home))

    store.expectActions([
      {
        type: webviewsAuthLogin.pending.type,
        meta: { arg: { webViewId: WebViewId.Home, access_token: 'my_valid_access_token' } },
      },
    ])
  })

  it('should dispatch authCommerceRefreshSession if selectWebViewAuthSyncAction returns `authCommerceRefreshSession`', async () => {
    server.use(
      http.post('*/accounts.getAccountInfo', () => HttpResponse.json({ id_token: 'my_new_id_token' }, { status: 200 })),
      http.post('*/oauth/token', () => HttpResponse.json({}, { status: 200 })),
    )

    jest.spyOn(selectors, 'selectWebViewAuthSyncAction').mockImplementation(() => {
      return { action: 'authCommerceRefreshSession', cdcSessionData: mockedLoggedInAuthState.auth.cdc! }
    })

    await store.dispatch(webviewsValidateSession(WebViewId.Home))

    store.expectActions([
      { type: authCommerceRefreshSession.pending.type, meta: { arg: mockedLoggedInAuthState.auth.cdc } },
    ])
  })

  it('should dispatch webviewsAuthLogout if selectWebViewAuthSyncAction returns `webviewsAuthLogout`', async () => {
    jest.spyOn(selectors, 'selectWebViewAuthSyncAction').mockImplementation(() => {
      return { action: 'webviewsAuthLogout' }
    })

    await store.dispatch(webviewsValidateSession(WebViewId.Home))

    store.expectActions([{ type: webviewsAuthLogout.pending.type, meta: { arg: { webViewId: WebViewId.Home } } }])
  })
})
