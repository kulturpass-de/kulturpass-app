import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import * as sessionService from '../../../session/session-service'
import { ErrorWithCode } from '../../../errors/errors'
import { userSlice } from '../../../user/redux/user-slice'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { authCdcLogout } from './auth-cdc-logout'
import { authCommerceLogout } from './auth-commerce-logout'
import { authLogout } from './auth-logout'

describe('authLogut', () => {
  const store = configureMockStore({ middlewares: [cdcApi.middleware, commerceApi.middleware] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should call authCdcLogout, authCommerceLogout and clearUser', async () => {
    await store.dispatch(authLogout())

    store.expectActions([{ type: authCdcLogout.pending.type }])
    store.expectActions([{ type: authCommerceLogout.pending.type }])
    store.expectActions([{ type: userSlice.actions.clearUser.type }])
  })

  it('should return error as payload, of a deeply nested thrown error, and break', async () => {
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
})
