import { clearCommerceSession } from '../../../session/session-service'
import { createThunk } from '../../../redux/utils/create-thunk'
import { authSlice } from '../auth-slice'

export const authCommerceLogout = createThunk('auth/commerceLogout', async (payload, thunkAPI) => {
  thunkAPI.dispatch(authSlice.actions.clearCommerceSession())

  await clearCommerceSession()
})
