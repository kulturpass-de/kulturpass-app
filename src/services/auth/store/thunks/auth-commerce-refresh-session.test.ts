import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { configureMockStore, mockedLoggedInAuthState } from '../../../testing/configure-mock-store'
import { authSlice } from '../auth-slice'
import { authCommerceLogin } from './auth-commerce-login'
import { authCommerceRefreshSession } from './auth-commerce-refresh-session'

jest.useFakeTimers()

describe('authValidateSession', () => {
  const server = setupServer()

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  it('should setCdcIdToken and authCommerceLogin with new idToken acquired by using getAccountInfo', async () => {
    server.use(
      http.post('*/accounts.getAccountInfo', () => HttpResponse.json({ id_token: 'new_id_token' }, { status: 200 })),
      http.post('*/oauth/token', () => HttpResponse.json({}, { status: 200 })),
    )

    const preloadedState = mockedLoggedInAuthState
    // Commerce must be logged out for a refresh to happen
    preloadedState.auth.commerce = null

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState,
    })

    await store.dispatch(authCommerceRefreshSession(mockedLoggedInAuthState.auth.cdc!))

    store.expectActions([
      { type: authSlice.actions.setCdcIdToken.type, payload: 'new_id_token' },
      {
        type: authCommerceLogin.pending.type,
        meta: { arg: { ...mockedLoggedInAuthState.auth.cdc, idToken: 'new_id_token' } },
      },
    ])
  })
})
