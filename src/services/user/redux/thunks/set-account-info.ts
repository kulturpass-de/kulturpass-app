import { cdcApi } from '../../../api/cdc-api'
import { AccountsSetAccountInfoSignedRequestParams } from '../../../api/types'
import { getRegistrationToken } from '../../../auth/store/auth-selectors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { userSlice } from '../user-slice'

export type SetAccountInfoPayload = {
  params: AccountsSetAccountInfoSignedRequestParams
  regToken?: string
}

export const setAccountInfo = createThunk<void, SetAccountInfoPayload>(
  'user/setAccountInfo',
  async (payload, thunkAPI) => {
    const regToken = payload.regToken ?? getRegistrationToken(thunkAPI.getState())

    if (regToken) {
      const action = cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.initiate({
        ...payload.params,
        regToken,
      })
      await thunkAPI.dispatch(action).unwrap()
    } else {
      const action = cdcApi.endpoints.accountsSetAccountInfoSigned.initiate(payload.params)
      await thunkAPI.dispatch(action).unwrap()
    }

    const firstName = payload.params.profile?.firstName
    if (firstName !== undefined) {
      thunkAPI.dispatch(userSlice.actions.setUserProfile({ firstName }))
    }
  },
)
