import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { RootState } from '../../../redux/configure-store'
import { configureMockStore, mockedLoggedInAuthState } from '../../../testing/configure-mock-store'
import { authLogoutWithoutErrors } from './auth-logout'
import { authValidateSession } from './auth-validate-session'

const server = setupServer()

describe('authValidateSession', () => {
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
    server.use(
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('*/oauth/revoke', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: {
        auth: {
          cdc: { ...mockedLoggedInAuthState.auth.cdc, sessionValidity: 0 },
          commerce: mockedLoggedInAuthState.auth.commerce,
        },
      } as RootState,
    })

    await store.dispatch(authValidateSession())

    store.expectActions([{ type: authLogoutWithoutErrors.pending.type }])
  })

  it('should authLogoutWithoutErrors if current session is not valid but cdcSessionData exists', async () => {
    server.use(
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('*/oauth/revoke', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: { auth: { cdc: mockedLoggedInAuthState.auth.cdc, commerce: null } } as RootState,
    })

    await store.dispatch(authValidateSession())

    store.expectActions([{ type: authLogoutWithoutErrors.pending.type }])
  })

  it('should authLogoutWithoutErrors if current session is not valid but commerceSessionData exists', async () => {
    server.use(
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('*/oauth/revoke', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState: { auth: { cdc: null, commerce: mockedLoggedInAuthState.auth.commerce } } as RootState,
    })

    await store.dispatch(authValidateSession())

    store.expectActions([{ type: authLogoutWithoutErrors.pending.type }])
  })
})
