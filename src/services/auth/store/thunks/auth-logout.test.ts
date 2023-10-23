import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { ErrorWithCode } from '../../../errors/errors'
import { RootState } from '../../../redux/configure-store'
import * as sessionService from '../../../session/session-service'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { userSlice } from '../../../user/redux/user-slice'
import { authCdcLogout } from './auth-cdc-logout'
import { authCommerceLogout } from './auth-commerce-logout'
import { authLogout, authLogoutWithoutErrors } from './auth-logout'

const server = setupServer()

describe('authLogout', () => {
  const preloadedState = {
    auth: {
      cdc: {
        idToken: 'my_id_token',
        sessionToken: 'my_session_token',
        sessionSecret: 'my_session_secret',
        sessionValidity: -2,
      },
      commerce: {
        access_token: 'my_access_token',
      },
    },
  } as RootState

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
  })
  afterAll(() => server.close())

  it('should call authCdcLogout, authCommerceLogout and clearUser', async () => {
    server.use(
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(200))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState,
    })

    await store.dispatch(authLogout())

    store.expectActions([{ type: authCdcLogout.pending.type }])
    store.expectActions([{ type: authCommerceLogout.pending.type }])
    store.expectActions([{ type: userSlice.actions.clearUser.type }])
  })

  it('should return error as payload, of a deeply nested thrown error, and break', async () => {
    server.use(
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(200))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState,
    })

    const myError = new ErrorWithCode('I am broken...')

    jest.spyOn(sessionService, 'clearCdcSession').mockImplementation(() => {
      throw myError
    })

    await store.dispatch(authLogout())

    const authCdcLogoutRejected = store.findAction(authCdcLogout.rejected.match)
    expect(authCdcLogoutRejected?.payload).toEqual(myError)

    store.expectActionNotDispatched(authCommerceLogout.pending.match)
    store.expectActionNotDispatched(userSlice.actions.clearUser.match)
  })

  it('should throw error if authCdcLogout api call throws', async () => {
    server.use(
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(200))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(400), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState,
    })

    await store.dispatch(authLogout())

    const authLogoutRejected = store.findAction(authLogout.rejected.match)
    expect(authLogoutRejected?.payload).toBeInstanceOf(ErrorWithCode)

    store.expectActions([{ type: authCdcLogout.fulfilled.type }])
    store.expectActions([{ type: authCommerceLogout.fulfilled.type }])
    store.expectActions([{ type: userSlice.actions.clearUser.type }])
  })

  it('should throw error if authCommerceLogout api call throws', async () => {
    server.use(
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(400))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState,
    })

    await store.dispatch(authLogout())

    const authLogoutRejected = store.findAction(authLogout.rejected.match)
    expect(authLogoutRejected?.payload).toBeInstanceOf(ErrorWithCode)

    store.expectActions([{ type: authCdcLogout.fulfilled.type }])
    store.expectActions([{ type: authCommerceLogout.fulfilled.type }])
    store.expectActions([{ type: userSlice.actions.clearUser.type }])
  })

  it('should throw error if authCdcLogout and authCommerceLogout api calls throw', async () => {
    server.use(
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(400))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(400), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState,
    })

    await store.dispatch(authLogout())

    const authLogoutRejected = store.findAction(authLogout.rejected.match)
    expect(authLogoutRejected?.payload).toBeInstanceOf(ErrorWithCode)

    store.expectActions([{ type: authCdcLogout.fulfilled.type }])
    store.expectActions([{ type: authCommerceLogout.fulfilled.type }])
    store.expectActions([{ type: userSlice.actions.clearUser.type }])
  })

  it('authLogoutWithoutErrors should not throw any API error', async () => {
    server.use(
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(400))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(400), ctx.json({}))),
    )

    const store = configureMockStore({
      middlewares: [cdcApi.middleware, commerceApi.middleware],
      preloadedState,
    })

    const warnSpy = jest.spyOn(global.console, 'warn').mockImplementationOnce(() => {})

    await store.dispatch(authLogoutWithoutErrors())

    const authLogoutRejected = store.findAction(authLogout.rejected.match)
    expect(authLogoutRejected?.payload).toBeInstanceOf(ErrorWithCode)

    expect(warnSpy.mock.lastCall?.[0]).toBe('authLogout failed with error')

    store.expectActions([{ type: authLogoutWithoutErrors.fulfilled.type }])
    store.expectActions([{ type: authCdcLogout.fulfilled.type }])
    store.expectActions([{ type: authCommerceLogout.fulfilled.type }])
    store.expectActions([{ type: userSlice.actions.clearUser.type }])
  })
})
