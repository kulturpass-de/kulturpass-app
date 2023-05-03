import { commerceApi } from '../../../api/commerce-api'
import { persistCommerceSession } from '../../../session/session-service'
import { CdcSessionData } from '../../../session/types'
import { PostAuthTokenParams, PostAuthTokenResponse } from '../../../api/types'
import { createThunk } from '../../../redux/utils/create-thunk'
import { authSlice } from '../auth-slice'

export type AuthCommerceLoginParams = Pick<CdcSessionData, 'uid' | 'uidSignature' | 'sessionStartTimestamp' | 'idToken'>

export const authCommerceLogin = createThunk<PostAuthTokenResponse, AuthCommerceLoginParams>(
  'auth/commerceLogin',
  async (authCommerceLoginParams, thunkAPI) => {
    const commerceLoginParams: PostAuthTokenParams = {
      UID: authCommerceLoginParams.uid,
      UIDSignature: authCommerceLoginParams.uidSignature,
      signatureTimestamp: authCommerceLoginParams.sessionStartTimestamp,
      id_token: authCommerceLoginParams.idToken,
    }

    const commerceLoginResponse = await thunkAPI
      .dispatch(commerceApi.endpoints.postAuthToken.initiate(commerceLoginParams))
      .unwrap()

    await persistCommerceSession(commerceLoginResponse)
    thunkAPI.dispatch(authSlice.actions.setCommerceSession(commerceLoginResponse))

    return commerceLoginResponse
  },
)
