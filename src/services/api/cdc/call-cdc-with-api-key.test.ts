import { getEnvironmentConfigurationCdc } from '../../environment-configuration/redux/environment-configuration-selectors'
import { configureMockStore } from '../../testing/configure-mock-store'
import { jestFn } from '../../testing/jest-fn'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'
import { callCdcWithApiKey } from './call-cdc-with-api-key'
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

describe('call-cdc-with-api-key', () => {
  const store = configureMockStore()

  type Result = string
  type Params = { text: string }

  const arg: Params = { text: 'some_text_param' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}
  const baseQuery: AxiosBaseQueryFn<string> = (_args, _api, _extraOptions) => ({ data: '' })

  it('should call given prepare with arg and api', async () => {
    const prepare = jestFn()

    callCdcWithApiKey<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

    expect(prepare).toBeCalledWith(arg, api)
  })

  it('should call sendCdcPostRequest with correct parameters', async () => {
    const cdcEnvConfig = getEnvironmentConfigurationCdc(store.getState())

    const prepare = () => ({ path: 'my_path' })

    const result = await callCdcWithApiKey<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

    expect(sendCdcPostRequest).toHaveBeenCalledWith(
      'http://localhost/cdc/my_path',
      {
        apiKey: cdcEnvConfig.apiKey,
        nonce: 'my_nonce',
        targetEnv: 'mobile',
        timestamp: 'my_timestamp',
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
          my: { complex: 'payload' },
          with: ['array', 123, { nested: null }],
          andOmittedProperty: undefined,
        },
      })

      const result = await callCdcWithApiKey<Result, Params>(prepare)(arg, api, extraOptions, baseQuery)

      expect(sendCdcPostRequest).toHaveBeenCalledWith(
        'http://localhost/cdc/my_path',
        {
          apiKey: cdcEnvConfig.apiKey,
          nonce: 'my_nonce',
          targetEnv: 'mobile',
          timestamp: 'my_timestamp',
          my: '{"complex":"payload"}',
          with: '["array",123,{"nested":null}]',
        },
        api,
        extraOptions,
        baseQuery,
      )

      expect(result).toEqual({ data: 'my_result' })
    })
  })
})
