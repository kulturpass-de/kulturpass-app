import { cdcApi } from '../../../api/cdc-api'
import { createThunk } from '../../../redux/utils/create-thunk'
import { clearCdcSession } from '../../../session/session-service'
import { getCdcSessionData } from '../auth-selectors'
import { authSlice } from '../auth-slice'

export const authCdcLogout = createThunk<void, Array<unknown>>('auth/cdcLogout', async (payload, thunkAPI) => {
  const cdcSessionData = getCdcSessionData(thunkAPI.getState())

  if (cdcSessionData?.sessionSecret && cdcSessionData.sessionToken) {
    try {
      // NOTE: This request might fail due to multiple reasons, still we should proceed with clearing cdc session from
      // the redux store, secure storage, etc
      await thunkAPI.dispatch(cdcApi.endpoints.accountsLogoutSigned.initiate()).unwrap()
    } catch (error: unknown) {
      payload.push(error)
    }
  }

  thunkAPI.dispatch(authSlice.actions.clearCdcSession())

  await clearCdcSession()
})
