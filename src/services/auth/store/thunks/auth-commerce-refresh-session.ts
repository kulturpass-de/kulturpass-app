import { Mutex } from 'async-mutex'
import { PostAuthTokenResponse } from '../../../api/types'
import { createThunk } from '../../../redux/utils/create-thunk'
import { getAccountInfo } from '../../../user/redux/thunks/get-account-info'
import { authSlice } from '../auth-slice'
import { authCommerceLogin, AuthCommerceLoginParams } from './auth-commerce-login'

const mutex = new Mutex()

export const authCommerceRefreshSession = createThunk<PostAuthTokenResponse, AuthCommerceLoginParams>(
  'auth/commerceRefreshSession',
  async (authCommerceLoginParams, thunkAPI) => {
    return await mutex.runExclusive(async () => {
      // Take new idToken from cdc
      const { id_token: idToken } = await thunkAPI.dispatch(getAccountInfo()).unwrap()
      thunkAPI.dispatch(authSlice.actions.setCdcIdToken(idToken!))

      // Use the idToken to establish a valid commerce session
      const cdcSessionData = { ...authCommerceLoginParams, idToken: idToken! }
      return thunkAPI.dispatch(authCommerceLogin(cdcSessionData)).unwrap()
    })
  },
)
