import { cdcApi } from '../../../api/cdc-api'
import { CdcAccountDeletionRequestedError } from '../../../errors/cdc-errors'
import { ErrorWithCode } from '../../../errors/errors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { persistCdcSession } from '../../../session/session-service'
import { CdcSessionData } from '../../../session/types'
import { authSlice } from '../auth-slice'
import { cdcLoginResponseToSessionData, isUserLoggedInToCdc } from '../utils'

export const authCdcLogin = createThunk<CdcSessionData, { loginID: string; password: string }>(
  'auth/cdcLogin',
  async (payload, thunkAPI) => {
    const cdcLoginResponse = await thunkAPI.dispatch(cdcApi.endpoints.accountsLogin.initiate(payload)).unwrap()

    if (cdcLoginResponse?.data?.deletionRequested === true) {
      throw new CdcAccountDeletionRequestedError()
    }

    const cdcSessionData = cdcLoginResponseToSessionData(cdcLoginResponse)

    if (!isUserLoggedInToCdc(cdcSessionData)) {
      throw new ErrorWithCode('INVALID_CDC_SESSION', 'Cdc session is not valid')
    }

    await persistCdcSession(cdcSessionData)
    thunkAPI.dispatch(authSlice.actions.setCdcSession(cdcSessionData))

    return cdcSessionData
  },
)
