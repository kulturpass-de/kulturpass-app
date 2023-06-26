import { PostAuthTokenResponse } from '../../../api/types'
import { createThunk } from '../../../redux/utils/create-thunk'
import { getAccountInfo } from '../../../user/redux/thunks/get-account-info'
import { authCommerceLogin, AuthCommerceLoginParams } from './auth-commerce-login'

export const authCommerceRefreshSession = createThunk<PostAuthTokenResponse, AuthCommerceLoginParams>(
  'auth/commerceRefreshSession',
  async (authCommerceLoginParams, thunkAPI) => {
    const { id_token: idToken } = await thunkAPI.dispatch(getAccountInfo()).unwrap()
    const cdcSessionData = { ...authCommerceLoginParams, idToken: idToken! }
    return thunkAPI.dispatch(authCommerceLogin(cdcSessionData)).unwrap()
  },
)
