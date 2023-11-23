import { configureMockStore } from '../../../testing/configure-mock-store'
import * as sessionService from '../../session-service'
import { clearSecurePersistedSession } from './clear-secure-persisted-session'

describe('clear-secure-persisted-session', () => {
  const store = configureMockStore({ middlewares: [] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should call clearCdcSession and clearCommerceSession', async () => {
    const clearCdcSession = jest.spyOn(sessionService, 'clearCdcSession').mockImplementation(() => Promise.resolve())
    const clearCommerceSession = jest
      .spyOn(sessionService, 'clearCommerceSession')
      .mockImplementation(() => Promise.resolve())
    const clearUserLocation = jest
      .spyOn(sessionService, 'clearUserLocation')
      .mockImplementation(() => Promise.resolve())

    await store.dispatch(clearSecurePersistedSession())

    expect(clearCdcSession).toHaveBeenCalledTimes(1)
    expect(clearCommerceSession).toHaveBeenCalledTimes(1)
    expect(clearUserLocation).toHaveBeenCalledTimes(1)
  })
})
