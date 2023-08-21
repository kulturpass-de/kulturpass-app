import { CDC_SESSION_EXPIRATION_INFINITE } from '../../api/cdc-constants'
import { AccountsLoginResponse } from '../../api/types'
import { CdcSessionData, CommerceSessionData } from '../../session/types'
import {
  cdcLoginResponseToSessionData,
  isCdcSessionValid,
  isCommerceSessionValid,
  isNotEmptyString,
  isUserLoggedInToCdc,
  isUserLoggedInToCommerce,
} from './utils'

describe('cdcLoginResponseToSessionData', () => {
  const input = {
    signatureTimestamp: 12345,
    id_token: 'my_id_token',
    UID: 'uid',
    UIDSignature: 'uid_signature',
    profile: { firstName: 'my_first_name', email: 'test@test.test' },
    sessionInfo: { sessionToken: 'my_session_token', sessionSecret: 'my_session_secret' },
    isVerified: true,
  } as any as AccountsLoginResponse

  const output: CdcSessionData = {
    idToken: 'my_id_token',
    sessionSecret: 'my_session_secret',
    sessionStartTimestamp: 12345000,
    sessionToken: 'my_session_token',
    sessionValidity: -2,
    uid: 'uid',
    uidSignature: 'uid_signature',
    user: { firstName: 'my_first_name', email: 'test@test.test' },
    isVerified: true,
    regToken: undefined,
  }

  it('transform input data as expected with sessionInfo.expires_in being undefined', () => {
    let result = cdcLoginResponseToSessionData(input)
    expect(result).toEqual(output)
  })

  it('transform input data as expected with sessionInfo.expires_in being defined', () => {
    let result = cdcLoginResponseToSessionData({ ...input, sessionInfo: { ...input.sessionInfo, expires_in: '67890' } })
    expect(result).toEqual({ ...output, sessionValidity: 67890000 })
  })
})

describe('isCommerceSessionValid', () => {
  it('should return false when input is not suitable', () => {
    expect(isCommerceSessionValid(undefined)).toBe(false)
    expect(isCommerceSessionValid(NaN)).toBe(false)
    expect(isCommerceSessionValid(0)).toBe(false)
    expect(isCommerceSessionValid(-1)).toBe(false)
    expect(isCommerceSessionValid(-123)).toBe(false)
    expect(isCommerceSessionValid(1)).toBe(false)
  })

  it('should return true when input is suitable', () => {
    expect(isCommerceSessionValid(1, Date.now() + 1000)).toBe(true)
    expect(isCommerceSessionValid(10, Date.now() + 100000)).toBe(true)
    expect(isCommerceSessionValid(123, Date.now() + 2000000)).toBe(true)
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
    expect(isCdcSessionValid(NaN, NaN)).toBe(false)
    expect(isCdcSessionValid(1000, Date.now() - 100000)).toBe(false)
  })

  it('should return true when input is suitable', () => {
    expect(isCdcSessionValid(0, Date.now())).toBe(true)
    expect(isCdcSessionValid(-1, Date.now())).toBe(true)
    expect(isCdcSessionValid(CDC_SESSION_EXPIRATION_INFINITE, Date.now())).toBe(true)
    expect(isCdcSessionValid(5000, Date.now() + 5000)).toBe(true)
  })
})

describe('isUserLoggedInToCdc', () => {
  const pendingUser = {
    isVerified: false,
    regToken: 'adsd',
  }
  it('should return false when cdc session is not logged in', () => {
    expect(isUserLoggedInToCdc(null)).toBe(false)
    expect(
      isUserLoggedInToCdc({
        ...pendingUser,
        sessionValidity: 1000,
        sessionStartTimestamp: Date.now() - 5000,
      } as CdcSessionData),
    ).toBe(false)
    expect(
      isUserLoggedInToCdc({
        sessionToken: 'TEST',
        sessionSecret: 'TEST',
        sessionValidity: 1000,
        sessionStartTimestamp: Date.now() - 5000,
      } as CdcSessionData),
    ).toBe(false)
    expect(
      isUserLoggedInToCdc({
        sessionToken: 'TEST',
        sessionValidity: 1000,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(false)
    expect(
      isUserLoggedInToCdc({
        sessionSecret: 'TEST',
        sessionValidity: 1000,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(false)
  })

  it('should return true when cdc session is logged in', () => {
    expect(
      isUserLoggedInToCdc({
        ...pendingUser,
        sessionValidity: 3000,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(true)
    expect(
      isUserLoggedInToCdc({
        ...pendingUser,
        sessionValidity: 0,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(true)
    expect(
      isUserLoggedInToCdc({
        ...pendingUser,
        sessionValidity: CDC_SESSION_EXPIRATION_INFINITE,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(true)
    expect(
      isUserLoggedInToCdc({
        sessionToken: 'TEST',
        sessionSecret: 'TEST',
        sessionValidity: 3000,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(true)
    expect(
      isUserLoggedInToCdc({
        sessionToken: 'TEST',
        sessionSecret: 'TEST',
        sessionValidity: 0,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(true)
    expect(
      isUserLoggedInToCdc({
        sessionToken: 'TEST',
        sessionSecret: 'TEST',
        sessionValidity: -2,
        sessionStartTimestamp: Date.now(),
      } as CdcSessionData),
    ).toBe(true)
  })
})

describe('isUserLoggedInToCommerce', () => {
  it('should return false when commerce session is not logged in', () => {
    expect(isUserLoggedInToCommerce(null)).toBe(false)
    expect(
      isUserLoggedInToCommerce({
        access_token: '',
        expires_in: 3000,
        token_valid_until: Date.now() + 3000,
      } as CommerceSessionData),
    ).toBe(false)
    expect(
      isUserLoggedInToCommerce({
        access_token: 'test',
        expires_in: -1,
        token_valid_until: Date.now() + 3000,
      } as CommerceSessionData),
    ).toBe(false)
    expect(
      isUserLoggedInToCommerce({
        access_token: 'test',
        expires_in: 3000,
        token_valid_until: Date.now() - 3000,
      } as CommerceSessionData),
    ).toBe(false)
    expect(
      isUserLoggedInToCommerce({
        access_token: 'test',
        expires_in: 3000,
        token_valid_until: undefined,
      } as CommerceSessionData),
    ).toBe(false)
  })

  it('should return true when commerce session is logged in', () => {
    expect(
      isUserLoggedInToCommerce({
        access_token: 'test',
        expires_in: 3000,
        token_valid_until: Date.now() + 3000,
      } as CommerceSessionData),
    ).toBe(true)
  })
})
