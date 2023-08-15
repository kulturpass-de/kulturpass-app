import { cdcApi } from '../../../api/cdc-api'
import { commerceApi } from '../../../api/commerce-api'
import { CdcAccountDeletionRequestedError } from '../../../errors/cdc-errors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { clearCdcSession, clearCommerceSession, persistCdcSession } from '../../../session/session-service'
import { CdcSessionData } from '../../../session/types'
import { userSlice } from '../../../user/redux/user-slice'
import { authSlice } from '../auth-slice'
import { cdcLoginResponseToSessionData } from '../utils'

export const authCdcFinalizeRegistration = createThunk<CdcSessionData, { regToken: string }>(
  'auth/cdcFinalizeRegistration',
  async (payload, thunkAPI) => {
    const cdcFinalizeRegistrationResponse = await thunkAPI
      .dispatch(cdcApi.endpoints.accountsFinalizeRegistration.initiate(payload))
      .unwrap()

    if (cdcFinalizeRegistrationResponse?.data?.deletionRequested === true) {
      throw new CdcAccountDeletionRequestedError()
    }

    thunkAPI.dispatch(userSlice.actions.clearUser())
    thunkAPI.dispatch(cdcApi.util.resetApiState())
    thunkAPI.dispatch(commerceApi.util.resetApiState())
    await clearCdcSession()
    await clearCommerceSession()

    const cdcSessionData = cdcLoginResponseToSessionData(cdcFinalizeRegistrationResponse)
    await persistCdcSession(cdcSessionData)
    thunkAPI.dispatch(authSlice.actions.setCdcSession(cdcSessionData))

    return cdcSessionData
  },
)
