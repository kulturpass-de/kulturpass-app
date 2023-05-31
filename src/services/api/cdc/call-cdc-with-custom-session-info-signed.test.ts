import { getEnvironmentConfigurationCdc } from '../../environment-configuration/redux/environment-configuration-selectors'
import { configureMockStore } from '../../testing/configure-mock-store'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'
import { callCdcWithCustomSessionInfoSigned } from './call-cdc-with-custom-session-info-signed'
import { sendCdcPostRequest } from './send-cdc-post-request'

jest.mock('./send-cdc-post-request', () => ({
  sendCdcPostRequest: jest.fn(() => ({ data: 'my_result' })),
}))

jest.mock('../utils/create-nonce', () => ({
  createNonce: () => 'my_nonce',
}))

jest.mock('../utils/current-timestamp-seconds-as-string', () => ({
  currentTimestampSecondsAsString: () => 'my_timestamp',
}))

jest.mock('../utils/calculate-signature', () => ({
  calculateSignature: () => 'my_signature',
}))

describe('call-cdc-with-custom-session-info-signed', () => {
  const store = configureMockStore()

  type Result = string
  type Params = { text: string }

  const arg: Params = { text: 'some_text_param' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}
  const baseQuery: AxiosBaseQueryFn<string> = (_args, _api, _extraOptions) => ({ data: '' })

  it('should call given prepare with arg and api', async () => {
    const prepare = jest.fn(() => ({
      path: '',
      sessionToken: '',
      sessionSecret: '',
    }))

    callCdcWithCustomSessionInfoSigned<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

    expect(prepare).toBeCalledWith(arg, api)
  })

  it('should call sendCdcPostRequest with correct parameters', async () => {
    const cdcEnvConfig = getEnvironmentConfigurationCdc(store.getState())

    const prepare = () => ({ path: 'my_path', sessionToken: 'my_session_token', sessionSecret: 'my_session_secret' })

    const result = await callCdcWithCustomSessionInfoSigned<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

    expect(sendCdcPostRequest).toHaveBeenCalledWith(
      'http://localhost/cdc/my_path',
      {
        apiKey: cdcEnvConfig.apiKey,
        nonce: 'my_nonce',
        targetEnv: 'mobile',
        timestamp: 'my_timestamp',
        oauth_token: 'my_session_token',
        sig: 'my_signature',
      },
      api,
      extraOptions,
      baseQuery,
    )

    expect(result).toEqual({ data: 'my_result' })
  })

  describe('when bodyPayload is provided by prepare', () => {
    it('should call sendCdcPostRequest with correct parameters', async () => {
      const cdcEnvConfig = getEnvironmentConfigurationCdc(store.getState())

      const prepare = () => ({
        path: 'my_path',
        bodyPayload: {
          some: 'simple_payload',
          thisShouldBeExcluded: undefined,
          another: { more: { complex: ['payload', 123] } },
          andNull: null,
        },
        sessionToken: 'my_session_token',
        sessionSecret: 'my_session_secret',
      })

      const result = await callCdcWithCustomSessionInfoSigned<Result, Params>(prepare)(
        arg,
        api,
        extraOptions,
        baseQuery,
      )

      expect(sendCdcPostRequest).toHaveBeenCalledWith(
        'http://localhost/cdc/my_path',
        {
          apiKey: cdcEnvConfig.apiKey,
          nonce: 'my_nonce',
          targetEnv: 'mobile',
          timestamp: 'my_timestamp',
          oauth_token: 'my_session_token',
          sig: 'my_signature',
          some: 'simple_payload',
          another: '{"more":{"complex":["payload",123]}}',
          andNull: 'null',
        },
        api,
        extraOptions,
        baseQuery,
      )

      expect(result).toEqual({ data: 'my_result' })
    })
  })
})
