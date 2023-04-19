import { NetworkError } from '../../../errors/errors'
import { RootState } from '../../../redux/configure-store'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { authCommerceLogin } from '../thunks/auth-commerce-login'
import { onCdcSessionChangeEffect, onCdcSessionChangePredicate } from './on-cdc-session-change'

describe('onCdcSessionChange', () => {
  const irrelevantAction = { type: 'fake_action' }

  const authCdcState = {
    idToken: 'my_id_token',
    sessionToken: 'my_session_token',
    sessionSecret: 'my_session_secret',
    sessionValidity: -2,
  }

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('onCdcSessionChangePredicate', () => {
    it('should return false when cdc.idToken is changed from null to non-null', async () => {
      const previousState = { auth: { cdc: null } } as RootState
      const currentState = { auth: { cdc: authCdcState } } as RootState

      const willRunEffect = onCdcSessionChangePredicate(irrelevantAction, currentState, previousState)

      expect(willRunEffect).toBeFalsy()
    })

    it('should return true when cdc.idToken is changed from non-null to non-null', async () => {
      const previousState = { auth: { cdc: authCdcState } } as RootState
      const currentState = { auth: { cdc: { ...authCdcState, idToken: 'new_id_token' } } } as RootState

      const willRunEffect = onCdcSessionChangePredicate(irrelevantAction, currentState, previousState)

      expect(willRunEffect).toBeTruthy()
    })

    it('should return false when cdc.idToken is changed from non-null to non-null, but the session is not valid', async () => {
      const previousState = { auth: { cdc: authCdcState } } as RootState
      const currentState = { auth: { cdc: { idToken: 'new_id_token' } } } as RootState

      const willRunEffect = onCdcSessionChangePredicate(irrelevantAction, currentState, previousState)

      expect(willRunEffect).toBeFalsy()
    })
  })

  describe('onCdcSessionChangeEffect', () => {
    it('should not run authCommerceLogin when from state.auth.cdc is null', async () => {
      const store = configureMockStore({ preloadedState: { auth: { cdc: null } } as RootState })

      await onCdcSessionChangeEffect(irrelevantAction, store as any)

      store.expectActionNotDispatched(authCommerceLogin.pending.match)

      store.clearActions()
    })

    it('should run authCommerceLogin when from state.auth.cdc is not null', async () => {
      const store = configureMockStore({ preloadedState: { auth: { cdc: authCdcState } } as RootState })

      const promise = onCdcSessionChangeEffect(irrelevantAction, store as any)

      store.expectActions([{ type: authCommerceLogin.pending.type, meta: { arg: authCdcState } }])

      await expect(promise).rejects.toThrow(NetworkError)

      store.clearActions()
    })
  })
})
