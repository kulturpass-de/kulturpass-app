import { createThunk } from '../../../redux/utils/create-thunk'
import { userSlice } from '../../../user/redux/user-slice'
import { authCdcLogin } from './auth-cdc-login'
import { authCommerceLogin } from './auth-commerce-login'
import { authLogoutWithoutErrors } from './auth-logout'

export const authLogin = createThunk<void, Parameters<typeof authCdcLogin>[0]>(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const cdcSessionData = await thunkAPI.dispatch(authCdcLogin(payload)).unwrap()

      await thunkAPI.dispatch(authCommerceLogin(cdcSessionData)).unwrap()

      thunkAPI.dispatch(userSlice.actions.setUserProfile({ firstName: cdcSessionData.user.firstName }))
    } catch (error: unknown) {
      await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
      throw error
    }
  },
)
