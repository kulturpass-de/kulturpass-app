import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { authValidateSession } from '../../auth/store/thunks/auth-validate-session'
import { refreshLocation } from '../../location/redux/thunks/refresh-location'
import { clearSecurePersistedSession } from '../../session/redux/thunks/clear-secure-persisted-session'
import { restoreSession } from '../../session/redux/thunks/restore-session'
import { configureMockStore } from '../../testing/configure-mock-store'
import { persistedAppCoreSlice } from '../slices/persisted-app-core'
import { pollAppConfig, pollAppConfigSubscription } from './poll-app-config'
import { startup } from './startup'

describe('startup', () => {
  const server = setupServer()

  const mockServer = () => {
    server.use(http.get('http://localhost/appConfig/url', () => HttpResponse.text('', { status: 200 })))
  }

  const store = configureMockStore()

  beforeAll(() => {
    jest.useFakeTimers()
    server.listen()
  })
  afterEach(() => {
    jest.resetAllMocks()
    server.resetHandlers()
    store.clearActions()
  })
  afterAll(() => {
    server.close()
    jest.useRealTimers()
  })

  it('should dispatch restoreSession, when appFirstRun is false', async () => {
    mockServer()

    await store.dispatch(startup({ appFirstRun: false }))

    store.expectActions([
      { type: restoreSession.pending.type },
      { type: authValidateSession.pending.type },
      { type: refreshLocation.pending.type },
      { type: pollAppConfig.pending.type },
    ])

    pollAppConfigSubscription?.unsubscribe()
  })

  it('should dispatch clearSecurePersistedSession, when appFirstRun is true', async () => {
    mockServer()

    await store.dispatch(startup({ appFirstRun: true }))

    store.expectActions([
      { type: clearSecurePersistedSession.pending.type },
      { type: persistedAppCoreSlice.actions.setIsBootstrapped.type },
      { type: refreshLocation.pending.type },
      { type: pollAppConfig.pending.type },
    ])

    pollAppConfigSubscription?.unsubscribe()
  })
})
