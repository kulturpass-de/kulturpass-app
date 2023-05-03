import { calculateSignature } from './calculate-signature'

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

  test('data set 3', () => {
    const input = {
      secret: '4b/KIh3vxBur8/MuF9QuDKsT/kY=',
      method: 'post',
      url: 'https://accounts.eu1.gigya.com/accounts.setAccountInfo',
      parameters: {
        targetEnv: 'mobile',
        timestamp: '1682582343',
        nonce: '1682582343310_194953783096',
        data: JSON.stringify({
          preferredPostalCode: '21321',
          preferredProductCategoryId1: 'concertAndStage',
          preferredProductCategoryId2: 'museumAndPark',
          preferredProductCategoryId3: null,
          preferredProductCategoryId4: null,
        }),
        oauth_token:
          'st2.s.AcbHnAC57Q.sPhiFnMoHpNVtN0L4w-vo56oH232LMSjlPCOXNoEyV0u0t1YDii-dJCf39r0guiYA3wHNPYYvm3KX16B9bX85QUJisQaKAbKJYaOq5Fc4ZM._j1hY772CpA7LrrlsYd8YRU5WRiSKHsf_4SdreL_qSfwvGqMqXrWRqXYddDel4mYEO0z7pzmc9UFsipK4bLzdg.sc3',
        apiKey: '4_2g1jeuAFipNhVuN-xkILiw',
      },
    }

    expect(calculateSignature(input.secret, input.method, input.url, input.parameters)).toBe(
      'hTsQ3COu0JDu7dgxMXsV7/d3h68=',
    )
  })
})
