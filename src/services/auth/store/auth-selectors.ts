import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../redux/configure-store'
import { CdcSessionData } from '../../session/types'
import { isUserLoggedInToCdc, isUserLoggedInToCommerce } from './utils'

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

// NOTE: Selectors are memoized, so time based valid checks do not work as expected
export const getIsUserLoggedInToCdc = createSelector(getAuthState, auth => {
  return isUserLoggedInToCdc(auth.cdc)
})

// NOTE: Selectors are memoized, so time based valid checks do not work as expected
export const getIsUserLoggedInToCommerce = createSelector(getAuthState, auth => {
  return isUserLoggedInToCommerce(auth.commerce)
})

// NOTE: Selectors are memoized, so time based valid checks do not work as expected
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
