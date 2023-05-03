import { authSlice } from '../../../auth/store/auth-slice'
import { createThunk } from '../../../redux/utils/create-thunk'
import { userSlice } from '../../../user/redux/user-slice'
import { getCdcSession, getCommerceSession } from '../../session-service'

export const restoreSession = createThunk('session/restoreSession', async (payload, thunkApi) => {
  const cdcSessionData = await getCdcSession()
  const commerceSessionData = await getCommerceSession()

  if (!cdcSessionData || !commerceSessionData) {
    return
  }

  thunkApi.dispatch(authSlice.actions.setCdcSession(cdcSessionData))
  thunkApi.dispatch(authSlice.actions.setCommerceSession(commerceSessionData))

  const firstName = cdcSessionData.user.firstName
  thunkApi.dispatch(userSlice.actions.setUserProfile({ firstName }))
})
