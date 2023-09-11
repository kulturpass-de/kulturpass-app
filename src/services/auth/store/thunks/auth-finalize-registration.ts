import { commerceApi } from '../../../api/commerce-api'
import { UnknownError } from '../../../errors/errors'
import { createThunk } from '../../../redux/utils/create-thunk'
import { userSlice } from '../../../user/redux/user-slice'
import { authCdcFinalizeRegistration } from './auth-cdc-finalize-registration'
import { authCommerceLogin } from './auth-commerce-login'
import { authLogoutWithoutErrors } from './auth-logout'

export const authFinalizeRegistration = createThunk<void, { url: URL }>(
  'auth/finalizeRegistration',
  async (payload, thunkAPI) => {
    // Hide the Verified Alert since we can login directly through the email deeplink
    thunkAPI.dispatch(userSlice.actions.setDisplayVerifiedAlert(false))

    const { url } = payload

    const regToken = url.searchParams.get('regToken')

    if (regToken === null) {
      throw new UnknownError()
    }
    thunkAPI.dispatch(userSlice.actions.setRegistrationFinalizationInProgess(true))
    try {
      const cdcSessionData = await thunkAPI.dispatch(authCdcFinalizeRegistration({ regToken })).unwrap()

      await thunkAPI.dispatch(authCommerceLogin(cdcSessionData)).unwrap()

      thunkAPI.dispatch(userSlice.actions.setUserProfile({ firstName: cdcSessionData.user.firstName }))

      // Refetch getProfile so that the Eid Navigator is mounted
      await thunkAPI.dispatch(commerceApi.endpoints.getProfile.initiate({})).unwrap()
    } catch (error: unknown) {
      await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
      throw error
    } finally {
      thunkAPI.dispatch(userSlice.actions.setRegistrationFinalizationInProgess(false))
    }
  },
)
