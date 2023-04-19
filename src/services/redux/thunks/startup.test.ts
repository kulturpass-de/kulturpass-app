import { restoreSession } from '../../session/redux/thunks/restore-session'
import { configureMockStore } from '../../testing/configure-mock-store'
import { installationSlice } from '../slices/installation'
import { startup } from './startup'

describe('startup', () => {
  const store = configureMockStore({ middlewares: [] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should dispatch restoreSession', async () => {
    await store.dispatch(startup({ appFirstRun: false }))

    store.expectActions([{ type: restoreSession.pending.type }])
  })

  it('should dispatch restoreSession and setInstalled, when appFirstRun is true', async () => {
    await store.dispatch(startup({ appFirstRun: true }))

    store.expectActions([{ type: restoreSession.pending.type }])
    store.expectActions([{ type: installationSlice.actions.setInstalled.type }])
  })
})
