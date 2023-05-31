import { userSlice } from '../../../user/redux/user-slice'
import { authCdcLogout } from './auth-cdc-logout'
import { authCommerceLogout } from './auth-commerce-logout'
import { createThunk } from '../../../redux/utils/create-thunk'
import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'

export const authLogout = createThunk('auth/logout', async (payload, thunkAPI) => {
  await thunkAPI.dispatch(authCdcLogout()).unwrap()
  await thunkAPI.dispatch(authCommerceLogout()).unwrap()
  thunkAPI.dispatch(userSlice.actions.clearUser())
  thunkAPI.dispatch(cdcApi.util.resetApiState())
  thunkAPI.dispatch(commerceApi.util.resetApiState())
})
