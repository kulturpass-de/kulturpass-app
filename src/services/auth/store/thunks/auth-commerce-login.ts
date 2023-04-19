import { commerceApi } from '../../../api/commerce-api'
import { persistCommerceSesssion } from '../../../session/session-service'
import { CdcSessionData } from '../../../session/types'
import { CommerceAuthParams, CommerceAuthResponse } from '../../../api/types'
import { getEnvironmentConfigurationCommerce } from '../../../environment-configuration/redux/environment-configuration-selectors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { authSlice } from '../auth-slice'

export type AuthCommerceLoginParams = Pick<CdcSessionData, 'uid' | 'uidSignature' | 'sessionStartTimestamp' | 'idToken'>

export const authCommerceLogin = createThunk<CommerceAuthResponse, AuthCommerceLoginParams>(
  'auth/commerceLogin',
  async (authCommerceLoginParams, thunkAPI) => {
    const commerceConfig = getEnvironmentConfigurationCommerce(thunkAPI.getState())

    const commerceLoginParams: CommerceAuthParams = {
      url: commerceConfig.auth.tokenEndpoint,
      client_id: commerceConfig.auth.clientId,
      client_secret: commerceConfig.auth.clientSecret,
      grant_type: 'custom',
      UID: authCommerceLoginParams.uid,
      UIDSignature: authCommerceLoginParams.uidSignature,
      signatureTimestamp: authCommerceLoginParams.sessionStartTimestamp,
      id_token: authCommerceLoginParams.idToken,
      baseSite: commerceConfig.baseSiteId,
    }

    // 5. login to commerce using cdc params
    const commerceLoginResponse = await thunkAPI
      .dispatch(commerceApi.endpoints.postAuthToken.initiate(commerceLoginParams))
      .unwrap()

    // 6. commerce save userdata/session in redux store & secure storage
    await persistCommerceSesssion(commerceLoginResponse)

    thunkAPI.dispatch(authSlice.actions.setCommerceSession(commerceLoginResponse))

    return commerceLoginResponse
  },
)
