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

    store.expectActions([{ type: setEnvironmentConfiguration.type }])
    store.expectActions([{ type: authLogout.pending.type }])
  })

  it('should throw when given environment name does not exist', async () => {
    await store.dispatch(changeEnvironment('test-test-test'))

    const changeEnvironmentRejected = store.findAction(changeEnvironment.rejected.match)
    expect(changeEnvironmentRejected?.payload).toBeInstanceOf(Error)

    store.expectActionNotDispatched(authLogout.pending.match)
  })
})
