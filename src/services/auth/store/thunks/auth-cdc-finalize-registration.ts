import { cdcApi } from '../../../api/cdc-api'
import { CdcAccountDeletionRequestedError } from '../../../errors/cdc-errors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { persistCdcSession } from '../../../session/session-service'
import { CdcSessionData } from '../../../session/types'
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

    const cdcSessionData = cdcLoginResponseToSessionData(cdcFinalizeRegistrationResponse)
    await persistCdcSession(cdcSessionData)
    thunkAPI.dispatch(authSlice.actions.setCdcSession(cdcSessionData))

    return cdcSessionData
  },
)
