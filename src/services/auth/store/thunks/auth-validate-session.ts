import { createThunk } from '../../../redux/utils/create-thunk'
import { getCdcSessionData, getCommerceSessionData } from '../auth-selectors'
import { isUserLoggedInToCdc, isUserLoggedInToCommerce } from '../utils'
import { authCommerceRefreshSession } from './auth-commerce-refresh-session'
import { authLogoutWithoutErrors } from './auth-logout'

export const authValidateSession = createThunk<
  | {
      isCdcSessionValid: boolean
      isCommerceSessionValid: boolean
    }
  | undefined,
  void
>('auth/validateSession', async (payload, thunkAPI) => {
  const state = thunkAPI.getState()
  if (state.user.registrationFinalizationInProgess) {
    return
  }
  const cdcSessionData = getCdcSessionData(state)
  const commerceSessionData = getCommerceSessionData(state)

  // We do not use selectors, as they are memoized
  const isCdcSessionValid = isUserLoggedInToCdc(cdcSessionData)
  const isCommerceSessionValid = isUserLoggedInToCommerce(commerceSessionData)

  if ((cdcSessionData || commerceSessionData) && !(isCdcSessionValid && isCommerceSessionValid)) {
    if (cdcSessionData && isCdcSessionValid) {
      try {
        await thunkAPI.dispatch(authCommerceRefreshSession(cdcSessionData)).unwrap()
      } catch (_error: unknown) {
        await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
      }
    } else {
      await thunkAPI.dispatch(authLogoutWithoutErrors()).unwrap()
    }
  }

  return { isCdcSessionValid, isCommerceSessionValid }
})
