import { userSlice } from '../../../user/redux/user-slice'
import { authCdcLogout } from './auth-cdc-logout'
import { authCommerceLogout } from './auth-commerce-logout'
import { createThunk } from '../../../redux/utils/create-thunk'
import { cdcApi } from '../../../api/cdc-api'

export const authLogout = createThunk('auth/logout', async (payload, thunkAPI) => {
  try {
    await thunkAPI.dispatch(cdcApi.endpoints.postLogout.initiate({})).unwrap()
  } catch (error: unknown) {}

  await thunkAPI.dispatch(authCdcLogout()).unwrap()
  await thunkAPI.dispatch(authCommerceLogout()).unwrap()
  thunkAPI.dispatch(userSlice.actions.clearUser())
  cdcApi.util.invalidateTags(['AccountInfo'])
})
