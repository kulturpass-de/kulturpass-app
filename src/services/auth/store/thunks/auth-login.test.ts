import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'

import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { ErrorWithCode } from '../../../errors/errors'
import { userSlice } from '../../../user/redux/user-slice'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { authCdcLogin } from './auth-cdc-login'
import { authCommerceLogin } from './auth-commerce-login'
import { authLogin } from './auth-login'

const server = setupServer()

describe('authLogin', () => {
  const cdcLoginArg = { loginId: 'MyLoginId', password: 'MyPassword' }
  const cdcLoginResult = { profile: { firstName: 'Tester' }, sessionInfo: {} }
  const commerceLoginResult = { auth_something: 'token' }

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
    server.use(rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(400), ctx.json(cdcLoginResult))))

    await store.dispatch(authLogin(cdcLoginArg))

    // find authLogin rejection, and check that it is ErrorWithCode
    const authLoginRejected = store.findAction(authLogin.rejected.match)
    expect(authLoginRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find authCdcLogin rejection, and check that it is the same as authLogin rejection
    const authCdcLoginRejected = store.findAction(authCdcLogin.rejected.match)
    expect(authLoginRejected?.payload).toEqual(authCdcLoginRejected?.payload)

    // check that authCommerceLogin was not executed
    store.expectActionNotDispatched(authCommerceLogin.pending.match)
  })

  it('should reject if authCommerceLogin rejects', async () => {
    server.use(
      rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(400), ctx.json(commerceLoginResult))),
    )

    await store.dispatch(authLogin(cdcLoginArg))

    // find authLogin rejection, and check that it is ErrorWithCode
    const authLoginRejected = store.findAction(authLogin.rejected.match)
    expect(authLoginRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find authCommerceLogin rejection, and check that it is the same as authLogin rejection
    const authCommerceLoginRejected = store.findAction(authCommerceLogin.rejected.match)
    expect(authLoginRejected?.payload).toEqual(authCommerceLoginRejected?.payload)
  })
})
