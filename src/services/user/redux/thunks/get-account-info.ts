import { cdcApi } from '../../../api/cdc-api'
import { AccountsGetAccountInfoResponse } from '../../../api/types'
import { getRegistrationToken } from '../../../auth/store/auth-selectors'
import { createThunk } from '../../../redux/utils/create-thunk'

export const getAccountInfo = createThunk<AccountsGetAccountInfoResponse>(
  'user/getAccountInfo',
  async (payload, thunkAPI) => {
    const regToken = getRegistrationToken(thunkAPI.getState())

    if (!regToken) {
      return thunkAPI.dispatch(cdcApi.endpoints.accountsGetAccountInfoSigned.initiate()).unwrap()
    }

    return thunkAPI
      .dispatch(cdcApi.endpoints.accountsGetAccountInfoWithRegTokenUnsigned.initiate({ regToken }))
      .unwrap()
  },
)
