import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { ErrorWithCode } from '../../../errors/errors'
import { configureMockStore, mockedLoggedInAuthState } from '../../../testing/configure-mock-store'
import { userSlice } from '../../../user/redux/user-slice'
import { authCdcFinalizeRegistration } from './auth-cdc-finalize-registration'
import { authCommerceLogin } from './auth-commerce-login'
import { authFinalizeRegistration } from './auth-finalize-registration'
import { authLogout } from './auth-logout'

const server = setupServer()

describe('authFinalizeRegistration', () => {
  const finalizeRegistrationArg = {
    url: new URL('https://localhost/redirect/email-verification?regToken=TEST'),
  }
  const cdcFinalizeRegistrationResult = {
    profile: { firstName: 'Tester' },
    sessionInfo: { sessionToken: 'MySessionToken', sessionSecret: 'MySessionSeecret' },
  }
  const commerceLoginResult = mockedLoggedInAuthState.auth.commerce

  const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware] })

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should call authFinalizeRegistration with the provided info', async () => {
    server.use(
      rest.post('*/accounts.finalizeRegistration', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(cdcFinalizeRegistrationResult)),
      ),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
      rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    await store.dispatch(authFinalizeRegistration(finalizeRegistrationArg))

    store.expectActions([{ type: authFinalizeRegistration.fulfilled.type, meta: { arg: finalizeRegistrationArg } }])
  })

  it('should call authCommerceLogin with info returned by authFinalizeRegistration', async () => {
    server.use(
      rest.post('*/accounts.finalizeRegistration', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(cdcFinalizeRegistrationResult)),
      ),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
      rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    await store.dispatch(authFinalizeRegistration(finalizeRegistrationArg))

    // find the result of authCdcFinalizeRegistration
    // and check that authCommerceLogin was called with properties from the result
    const finalizeRegistrationFulfilled = store.findAction(authCdcFinalizeRegistration.fulfilled.match)
    store.expectActions([
      { type: authCommerceLogin.pending.type, meta: { arg: finalizeRegistrationFulfilled?.payload } },
    ])
  })

  it('should call userSlice.setUser with info returned by authFinalizeRegistration', async () => {
    server.use(
      rest.post('*/accounts.finalizeRegistration', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(cdcFinalizeRegistrationResult)),
      ),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
      rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    await store.dispatch(authFinalizeRegistration(finalizeRegistrationArg))

    // find the result of authCdcFinalizeRegistration, and check that setUser was called with properties from the result
    const finalizeRegistrationFulfilled = store.findAction(authCdcFinalizeRegistration.fulfilled.match)
    const setUserArg = { firstName: finalizeRegistrationFulfilled?.payload.user.firstName }
    store.expectActions([{ type: userSlice.actions.setUserProfile.type, payload: setUserArg }])
  })

  it('should call getProfile once to update verification status', async () => {
    let called = 0

    server.use(
      rest.post('*/accounts.finalizeRegistration', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(cdcFinalizeRegistrationResult)),
      ),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))),
      rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
        called += 1
        return res(ctx.status(200), ctx.json({}))
      }),
    )

    await store.dispatch(authFinalizeRegistration(finalizeRegistrationArg))

    expect(called).toBe(1)
  })

  it('should reject and not call authFinalizeRegistration if authCdcFinalizeRegistration rejects', async () => {
    server.use(
      rest.post('*/accounts.finalizeRegistration', (_req, res, ctx) =>
        res(ctx.status(400), ctx.json(cdcFinalizeRegistrationResult)),
      ),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    await store.dispatch(authFinalizeRegistration(finalizeRegistrationArg))

    // find authFinalizeRegistration rejection, and check that it is ErrorWithCode
    const authFinalizeRegistrationRejected = store.findAction(authFinalizeRegistration.rejected.match)
    expect(authFinalizeRegistrationRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find authCdcFinalizeRegistration rejection, and check that it is the same as authFinalizeRegistration rejection
    const authCdcFinalizeRegistrationRejected = store.findAction(authCdcFinalizeRegistration.rejected.match)
    expect(authFinalizeRegistrationRejected?.payload).toEqual(authCdcFinalizeRegistrationRejected?.payload)

    // check that authCommerceLogin was not executed
    store.expectActionNotDispatched(authCommerceLogin.pending.match)

    // check that authLogout was executed
    store.expectActions([{ type: authLogout.pending.type }])
  })

  it('should reject if authCommerceLogin rejects', async () => {
    server.use(
      rest.post('*/accounts.finalizeRegistration', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(cdcFinalizeRegistrationResult)),
      ),
      rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(400), ctx.json(commerceLoginResult))),
      rest.post('*/accounts.logout', (_req, res, ctx) => res(ctx.status(200), ctx.json({}))),
    )

    await store.dispatch(authFinalizeRegistration(finalizeRegistrationArg))

    // find authFinalizeRegistration rejection, and check that it is ErrorWithCode
    const authFinalizeRegistrationRejected = store.findAction(authFinalizeRegistration.rejected.match)
    expect(authFinalizeRegistrationRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find authCommerceLogin rejection, and check that it is the same as authFinalizeRegistration rejection
    const authCommerceLoginRejected = store.findAction(authCommerceLogin.rejected.match)
    expect(authFinalizeRegistrationRejected?.payload).toEqual(authCommerceLoginRejected?.payload)

    // check that authLogout was executed
    store.expectActions([{ type: authLogout.pending.type }])
  })

  it('should reject if url has no regToken', async () => {
    await store.dispatch(
      authFinalizeRegistration({
        url: new URL('https://localhost/redirect/email-verification'),
      }),
    )

    const authFinalizeRegistrationRejected = store.findAction(authFinalizeRegistration.rejected.match)
    expect(authFinalizeRegistrationRejected?.payload).toBeInstanceOf(ErrorWithCode)
  })

  it('should reject if url is no email verification completion url', async () => {
    await store.dispatch(
      authFinalizeRegistration({
        url: new URL('https://localhost/redirect'),
      }),
    )

    const authFinalizeRegistrationRejected = store.findAction(authFinalizeRegistration.rejected.match)
    expect(authFinalizeRegistrationRejected?.payload).toBeInstanceOf(ErrorWithCode)
  })
})
