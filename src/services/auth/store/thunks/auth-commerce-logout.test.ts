import { commerceApi } from '../../../api/commerce-api'
import * as sessionService from '../../../session/session-service'
import { ErrorWithCode } from '../../../errors/errors'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { authSlice } from '../auth-slice'
import { authCommerceLogout } from './auth-commerce-logout'

describe('authCommerceLogut', () => {
  const store = configureMockStore({ middlewares: [commerceApi.middleware] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should call authSlice.clearCommerceSession and sessionService.clearCommerceSession', async () => {
    const clearCommerceSession = jest.spyOn(sessionService, 'clearCommerceSession')

    await store.dispatch(authCommerceLogout())

    store.expectActions([{ type: authSlice.actions.clearCommerceSession.type }])
    expect(clearCommerceSession).toHaveBeenCalledTimes(1)
  })

  it('should return error as payload, of a deeply nested thrown error, and break', async () => {
    const myError = new ErrorWithCode('I am broken...')

    jest.spyOn(sessionService, 'clearCommerceSession').mockImplementation(() => {
      throw myError
    })

    await store.dispatch(authCommerceLogout())

    const authCommerceLogoutRejected = store.findAction(authCommerceLogout.rejected.match)
    expect(authCommerceLogoutRejected?.payload).toEqual(myError)
  })
})
