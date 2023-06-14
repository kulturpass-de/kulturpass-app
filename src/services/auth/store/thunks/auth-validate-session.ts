import { createThunk } from '../../../redux/utils/create-thunk'
import { authLogoutWithoutErrors } from './auth-logout'
import { getCdcSessionData, getCommerceSessionData, getIsUserLoggedIn } from '../auth-selectors'

export const authValidateSession = createThunk('auth/validateSession', async (payload, thunkAPI) => {
  const state = thunkAPI.getState()
  const cdcSessionData = getCdcSessionData(state)
  const commerceSessionData = getCommerceSessionData(state)
  const isUserLoggedIn = getIsUserLoggedIn(state)

  if ((cdcSessionData || commerceSessionData) && !isUserLoggedIn) {
    await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
  }
})
