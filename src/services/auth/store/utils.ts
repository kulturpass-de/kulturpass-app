import { CDC_SESSION_EXPIRATION_INIFINITE } from '../../api/cdc-api'
import { AccountsLoginResponse, PostAuthTokenResponse } from '../../api/types'
import { CdcSessionData } from '../../session/types'

export const isNotEmptyString = (s?: string) => {
  return s && typeof s === 'string' && s.length > 0 ? true : false
}

export const isSessionTimestampValid = (s?: string | number) => {
  if (s === CDC_SESSION_EXPIRATION_INIFINITE) {
    return true
  }
  let sessionExpiryDate: number = 0
  if (typeof s === 'number') {
    sessionExpiryDate = s
  }
  if (typeof s === 'string') {
    sessionExpiryDate = parseInt(s, 10)
  }
  if (sessionExpiryDate < 0) {
    return false
  }
  return Date.now() < sessionExpiryDate
}

export const isExpiresInValid = (n: number | undefined) => {
  if (n === undefined) {
    return false
  }
  return n > 0
}

export const cdcLoginResponseToSessionData = (cdcLoginResponse: AccountsLoginResponse) => {
  const { firstName, email } = cdcLoginResponse.profile
  const sessionValidity =
    cdcLoginResponse.sessionInfo.expires_in !== undefined
      ? parseInt(cdcLoginResponse.sessionInfo.expires_in, 10) * 1000
      : CDC_SESSION_EXPIRATION_INIFINITE

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
