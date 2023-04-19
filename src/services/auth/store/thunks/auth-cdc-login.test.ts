import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'

import { cdcApi } from '../../../api/cdc-api'
import * as sessionService from '../../../session/session-service'
import { ErrorWithCode } from '../../../errors/errors'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { authSlice } from '../auth-slice'
import { cdcLoginResponseToSessionData } from '../utils'
import { authCdcLogin } from './auth-cdc-login'

const server = setupServer()

describe('authCdcLogin', () => {
  const cdcLoginArg = { loginId: 'MyLoginId', password: 'MyPassword' }
  const cdcLoginResult = { profile: { firstName: 'Tester' }, sessionInfo: {}, id_token: 'my_token' }

  const store = configureMockStore({ middlewares: [cdcApi.middleware] })

  const persistCdcSesssion = jest.spyOn(sessionService, 'persistCdcSesssion')

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should call postLogin', async () => {
    server.use(rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))))

    await store.dispatch(authCdcLogin(cdcLoginArg))

    // find postLogin pending, and check that it was called with correct args
    const postLoginPending = store.findAction(cdcApi.endpoints.postLogin.matchPending)
    expect(postLoginPending?.meta.arg.originalArgs).toEqual(cdcLoginArg)
  })

  it('should call persistCdcSesssion with sessionData generated from postLogin', async () => {
    server.use(rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))))

    await store.dispatch(authCdcLogin(cdcLoginArg))

    // find postLogin fulfilled, and create the expected sessionData from it
    const postLoginFulfilled = store.findAction(cdcApi.endpoints.postLogin.matchFulfilled)
    const sessionData = cdcLoginResponseToSessionData(postLoginFulfilled!.payload)

    // check that persistCdcSesssion was called with sessionData
    expect(persistCdcSesssion).toHaveBeenCalledTimes(1)
    expect(persistCdcSesssion).toHaveBeenCalledWith(sessionData)
  })

  it('should call setCdcSession with sessionData generated from postLogin', async () => {
    server.use(rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))))

    await store.dispatch(authCdcLogin(cdcLoginArg))

    // find postLogin fulfilled, and create the expected sessionData from it
    const postLoginFulfilled = store.findAction(cdcApi.endpoints.postLogin.matchFulfilled)
    const sessionData = cdcLoginResponseToSessionData(postLoginFulfilled!.payload)

    // check that setCdcSession was called with sessionData
    store.expectActions([{ type: authSlice.actions.setCdcSession.type, payload: sessionData }])
  })

  it('should return sessionData generated from postLogin', async () => {
    server.use(rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(200), ctx.json(cdcLoginResult))))

    await store.dispatch(authCdcLogin(cdcLoginArg))

    // find postLogin fulfilled, and create the expected sessionData from it
    const postLoginFulfilled = store.findAction(cdcApi.endpoints.postLogin.matchFulfilled)
    const sessionData = cdcLoginResponseToSessionData(postLoginFulfilled!.payload)

    // check that authCdcLogin fulfilled was emitted with sessionData
    store.expectActions([{ type: authCdcLogin.fulfilled.type, payload: sessionData }])
  })

  it('should reject and not call persistCdcSesssion and setCdcSession, if postLogin rejects', async () => {
    server.use(rest.post('*/accounts.login', (_req, res, ctx) => res(ctx.status(400), ctx.json(cdcLoginResult))))

    await store.dispatch(authCdcLogin(cdcLoginArg))

    // find authLogin rejection, and check that it is ErrorWithCode
    const authCdcLoginRejected = store.findAction(authCdcLogin.rejected.match)
    expect(authCdcLoginRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find postLogin rejection, and check that it is the same as authCdcLogin rejection
    const postLoginRejected = store.findAction(cdcApi.endpoints.postLogin.matchRejected)
    expect(authCdcLoginRejected?.payload).toEqual(postLoginRejected?.payload)

    // check that persistCdcSesssion did not run
    expect(persistCdcSesssion).toHaveBeenCalledTimes(0)

    // check that setCdcSession did not run
    store.expectActionNotDispatched(authSlice.actions.setCdcSession.match)
  })
})
