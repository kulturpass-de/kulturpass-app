import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { ErrorWithCode } from '../../errors/errors'
import { RootState } from '../../redux/configure-store'
import { configureMockStore } from '../../testing/configure-mock-store'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'
import { callCdcWithSessionInfoSigned } from './call-cdc-with-session-info-signed'
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

describe('call-cdc-with-session-info-signed', () => {
  const preloadedState = {
    auth: { cdc: { sessionToken: 'my_session_token', sessionSecret: 'my_session_secret' } },
  } as RootState
  const store = configureMockStore({ preloadedState })

  type Result = string
  type Params = { text: string }

  const arg: Params = { text: 'some_text_param' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}
  const baseQuery: AxiosBaseQueryFn<string> = (_args, _api, _extraOptions) => ({ data: '' })

  it('should call given prepare with arg and api', async () => {
    const prepare = jest.fn(() => ({ path: '' }))

    callCdcWithSessionInfoSigned<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

    expect(prepare).toBeCalledWith(arg, api)
  })

  it('should call sendCdcPostRequest with correct parameters', async () => {
    const cdcEnvConfig = getEnvironmentConfig(
      store.getState().persisted.environmentConfiguration.currentEnvironmentName,
    ).cdc

    const prepare = () => ({ path: 'my_path', sessionToken: 'my_session_token', sessionSecret: 'my_session_secret' })

    const result = await callCdcWithSessionInfoSigned<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

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
      const cdcEnvConfig = getEnvironmentConfig(
        store.getState().persisted.environmentConfiguration.currentEnvironmentName,
      ).cdc

      const prepare = () => ({
        path: 'my_path',
        bodyPayload: {
          some: 'simple_payload',
          thisShouldBeExcluded: undefined,
          another: { more: { complex: ['payload', 123] } },
          andNull: null,
        },
      })

      const result = await callCdcWithSessionInfoSigned<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

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

  describe('when sessionToken or sessionSecret do not exist in the redux store', () => {
    it('should return a redux compatible ErrorWithCode', async () => {
      const storeWithoutSessionInfo = configureMockStore()

      const apiWithoutSessionInfo = { getState: storeWithoutSessionInfo.getState } as BaseQueryApi

      const prepare = () => ({
        path: 'my_path',
        bodyPayload: {
          some: 'simple_payload',
          thisShouldBeExcluded: undefined,
          another: { more: { complex: ['payload'] } },
        },
      })

      const result = await callCdcWithSessionInfoSigned<Result, Params>(prepare)(
        arg,
        apiWithoutSessionInfo,
        extraOptions,
        baseQuery,
      )

      expect(result).toHaveProperty('error')
      expect(result.error).toBeInstanceOf(ErrorWithCode)
    })
  })
})
