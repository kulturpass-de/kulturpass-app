import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { CDC_SESSION_EXPIRATION_INFINITE } from '../../../api/cdc-constants'
import { commerceApi } from '../../../api/commerce-api'
import { RootState } from '../../../redux/configure-store'
import { configureMockStore, mockedLoggedInAuthState } from '../../../testing/configure-mock-store'
import { isUserLoggedInToCommerce } from '../utils'
import { authCommerceRefreshSession } from './auth-commerce-refresh-session'
import { authLogoutWithoutErrors } from './auth-logout'
import { authValidateSession } from './auth-validate-session'

jest.useFakeTimers()

describe('authValidateSession', () => {
  const server = setupServer()

  const mockServer = () => {
    server.use(
      http.post('*/accounts.logout', () => HttpResponse.json({}, { status: 200 })),
      http.post('*/accounts.getAccountInfo', () => HttpResponse.json(null, { status: 400 })),
      http.post('*/oauth/revoke', () => HttpResponse.json({}, { status: 200 })),
    )
  }

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  it('should do nothing if current session is valid', async () => {
    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: mockedLoggedInAuthState,
    })

    await store.dispatch(authValidateSession())

    store.expectActionNotDispatched(authLogoutWithoutErrors.pending.match)
  })

  it('should authLogoutWithoutErrors if current session is not valid but cdcSessionData and commerceSessionData exists', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: {
        auth: {
          cdc: { ...mockedLoggedInAuthState.auth.cdc, sessionValidity: 1, sessionStartTimestamp: 0 },
          commerce: mockedLoggedInAuthState.auth.commerce,
        },
      } as RootState,
    })

    await store.dispatch(authValidateSession())

    store.expectActions([{ type: authLogoutWithoutErrors.pending.type }])
  })

  it('should authLogoutWithoutErrors if current session is not valid but cdcSessionData exists', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: { auth: { cdc: mockedLoggedInAuthState.auth.cdc, commerce: null } } as RootState,
    })

    await store.dispatch(authValidateSession())

    store.expectActions([{ type: authLogoutWithoutErrors.pending.type }])
  })

  it('should authLogoutWithoutErrors if current session is not valid but commerceSessionData exists and authCommerceRefreshSession fails', async () => {
    mockServer()

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: { auth: { cdc: null, commerce: mockedLoggedInAuthState.auth.commerce } } as RootState,
    })

    await store.dispatch(authValidateSession())

    store.expectActions([{ type: authLogoutWithoutErrors.pending.type }])
  })

  it('should authCommerceRefreshSession if current commerce session is not valid but the cdc session is valid', async () => {
    server.use(
      http.post('*/accounts.getAccountInfo', () => HttpResponse.json({ id_token: 'NEW_ID_TOKEN' }, { status: 200 })),
      http.post('*/authorizationserver/oauth/token', () =>
        HttpResponse.json(
          { access_token: 'forreal', token_type: 'bearer', expires_in: 43189, scope: 'basic openid' },
          { status: 200 },
        ),
      ),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: {
        auth: {
          cdc: { ...mockedLoggedInAuthState.auth.cdc, sessionValidity: CDC_SESSION_EXPIRATION_INFINITE },
          commerce: null,
        },
      } as RootState,
    })

    await store.dispatch(authValidateSession())

    store.expectActions([{ type: authCommerceRefreshSession.pending.type }])

    expect(isUserLoggedInToCommerce(store.getState().auth.commerce)).toBe(true)
  })
})
