import { createThunk } from '../../../redux/utils/create-thunk'
import { getCdcSessionData, getCommerceSessionData, getIsUserLoggedIn, getIsUserLoggedInToCdc } from '../auth-selectors'
import { authCommerceRefreshSession } from './auth-commerce-refresh-session'
import { authLogoutWithoutErrors } from './auth-logout'

export const authValidateSession = createThunk('auth/validateSession', async (payload, thunkAPI) => {
  const state = thunkAPI.getState()
  if (state.user.registrationFinalizationInProgess) {
    return
  }
  const cdcSessionData = getCdcSessionData(state)
  const commerceSessionData = getCommerceSessionData(state)
  const isUserLoggedIn = getIsUserLoggedIn(state)
  const isUserLoggedInToCdc = getIsUserLoggedInToCdc(state)

  if ((cdcSessionData || commerceSessionData) && !isUserLoggedIn) {
    if (cdcSessionData && isUserLoggedInToCdc) {
      try {
        await thunkAPI.dispatch(authCommerceRefreshSession(cdcSessionData)).unwrap()
      } catch (_error: unknown) {
        await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
      }
    } else {
      await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
    }
  }
})
