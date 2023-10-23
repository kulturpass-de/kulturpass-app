import { cdcApi } from '../../../api/cdc-api'
import { CdcAccountDeletionRequestedError } from '../../../errors/cdc-errors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { persistCdcSession } from '../../../session/session-service'
import { CdcSessionData } from '../../../session/types'
import { authSlice } from '../auth-slice'
import { cdcLoginResponseToSessionData } from '../utils'

export const authCdcLogin = createThunk<CdcSessionData, { loginID: string; password: string }>(
  'auth/cdcLogin',
  async (payload, thunkAPI) => {
    const cdcLoginResponse = await thunkAPI.dispatch(cdcApi.endpoints.accountsLogin.initiate(payload)).unwrap()

    if (cdcLoginResponse?.data?.deletionRequested === true) {
      throw new CdcAccountDeletionRequestedError()
    }

    const cdcSessionData = cdcLoginResponseToSessionData(cdcLoginResponse)
    await persistCdcSession(cdcSessionData)
    thunkAPI.dispatch(authSlice.actions.setCdcSession(cdcSessionData))

    return cdcSessionData
  },
)
