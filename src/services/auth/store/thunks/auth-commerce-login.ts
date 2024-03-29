import { commerceApi } from '../../../api/commerce-api'
import { PostAuthTokenParams, PostAuthTokenResponse } from '../../../api/types'
import { ErrorWithCode } from '../../../errors/errors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { persistCommerceSession } from '../../../session/session-service'
import { CdcSessionData, CommerceSessionData } from '../../../session/types'
import { authSlice } from '../auth-slice'
import { getTokenValidUntil, isUserLoggedInToCommerce } from '../utils'

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

    const commerceSessionData: CommerceSessionData = {
      ...commerceLoginResponse,
      token_valid_until: getTokenValidUntil(commerceLoginResponse),
    }

    if (!isUserLoggedInToCommerce(commerceSessionData)) {
      throw new ErrorWithCode('INVALID_COMMERCE_SESSION', 'Commerce session is not valid')
    }

    await persistCommerceSession(commerceSessionData)
    thunkAPI.dispatch(authSlice.actions.setCommerceSession(commerceSessionData))

    return commerceLoginResponse
  },
)
