import { authLogoutWithoutErrors } from '../../../auth/store/thunks/auth-logout'
import { createThunk } from '../../../redux/utils/create-thunk'
import { EnvironmentConfiguration } from '../../environment-configuration'
import { setEnvironmentConfiguration } from '../environment-configuration-slice'

export const changeEnvironment = createThunk<void, EnvironmentConfiguration['name']>(
  'environmentConfiguration/changeEnvironment',
  async (payload, thunkApi) => {
    await thunkApi.dispatch(authLogoutWithoutErrors()).unwrap()
    thunkApi.dispatch(setEnvironmentConfiguration(payload))
  },
)
