import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../redux/configure-store'
import { CdcSessionData } from '../../session/types'
import { isExpiresInValid, isNotEmptyString, isSessionTimestampValid } from './utils'

export const getAuthState = (state: RootState) => state.auth

export const isUserPending = (cdc: CdcSessionData | null) => {
  return cdc?.isVerified === false && typeof cdc?.regToken === 'string'
}

export const getAccountVerificationStatus = createSelector(
  getAuthState,
  (auth): 'pending' | 'completed' | undefined => {
    if (auth.cdc === null) {
      return undefined
    }

    if (isUserPending(auth.cdc)) {
      return 'pending'
    }

    if (auth.cdc.isVerified === true) {
      return 'completed'
    }

    return undefined
  },
)

export const getIsUserVerificationPending = createSelector(getAccountVerificationStatus, status => status === 'pending')

export const getIsUserLoggedInToCdc = createSelector(
  getAuthState,
  getIsUserVerificationPending,
  (auth, isUserPendingVerification) => {
    if (!auth.cdc) {
      return false
    }

    if (isUserPendingVerification) {
      const pendingTimestamp = auth.cdc.sessionStartTimestamp + auth.cdc.sessionValidity

      return isSessionTimestampValid(pendingTimestamp)
    }

    return (
      isNotEmptyString(auth.cdc?.sessionToken) &&
      isNotEmptyString(auth.cdc?.sessionSecret) &&
      isSessionTimestampValid(auth.cdc?.sessionValidity)
    )
  },
)

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

export const getCdcSessionData = createSelector(getAuthState, auth => auth.cdc)

export const getCdcSessionEmail = createSelector(getCdcSessionData, data => data?.user.email)

export const getRegistrationToken = createSelector(getCdcSessionData, data => data?.regToken)

export const getCommerceSessionData = createSelector(getAuthState, auth => auth.commerce)

export const getCommerceAccessToken = createSelector(getCommerceSessionData, data => data?.access_token)

export const selectValidCommerceAccessToken = createSelector([getCommerceSessionData], commerceSessionData => {
  if (!commerceSessionData) {
    return null
  }

  const { access_token, token_valid_until } = commerceSessionData

  const isValid = (token_valid_until && token_valid_until > Date.now()) || false

  return isValid ? access_token : null
})
