import { RegistrationFormData } from '../../../../screens/registration/registration-form-screen'
import { cdcApi } from '../../../api/cdc-api'
import { AccountsRegisterResponse } from '../../../api/types'
import { createThunk } from '../../../redux/utils/create-thunk'

export const register = createThunk<AccountsRegisterResponse, RegistrationFormData>(
  'user/register',
  async (payload, thunkApi) => {
    const initRegistrationAction = cdcApi.endpoints.accountsInitRegistration.initiate()
    const initRegistrationResponse = await thunkApi.dispatch(initRegistrationAction).unwrap()

    const registerAction = cdcApi.endpoints.accountsRegister.initiate({
      regToken: initRegistrationResponse.regToken,
      email: payload.email,
      password: payload.password,
      profile: {
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
      data: {
        dateOfBirth: payload.dateOfBirth,
      },
    })
    const accountsRegisterResponse = await thunkApi.dispatch(registerAction).unwrap()

    return accountsRegisterResponse
  },
)
