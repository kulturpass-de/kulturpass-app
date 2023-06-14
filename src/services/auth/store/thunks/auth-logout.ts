import { userSlice } from '../../../user/redux/user-slice'
import { authCdcLogout } from './auth-cdc-logout'
import { authCommerceLogout } from './auth-commerce-logout'
import { createThunk } from '../../../redux/utils/create-thunk'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'

export const authLogout = createThunk('auth/logout', async (_payload, thunkAPI) => {
  let errors: Array<unknown> = []
  await thunkAPI.dispatch(authCdcLogout(errors)).unwrap()
  await thunkAPI.dispatch(authCommerceLogout(errors)).unwrap()
  thunkAPI.dispatch(userSlice.actions.clearUser())
  thunkAPI.dispatch(cdcApi.util.resetApiState())
  thunkAPI.dispatch(commerceApi.util.resetApiState())

  if (errors.length > 0) {
    // We can only show one error. If both API calls fail, it also might be the same problem occuring.
    throw errors[0]
  }
})

export const authLogoutWithoutErrors = createThunk('auth/logout/silent', async (_payload, thunkAPI) => {
  try {
    await thunkAPI.dispatch(authLogout()).unwrap()
  } catch (error: unknown) {
    if (__DEV__) {
      console.warn('authLogout failed with error', error)
    }
  }
})
