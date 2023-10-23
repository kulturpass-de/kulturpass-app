import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { ErrorWithCode } from '../../../errors/errors'
import { configureMockStore, mockedLoggedInAuthState } from '../../../testing/configure-mock-store'
import { mockedCdcLoginResponse } from '../../../testing/test-utils'
import { userSlice } from '../../../user/redux/user-slice'
import { authCdcLogin } from './auth-cdc-login'
import { authCommerceLogin } from './auth-commerce-login'
import { authLogin } from './auth-login'
import { authLogout } from './auth-logout'

const server = setupServer()

describe('authLogin', () => {
  const cdcLoginArg = { loginID: 'MyLoginId', password: 'MyPassword' }
  const cdcLoginResult = mockedCdcLoginResponse
  const commerceLoginResult = mockedLoggedInAuthState.auth.commerce

  const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware] })

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should call authCdcLogin with the provided info', async () => {
    server.use(
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
    )

    await store.dispatch(authLogin(cdcLoginArg))

    // check that authCdcLogin was called, with proprties that were given to authLogin
    store.expectActions([{ type: authCdcLogin.pending.type, meta: { arg: cdcLoginArg } }])
  })

  it('should call authCommerceLogin with info returned by authCdcLogin', async () => {
    server.use(
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
    )

    await store.dispatch(authLogin(cdcLoginArg))

    // find the result of authCdcLogin, and check that authCommerceLogin was called with properties from the result
    const authCdcLoginFulfilled = store.findAction(authCdcLogin.fulfilled.match)
    store.expectActions([{ type: authCommerceLogin.pending.type, meta: { arg: authCdcLoginFulfilled?.payload } }])
  })

  it('should call userSlice.setUser  with info returned by authCdcLogin', async () => {
    server.use(
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
    )

    await store.dispatch(authLogin(cdcLoginArg))

    // find the result of authCdcLogin, and check that setUser was called with properties from the result
    const authCdcLoginFulfilled = store.findAction(authCdcLogin.fulfilled.match)
    const setUserArg = { firstName: authCdcLoginFulfilled?.payload.user.firstName }
    store.expectActions([{ type: userSlice.actions.setUserProfile.type, payload: setUserArg }])
  })

  it('should reject and not call authCommerceLogin if authCdcLogin rejects', async () => {
    server.use(
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(400), ctx.json(cdcLoginResult))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(200))),
    )

    await store.dispatch(authLogin(cdcLoginArg))

    // find authLogin rejection, and check that it is ErrorWithCode
    const authLoginRejected = store.findAction(authLogin.rejected.match)
    expect(authLoginRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find authCdcLogin rejection, and check that it is the same as authLogin rejection
    const authCdcLoginRejected = store.findAction(authCdcLogin.rejected.match)
    expect(authLoginRejected?.payload).toEqual(authCdcLoginRejected?.payload)

    // check that authCommerceLogin was not executed
    store.expectActionNotDispatched(authCommerceLogin.pending.match)

    // check that authLogout was executed
    store.expectActions([{ type: authLogout.pending.type }])
  })

  it('should reject if authCommerceLogin rejects', async () => {
    server.use(
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(400), ctx.json(commerceLoginResult))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
      rest.post('http://localhost/authorizationserver/oauth/revoke', (_req, res, ctx) => res(ctx.status(200))),
    )

    await store.dispatch(authLogin(cdcLoginArg))

    // find authLogin rejection, and check that it is ErrorWithCode
    const authLoginRejected = store.findAction(authLogin.rejected.match)
    expect(authLoginRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find authCommerceLogin rejection, and check that it is the same as authLogin rejection
    const authCommerceLoginRejected = store.findAction(authCommerceLogin.rejected.match)
    expect(authLoginRejected?.payload).toEqual(authCommerceLoginRejected?.payload)

    // check that authLogout was executed
    store.expectActions([{ type: authLogout.pending.type }])
  })
})
