import { CdcSessionData } from '../../session/types'
import { AccountsLoginResponse } from '../../api/types'

export const isNotEmptyString = (s?: string) => {
  return s && typeof s === 'string' && s.length > 0 ? true : false
}

export const isSessionTimestampValid = (s?: string | number) => {
  if (s === -2) {
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
    cdcLoginResponse.sessionInfo.expires_in !== undefined ? cdcLoginResponse.sessionInfo.expires_in : -2

  const { sessionToken, sessionSecret } = cdcLoginResponse.sessionInfo
  const sessionData: CdcSessionData = {
    sessionToken,
    sessionSecret,
    sessionStartTimestamp: cdcLoginResponse.signatureTimestamp,
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
