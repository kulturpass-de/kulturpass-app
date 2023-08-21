import { CDC_SESSION_EXPIRATION_INFINITE } from '../../api/cdc-constants'
import { AccountsLoginResponse, PostAuthTokenResponse } from '../../api/types'
import { AccountsFinalizeRegistrationResponse } from '../../api/types/cdc/accounts/cdc-accounts-finalize-registration'
import { CdcSessionData, CommerceSessionData } from '../../session/types'
import { isUserPending } from './auth-selectors'

export const isNotEmptyString = (s?: string) => {
  return s && typeof s === 'string' && s.length > 0 ? true : false
}

export const isCdcSessionValid = (sessionValidity: number, sessionStartTimestamp: number) => {
  if (sessionValidity <= 0) {
    return true
  }

  const sessionExpiryDate = sessionStartTimestamp + sessionValidity

  return Date.now() <= sessionExpiryDate
}

export const isUserLoggedInToCdc = (cdcSessionData?: CdcSessionData | null) => {
  if (!cdcSessionData) {
    return false
  }

  if (isUserPending(cdcSessionData)) {
    return isCdcSessionValid(cdcSessionData.sessionValidity, cdcSessionData.sessionStartTimestamp)
  }

  return (
    isNotEmptyString(cdcSessionData.sessionToken) &&
    isNotEmptyString(cdcSessionData.sessionSecret) &&
    isCdcSessionValid(cdcSessionData.sessionValidity, cdcSessionData.sessionStartTimestamp)
  )
}

export const isCommerceSessionValid = (expiresIn?: number, tokenValidUntil?: number) => {
  if (expiresIn === undefined || expiresIn <= 0) {
    return false
  }

  return (tokenValidUntil && tokenValidUntil > Date.now()) || false
}

export const isUserLoggedInToCommerce = (commerceSessionData?: CommerceSessionData | null) => {
  if (!commerceSessionData) {
    return false
  }
  return (
    isNotEmptyString(commerceSessionData.access_token) &&
    isCommerceSessionValid(commerceSessionData.expires_in, commerceSessionData.token_valid_until)
  )
}

export const cdcLoginResponseToSessionData = (
  cdcLoginResponse: AccountsLoginResponse | AccountsFinalizeRegistrationResponse,
) => {
  const { firstName, email } = cdcLoginResponse.profile
  const sessionValidity =
    cdcLoginResponse.sessionInfo.expires_in !== undefined
      ? parseInt(cdcLoginResponse.sessionInfo.expires_in, 10) * 1000
      : CDC_SESSION_EXPIRATION_INFINITE

  const { sessionToken, sessionSecret } = cdcLoginResponse.sessionInfo
  // NOTE: cdc sends signatureTimestamp as the number of seconds
  //       converting it to milliseconds as expected by Date constructor
  const sessionStartTimestamp = parseInt(cdcLoginResponse.signatureTimestamp, 10) * 1000
  const sessionData: CdcSessionData = {
    sessionToken,
    sessionSecret,
    sessionStartTimestamp,
    idToken: cdcLoginResponse.id_token,
    sessionValidity,
    user: { firstName, email },
    uid: cdcLoginResponse.UID,
    uidSignature: cdcLoginResponse.UIDSignature,
    regToken: cdcLoginResponse.regToken,
    isVerified: cdcLoginResponse.isVerified,
  }

  return sessionData
}

export const getTokenValidUntil = (commerceLoginResponse: PostAuthTokenResponse) => {
  // NOTE: commerce sends expires_in as the number of seconds
  //       converting it to milliseconds as expected by Date constructor
  return Date.now() + commerceLoginResponse.expires_in * 1000
}
