import { cdcApi } from '../../../api/cdc-api'
import { AccountsGetAccountInfoResponse } from '../../../api/types'
import { getRegistrationToken } from '../../../auth/store/auth-selectors'
import { createThunk } from '../../../redux/utils/create-thunk'

export const getAccountInfo = createThunk<AccountsGetAccountInfoResponse>(
  'user/getAccountInfo',
  async (payload, thunkAPI) => {
    const regToken = getRegistrationToken(thunkAPI.getState())

    if (!regToken) {
      const action = cdcApi.endpoints.accountsGetAccountInfoSigned.initiate(undefined, { forceRefetch: true })
      return thunkAPI.dispatch(action).unwrap()
    }

    const action = cdcApi.endpoints.accountsGetAccountInfoWithRegTokenUnsigned.initiate(
      { regToken },
      { forceRefetch: true },
    )
    return thunkAPI.dispatch(action).unwrap()
  },
)
