import { RegistrationFormData } from '../../../../screens/registration/registration-form-screen'
import { cdcApi } from '../../../api/cdc-api'
import { AccountsRegisterResponse } from '../../../api/types'
import { authLogin } from '../../../auth/store/thunks/auth-login'
import { createThunk } from '../../../redux/utils/create-thunk'

export const register = createThunk<AccountsRegisterResponse, RegistrationFormData>(
  'user/register',
  async (payload, thunkApi) => {
    // NOTE: `{ forceRefetch: true }` is needed so the rtkQuery does not return cached data
    const initRegistrationAction = cdcApi.endpoints.accountsInitRegistration.initiate(undefined, { forceRefetch: true })
    const initRegistrationResponse = await thunkApi.dispatch(initRegistrationAction).unwrap()

    const registerAction = cdcApi.endpoints.accountsRegister.initiate({
      regToken: initRegistrationResponse.regToken,
      email: payload.email,
      password: payload.password,
      profile: {
        firstName: payload.firstName,
      },
      data: {
        dateOfBirth: payload.dateOfBirth,
      },
    })
    const accountsRegisterResponse = await thunkApi.dispatch(registerAction).unwrap()

    await thunkApi.dispatch(authLogin({ loginID: payload.email, password: payload.password })).unwrap()

    return accountsRegisterResponse
  },
)
