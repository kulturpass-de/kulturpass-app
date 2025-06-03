import { AxiosHeaders } from 'axios'
import { RootState } from '../../redux/configure-store'
import { configureMockStore } from '../../testing/configure-mock-store'
import { jestFn } from '../../testing/jest-fn'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'
import { sendCommerceRevokeOauthTokenRequest } from './send-commerce-revoke-oauth-token-request'

jest.mock('../../environment-configuration/utils', () => {
  return {
    getEnvironmentConfig: jest.fn(() => ({
      commerce: { auth: { revocationEndpoint: 'http://my_token_revocation_endpoint' } },
    })),
  }
})

describe('send-commerce-revoke-oauth-token-request', () => {
  const preloadedState = { persisted: { environmentConfiguration: { currentEnvironmentName: 'test' } } } as RootState
  const store = configureMockStore({ preloadedState })

  const arg = { text: 'some_text_param' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}

  it('should call given prepare with arg and api', async () => {
    const prepare = jest.fn(() => ({ data: {} }))
    const baseQuery = ((_args: any, _api: BaseQueryApi, _extraOptions: {}) => ({
      data: '',
    })) as AxiosBaseQueryFn<string>

    sendCommerceRevokeOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    expect(prepare).toBeCalledWith(arg, api)
  })

  it('should call baseQuery with bodyPayload returned by prepare', async () => {
    const bodyPayloadWithEncodedValues = { some: 'values', will: 'be', put: 'here' }
    const prepare = () => ({ data: bodyPayloadWithEncodedValues })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args: any, _api: BaseQueryApi, _extraOptions: {}) => ({
      data: '',
    }))

    sendCommerceRevokeOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ data: bodyPayloadWithEncodedValues })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with url from commerce environment configuration', async () => {
    const prepare = () => ({ data: {} })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args: any, _api: BaseQueryApi, _extraOptions: {}) => ({
      data: '',
    }))

    sendCommerceRevokeOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ url: 'http://my_token_revocation_endpoint' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with header Content-Type set to application/x-www-form-urlencoded', async () => {
    const prepare = () => ({ data: {} })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args: any, _api: BaseQueryApi, _extraOptions: {}) => ({
      data: '',
    }))

    sendCommerceRevokeOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({
      headers: new AxiosHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with method POST', async () => {
    const prepare = () => ({ data: {} })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args: any, _api: BaseQueryApi, _extraOptions: {}) => ({
      data: '',
    }))

    sendCommerceRevokeOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ method: 'POST' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })
})
