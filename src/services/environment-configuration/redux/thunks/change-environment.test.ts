import { authLogout } from '../../../auth/store/thunks/auth-logout'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { setEnvironmentConfiguration } from '../environment-configuration-slice'
import { changeEnvironment } from './change-environment'

describe('changeEnvironment', () => {
  const store = configureMockStore({ middlewares: [] })

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should dispatch setEnvironmentConfiguration and authLogout', async () => {
    await store.dispatch(changeEnvironment('test'))

    store.expectActions([{ type: authLogout.pending.type }, { type: setEnvironmentConfiguration.type }])
  })
})
