import { cdcApi } from '../../../api/cdc-api'
import { persistCdcSesssion } from '../../../session/session-service'
import { CdcSessionData } from '../../../session/types'
import { createThunk } from '../../../redux/utils/create-thunk'
import { authSlice } from '../auth-slice'
import { cdcLoginResponseToSessionData } from '../utils'

export const authCdcLogin = createThunk<CdcSessionData, { loginId: string; password: string }>(
  'auth/cdcLogin',
  async (payload, thunkAPI) => {
    const cdcLoginResponse = await thunkAPI.dispatch(cdcApi.endpoints.postLogin.initiate(payload)).unwrap()

    const cdcSessionData = cdcLoginResponseToSessionData(cdcLoginResponse)
    await persistCdcSesssion(cdcSessionData)
    thunkAPI.dispatch(authSlice.actions.setCdcSession(cdcSessionData))

    return cdcSessionData
  },
)
