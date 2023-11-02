import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { cdcApi } from '../../../api/cdc-api'
import { ErrorWithCode } from '../../../errors/errors'
import * as sessionService from '../../../session/session-service'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { mockedCdcLoginResponse } from '../../../testing/test-utils'
import { authSlice } from '../auth-slice'
import { cdcLoginResponseToSessionData } from '../utils'
import { authCdcFinalizeRegistration } from './auth-cdc-finalize-registration'

const server = setupServer()

describe('authCdcFinalizeRegistration', () => {
  const cdcFinalizeRegistrationArg = { regToken: 'TEST' }
  const cdcFinalizeRegistrationResult = mockedCdcLoginResponse

  const store = configureMockStore({ middlewares: [cdcApi.middleware] })

  const persistCdcSession = jest.spyOn(sessionService, 'persistCdcSession')

  beforeAll(() => server.listen())
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => server.close())

  it('should call postFinalizeRegistration', async () => {
    server.use(
      http.post('*/accounts.finalizeRegistration', () =>
        HttpResponse.json(cdcFinalizeRegistrationResult, { status: 200 }),
      ),
    )

    await store.dispatch(authCdcFinalizeRegistration(cdcFinalizeRegistrationArg))

    // find postFinalizeRegistration pending, and check that it was called with correct args
    const postFinalizeRegistrationPending = store.findAction(cdcApi.endpoints.accountsFinalizeRegistration.matchPending)
    expect(postFinalizeRegistrationPending?.meta.arg.originalArgs).toEqual(cdcFinalizeRegistrationArg)
  })

  it('should call persistCdcSession with sessionData generated from postFinalizeRegistration', async () => {
    server.use(
      http.post('*/accounts.finalizeRegistration', () =>
        HttpResponse.json(cdcFinalizeRegistrationResult, { status: 200 }),
      ),
    )

    await store.dispatch(authCdcFinalizeRegistration(cdcFinalizeRegistrationArg))

    // find postFinalizeRegistration fulfilled, and create the expected sessionData from it
    const postFinalizeRegistrationFulfilled = store.findAction(
      cdcApi.endpoints.accountsFinalizeRegistration.matchFulfilled,
    )
    const sessionData = cdcLoginResponseToSessionData(postFinalizeRegistrationFulfilled!.payload)

    // check that persistCdcSession was called with sessionData
    expect(persistCdcSession).toHaveBeenCalledTimes(1)
    expect(persistCdcSession).toHaveBeenCalledWith(sessionData)
  })

  it('should call setCdcSession with sessionData generated from postFinalizeRegistration', async () => {
    server.use(
      http.post('*/accounts.finalizeRegistration', () =>
        HttpResponse.json(cdcFinalizeRegistrationResult, { status: 200 }),
      ),
    )

    await store.dispatch(authCdcFinalizeRegistration(cdcFinalizeRegistrationArg))

    // find postFinalizeRegistration fulfilled, and create the expected sessionData from it
    const postFinalizeRegistrationFulfilled = store.findAction(
      cdcApi.endpoints.accountsFinalizeRegistration.matchFulfilled,
    )
    const sessionData = cdcLoginResponseToSessionData(postFinalizeRegistrationFulfilled!.payload)

    // check that setCdcSession was called with sessionData
    store.expectActions([{ type: authSlice.actions.setCdcSession.type, payload: sessionData }])
  })

  it('should return sessionData generated from postFinalizeRegistration', async () => {
    server.use(
      http.post('*/accounts.finalizeRegistration', () =>
        HttpResponse.json(cdcFinalizeRegistrationResult, { status: 200 }),
      ),
    )

    await store.dispatch(authCdcFinalizeRegistration(cdcFinalizeRegistrationArg))

    // find postFinalizeRegistration fulfilled, and create the expected sessionData from it
    const postFinalizeRegistrationFulfilled = store.findAction(
      cdcApi.endpoints.accountsFinalizeRegistration.matchFulfilled,
    )
    const sessionData = cdcLoginResponseToSessionData(postFinalizeRegistrationFulfilled!.payload)

    // check that authCdcFinalizeRegistration fulfilled was emitted with sessionData
    store.expectActions([{ type: authCdcFinalizeRegistration.fulfilled.type, payload: sessionData }])
  })

  it('should reject and not call persistCdcSession and setCdcSession, if postFinalizeRegistration rejects', async () => {
    server.use(
      http.post('*/accounts.finalizeRegistration', () =>
        HttpResponse.json(cdcFinalizeRegistrationResult, { status: 400 }),
      ),
    )

    await store.dispatch(authCdcFinalizeRegistration(cdcFinalizeRegistrationArg))

    // find authCdcFinalizeRegistration rejection, and check that it is ErrorWithCode
    const authCdcFinalizeRegistrationRejected = store.findAction(authCdcFinalizeRegistration.rejected.match)
    expect(authCdcFinalizeRegistrationRejected?.payload).toBeInstanceOf(ErrorWithCode)

    // find postFinalizeRegistration rejection, and check that it is the same as authCdcFinalizeRegistration rejection
    const postFinalizeRegistrationRejected = store.findAction(
      cdcApi.endpoints.accountsFinalizeRegistration.matchRejected,
    )
    expect(authCdcFinalizeRegistrationRejected?.payload).toEqual(postFinalizeRegistrationRejected?.payload)

    // check that persistCdcSession did not run
    expect(persistCdcSession).toHaveBeenCalledTimes(0)

    // check that setCdcSession did not run
    store.expectActionNotDispatched(authSlice.actions.setCdcSession.match)
  })
})
