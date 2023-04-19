import { calculateSignature } from './calculateSignature'

describe('calculateSignature', () => {
  test('data set 1', () => {
    const input = {
      secret: 'asda34asfasfj9fuas',
      method: 'post',
      url: 'https://sociallize.us1.gigya.com/socialize.getSDKConfig',
      parameters: {
        ApiKey: 'asdkjasd83rffhsf8923rf2',
      },
    }

    expect(calculateSignature(input.secret, input.method, input.url, input.parameters)).toBe(
      'fe4zimftu84s42OaQInV/RM+XJo=',
    )
  })

  test('data set 2', () => {
    const input = {
      secret: 'DJ5hTAlTs3FGbiFk4gumYU99Of0=',
      method: 'post',
      url: 'https://accounts.eu1.gigya.com/accounts.login',
      parameters: {
        misc: '~',
        targetEnv: 'mobile',
        oauth_token:
          'st2.s.AcbH-tfxDQ.iqIAkWatFTyZblbpKBcIIH2e2pXqzwFwHmYziokeHfAxAdWypGqM0VD_XX-EOASYzUlSArlYr4TWNhLshAgMdRHX9na8zI70NOtzyQGMP0w.UnjFKH8SA5NYdMLTBzLp9fOFawa84u4MUGoQcRLNYggwXIOiTFkEuMx1KrXrAkWIsTGevJbzaQ0mKG63o72sOw.sc3',
      },
    }

    expect(calculateSignature(input.secret, input.method, input.url, input.parameters)).toBe(
      'jgGlRHTM9Rw0DUYaCH5gbakSV5M=',
    )
  })
})
