import { createThunk } from '../../../redux/utils/create-thunk'
import { getCdcSessionData, getCommerceSessionData, getIsUserLoggedIn } from '../auth-selectors'
import { authLogoutWithoutErrors } from './auth-logout'

export const authValidateSession = createThunk('auth/validateSession', async (payload, thunkAPI) => {
  const state = thunkAPI.getState()
  if (state.user.registrationFinalizationInProgess) {
    return
  }
  const cdcSessionData = getCdcSessionData(state)
  const commerceSessionData = getCommerceSessionData(state)
  const isUserLoggedIn = getIsUserLoggedIn(state)

  if ((cdcSessionData || commerceSessionData) && !isUserLoggedIn) {
    await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
  }
})
