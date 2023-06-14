import { cdcApi } from '../../../api/cdc-api'
import * as sessionService from '../../../session/session-service'
import { ErrorWithCode } from '../../../errors/errors'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { authSlice } from '../auth-slice'
import { authCdcLogout } from './auth-cdc-logout'

describe('authCdcLogut', () => {
  const store = configureMockStore({ middlewares: [cdcApi.middleware] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should call authSlice.clearCdcSession and sessionService.clearCdcSession', async () => {
    const clearCdcSession = jest.spyOn(sessionService, 'clearCdcSession')

    const apiErrors: any[] = []
    await store.dispatch(authCdcLogout(apiErrors))

    store.expectActions([{ type: authSlice.actions.clearCdcSession.type }])
    expect(clearCdcSession).toHaveBeenCalledTimes(1)
    expect(apiErrors.length).toBe(0)
  })

  it('should return error as payload, of a deeply nested thrown error, and break', async () => {
    const myError = new ErrorWithCode('I am broken...')

    jest.spyOn(sessionService, 'clearCdcSession').mockImplementation(() => {
      throw myError
    })

    const apiErrors: any[] = []
    await store.dispatch(authCdcLogout(apiErrors))

    const authCdcLogoutRejected = store.findAction(authCdcLogout.rejected.match)
    expect(authCdcLogoutRejected?.payload).toEqual(myError)
    expect(apiErrors.length).toBe(0)
  })

  it('should not throw an error if accountsLogoutSigned fails', async () => {
    const myError = new ErrorWithCode('I am broken...')

    jest.spyOn(cdcApi.endpoints.accountsLogoutSigned, 'initiate').mockImplementation(() => {
      throw myError
    })

    const apiErrors: any[] = []
    await store.dispatch(authCdcLogout(apiErrors))

    const authCdcLogoutRejected = store.findAction(authCdcLogout.rejected.match)
    expect(authCdcLogoutRejected).toBe(undefined)
    expect(apiErrors.length).toBe(0)
  })
})
