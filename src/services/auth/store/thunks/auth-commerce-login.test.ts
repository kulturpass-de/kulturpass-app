import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { commerceApi } from '../../../api/commerce-api'
import * as sessionService from '../../../session/session-service'
import { ErrorWithCode } from '../../../errors/errors'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { authSlice } from '../auth-slice'
import { authCommerceLogin } from './auth-commerce-login'

const server = setupServer()

describe('authCommerceLogin', () => {
  const commerceLoginArg = {
    sessionStartTimestamp: 1234567890,
    idToken: 'my_super_token',
    uid: 'my_uid',
    uidSignature: 'my_uid_signature',
  }
  const commerceLoginResult = { auth_something: 'token' }

  const persistCommerceSession = jest.spyOn(sessionService, 'persistCommerceSession')

  const store = configureMockStore({ middlewares: [commerceApi.middleware] })

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should call postAuthToken', async () => {
    server.use(rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))))

    await store.dispatch(authCommerceLogin(commerceLoginArg))

    // find postAuthToken pending, and check that it was called with correct args
    const postAuthTokenPending = store.findAction(commerceApi.endpoints.postAuthToken.matchPending)
    expect(postAuthTokenPending?.meta.arg.originalArgs).toMatchObject({
      UID: commerceLoginArg.uid,
      UIDSignature: commerceLoginArg.uidSignature,
      id_token: commerceLoginArg.idToken,
      signatureTimestamp: commerceLoginArg.sessionStartTimestamp,
    })
  })

  it('should call persistCommerceSession with data returned from postAuthToken', async () => {
    server.use(rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))))

    await store.dispatch(authCommerceLogin(commerceLoginArg))

    // find postAuthToken fulfilled, and check that persistCommerceSession was called with the results
    const postAuthTokenFulfilled = store.findAction(commerceApi.endpoints.postAuthToken.matchFulfilled)
    expect(persistCommerceSession).toHaveBeenCalledTimes(1)
    expect(persistCommerceSession).toHaveBeenCalledWith(postAuthTokenFulfilled?.payload)
  })

  it('should call setCommerceSession with data returned from postAuthToken', async () => {
    server.use(rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))))

    await store.dispatch(authCommerceLogin(commerceLoginArg))

    // find postAuthToken fulfilled, and check that setCommerceSession was called with the returned data
    const postAuthTokenFulfilled = store.findAction(commerceApi.endpoints.postAuthToken.matchFulfilled)
    store.expectActions([{ type: authSlice.actions.setCommerceSession.type, payload: postAuthTokenFulfilled?.payload }])
  })

  it('should return the response of postAuthToken', async () => {
    server.use(rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(200), ctx.json(commerceLoginResult))))

    await store.dispatch(authCommerceLogin(commerceLoginArg))

    // find postAuthToken fulfilled, and check that authCommerceLogin fulfilled was emitted
    const postAuthTokenFulfilled = store.findAction(commerceApi.endpoints.postAuthToken.matchFulfilled)
    store.expectActions([{ type: authCommerceLogin.fulfilled.type, payload: postAuthTokenFulfilled?.payload }])
  })

  it('should reject and not call persistCommerceSession and setCommerceSession, if postAuthToken rejects', async () => {
    server.use(rest.post('*/oauth/token', (_req, res, ctx) => res(ctx.status(400), ctx.json(commerceLoginResult))))

    await store.dispatch(authCommerceLogin(commerceLoginArg))

    // find authLogin rejection, and check that it is ErrorWithCode
    const authCommerceLoginRejected = store.findAction(authCommerceLogin.rejected.match)
    expect(authCommerceLoginRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find postAuthToken rejection, and check that it is the same as authCommerceLogin rejection
    const postAuthTokenRejected = store.findAction(commerceApi.endpoints.postAuthToken.matchRejected)
    expect(authCommerceLoginRejected?.payload).toEqual(postAuthTokenRejected?.payload)

    // check that persistCommerceSession did not run
    expect(persistCommerceSession).toHaveBeenCalledTimes(0)

    // check that setCommerceSession did not run
    store.expectActionNotDispatched(authSlice.actions.setCommerceSession.match)
  })
})
