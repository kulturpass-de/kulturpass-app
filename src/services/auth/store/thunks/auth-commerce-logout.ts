import { commerceApi } from '../../../api/commerce-api'
import { createThunk } from '../../../redux/utils/create-thunk'
import { clearCommerceSession } from '../../../session/session-service'
import { getCommerceAccessToken } from '../auth-selectors'
import { authSlice } from '../auth-slice'

export const authCommerceLogout = createThunk<void, Array<unknown>>(
  'auth/commerceLogout',
  async (payload, thunkAPI) => {
    const commerceAccessToken = getCommerceAccessToken(thunkAPI.getState())

    if (commerceAccessToken) {
      try {
        // NOTE: This request might fail due to multiple reasons, still we should proceed with clearing commerce session
        // from the redux store, secure storage, etc
        await thunkAPI
          .dispatch(
            commerceApi.endpoints.postRevokeAuthToken.initiate({
              token: commerceAccessToken,
            }),
          )
          .unwrap()
      } catch (error: unknown) {
        payload.push(error)
      }
    }

    thunkAPI.dispatch(authSlice.actions.clearCommerceSession())

    await clearCommerceSession()
  },
)
