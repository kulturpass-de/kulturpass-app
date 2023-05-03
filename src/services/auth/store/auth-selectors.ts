import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../../redux/configure-store'
import { isExpiresInValid, isNotEmptyString, isSessionTimestampValid } from './utils'

export const getAuthState = (state: RootState) => state.auth

export const getIsUserLoggedInToCdc = createSelector(getAuthState, auth => {
  return (
    isNotEmptyString(auth.cdc?.sessionToken) &&
    isNotEmptyString(auth.cdc?.sessionSecret) &&
    isSessionTimestampValid(auth.cdc?.sessionValidity)
  )
})

export const getIsUserLoggedInToCommerce = createSelector(getAuthState, auth => {
  return isNotEmptyString(auth.commerce?.access_token) && isExpiresInValid(auth.commerce?.expires_in)
})

export const getIsUserLoggedIn = createSelector(
  getIsUserLoggedInToCdc,
  getIsUserLoggedInToCommerce,
  (loggedInToCdc, loggedInToCommerce) => {
    return loggedInToCdc && loggedInToCommerce
  },
)

export const getCdcSessionData = createSelector(getAuthState, auth => {
  return auth.cdc
})

export const getCdcSessionEmail = createSelector(getCdcSessionData, data => data?.user.email)

export const getCommerceAccessToken = createSelector(
  getAuthState,
  getIsUserLoggedIn,
  getIsUserLoggedInToCommerce,
  getIsUserLoggedInToCdc,
  (auth, isUserLoggedIn, isUserLoggedInToCommerce, isUserLoggedInToCdc) => {
    return {
      cdc: auth.cdc,
      isUserLoggedInToCommerce,
      isUserLoggedInToCdc,
      isUserLoggedIn,
      commerceAccessToken: auth.commerce?.access_token,
    }
  },
)

export const getRegistrationToken = createSelector(getAuthState, (auth): string | undefined => {
  return auth.cdc?.regToken
})

export const getAccountVerificationStatus = createSelector(
  getAuthState,
  (auth): 'pending' | 'completed' | undefined => {
    if (auth.cdc === null) {
      return undefined
    }

    if (auth.cdc.isVerified === false && typeof auth.cdc.regToken === 'string') {
      return 'pending'
    }

    if (auth.cdc.isVerified === true) {
      return 'completed'
    }

    return undefined
  },
)
