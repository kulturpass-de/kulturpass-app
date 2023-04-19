import { clearCdcSession } from '../../../session/session-service'
import { createThunk } from '../../../redux/utils/create-thunk'
import { authSlice } from '../auth-slice'

export const authCdcLogout = createThunk('auth/cdcLogout', async (payload, thunkAPI) => {
  thunkAPI.dispatch(authSlice.actions.clearCdcSession())

  await clearCdcSession()
})
