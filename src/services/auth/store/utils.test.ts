import { CdcSessionData } from '../../session/types'
import { CdcApiLoginSuccessResponse } from '../../api/types'
import { cdcLoginResponseToSessionData, isExpiresInValid, isNotEmptyString, isSessionTimestampValid } from './utils'

describe('cdcLoginResponseToSessionData', () => {
  const input = {
    signatureTimestamp: 12345,
    id_token: 'my_id_token',
    UID: 'uid',
    UIDSignature: 'uid_signature',
    profile: { firstName: 'my_first_name' },
    sessionInfo: { sessionToken: 'my_session_token', sessionSecret: 'my_session_secret' },
    isVerified: true,
  } as CdcApiLoginSuccessResponse

  const output: CdcSessionData = {
    idToken: 'my_id_token',
    sessionSecret: 'my_session_secret',
    sessionStartTimestamp: 12345,
    sessionToken: 'my_session_token',
    sessionValidity: -2,
    uid: 'uid',
    uidSignature: 'uid_signature',
    user: { firstName: 'my_first_name' },
    isVerified: true,
    regToken: undefined,
  }

  it('transform input data as expected with sessionInfo.expires_in being undefined', () => {
    let result = cdcLoginResponseToSessionData(input)
    expect(result).toEqual(output)
  })

  it('transform input data as expected with sessionInfo.expires_in being defined', () => {
    let result = cdcLoginResponseToSessionData({ ...input, sessionInfo: { ...input.sessionInfo, expires_in: 67890 } })
    expect(result).toEqual({ ...output, sessionValidity: 67890 })
  })
})

describe('isExpiresInValid', () => {
  it('should return false when input is not suitable', () => {
    expect(isExpiresInValid(undefined)).toBe(false)
    expect(isExpiresInValid(NaN)).toBe(false)
    expect(isExpiresInValid(0)).toBe(false)
    expect(isExpiresInValid(-1)).toBe(false)
    expect(isExpiresInValid(-123)).toBe(false)
  })

  it('should return true when input is suitable', () => {
    expect(isExpiresInValid(1)).toBe(true)
    expect(isExpiresInValid(10)).toBe(true)
    expect(isExpiresInValid(123)).toBe(true)
  })
})

describe('isNotEmptyString', () => {
  it('should return false when input is not suitable', () => {
    expect(isNotEmptyString()).toBe(false)
    expect(isNotEmptyString('')).toBe(false)
  })

  it('should return true when input is suitable', () => {
    expect(isNotEmptyString('a')).toBe(true)
    expect(isNotEmptyString('longer input string')).toBe(true)
  })
})

describe('isSessionTimestampValid', () => {
  it('should return false when input is not suitable', () => {
    expect(isSessionTimestampValid()).toBe(false)
    expect(isSessionTimestampValid('')).toBe(false)
    expect(isSessionTimestampValid(NaN)).toBe(false)
    expect(isSessionTimestampValid(1000)).toBe(false)
    expect(isSessionTimestampValid(0)).toBe(false)
    expect(isSessionTimestampValid(-1)).toBe(false)
    expect(isSessionTimestampValid(-3)).toBe(false)
    expect(isSessionTimestampValid(-1000)).toBe(false)
    expect(isSessionTimestampValid('tomorrow')).toBe(false)
    expect(isSessionTimestampValid(Date.now() - 1)).toBe(false)
  })

  it('should return true when input is suitable', () => {
    expect(isSessionTimestampValid(-2)).toBe(true)
    expect(isSessionTimestampValid(Date.now() + 5000)).toBe(true)
    expect(isSessionTimestampValid((Date.now() + 5000).toString())).toBe(true)
  })
})
