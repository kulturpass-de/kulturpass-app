import { authSlice } from '../../../auth/store/auth-slice'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { userSlice } from '../../../user/redux/user-slice'
import * as sessionService from '../../session-service'
import { CdcSessionData, CommerceSessionData } from '../../types'
import { restoreSession } from './restore-session'

describe('restore-session', () => {
  const store = configureMockStore({ middlewares: [] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  describe('when appFirstRun is true', () => {
    it('should call clearCdcSession and clearCommerceSession', async () => {
      const clearCdcSession = jest.spyOn(sessionService, 'clearCdcSession')
      const clearCommerceSession = jest.spyOn(sessionService, 'clearCommerceSession')

      await store.dispatch(restoreSession({ appFirstRun: true }))

      expect(clearCdcSession).toBeCalledTimes(1)
      expect(clearCommerceSession).toBeCalledTimes(1)
    })

    it('should re-throw if clearCdcSession throws an error', async () => {
      const clearCdcSession = jest.spyOn(sessionService, 'clearCdcSession').mockImplementation(() => {
        throw new Error('my_error')
      })
      const clearCommerceSession = jest.spyOn(sessionService, 'clearCommerceSession')

      await store.dispatch(restoreSession({ appFirstRun: true }))

      expect(clearCdcSession).toBeCalledTimes(1)
      expect(clearCommerceSession).toBeCalledTimes(0)

      const restoreSessionRejected = store.findAction(restoreSession.rejected.match)
      expect(restoreSessionRejected?.payload).toBeInstanceOf(Error)
    })
  })

  describe('when appFirstRun is false', () => {
    const cdcSessionData = {
      sessionToken: 'fake_session_token',
      user: { firstName: 'my_first_name' },
    } as CdcSessionData

    const commerceSessionData = {
      access_token: 'fake_access_token',
    } as CommerceSessionData

    it('should set session info to current redux store', async () => {
      jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(cdcSessionData))
      jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(commerceSessionData))

      await store.dispatch(restoreSession({ appFirstRun: false }))

      store.expectActions([
        { type: authSlice.actions.setCdcSession.type, payload: cdcSessionData },
        { type: authSlice.actions.setCommerceSession.type, payload: commerceSessionData },
        { type: userSlice.actions.setUserProfile.type, payload: cdcSessionData.user },
      ])
    })

    it('should not set session info to current redux store, when cdcSessionData is null', async () => {
      jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(null))
      jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(commerceSessionData))

      await store.dispatch(restoreSession({ appFirstRun: false }))

      store.expectActionNotDispatched(authSlice.actions.setCdcSession.match)
      store.expectActionNotDispatched(authSlice.actions.setCommerceSession.match)
      store.expectActionNotDispatched(userSlice.actions.setUserProfile.match)
    })

    it('should not set session info to current redux store, when commerceSessionData is null', async () => {
      jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(cdcSessionData))
      jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(null))

      await store.dispatch(restoreSession({ appFirstRun: false }))

      store.expectActionNotDispatched(authSlice.actions.setCdcSession.match)
      store.expectActionNotDispatched(authSlice.actions.setCommerceSession.match)
      store.expectActionNotDispatched(userSlice.actions.setUserProfile.match)
    })
  })
})
