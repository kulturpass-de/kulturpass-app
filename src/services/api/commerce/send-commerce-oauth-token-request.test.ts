import { AxiosHeaders } from 'axios'
import { RootState } from '../../redux/configure-store'
import { configureMockStore } from '../../testing/configure-mock-store'
import { jestFn } from '../../testing/jest-fn'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'
import { sendCommerceOauthTokenRequest } from './send-commerce-oauth-token-request'

jest.mock('../../environment-configuration/utils', () => {
  return {
    getEnvironmentConfig: jest.fn(() => ({
      commerce: {
        baseSiteId: 'my_base_site_id',
        auth: {
          clientId: 'my_client_id',
          clientSecret: 'my_client_secret',
          tokenEndpoint: 'http://my_token_endpoint',
        },
      },
    })),
  }
})

describe('send-commerce-oauth-token-request', () => {
  const preloadedState = {
    persisted: {
      environmentConfiguration: { currentEnvironmentName: 'test' },
    },
  } as RootState
  const store = configureMockStore({ preloadedState })

  const arg = { text: 'some_text_param' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}

  it('should call given prepare with arg and api', async () => {
    const prepare = jest.fn(() => ({ queryParams: {} }))
    const baseQuery: AxiosBaseQueryFn<string> = (_args, _api, _extraOptions) => ({ data: '' })

    sendCommerceOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    expect(prepare).toBeCalledWith(arg, api)
  })

  it('should call baseQuery with queryParams returned by prepare', async () => {
    const queryParams = {
      some: 'query_params',
      and: ['some', 123, 'more', null],
      evenWith: undefined,
    }
    const prepare = () => ({ queryParams })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ params: expect.objectContaining(queryParams) })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with extra properties from commerce envronment configuration in params', async () => {
    const prepare = () => ({ queryParams: {} })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({
      params: {
        baseSite: 'my_base_site_id',
        client_id: 'my_client_id',
        client_secret: 'my_client_secret',
        grant_type: 'custom',
      },
    })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with url from commerce envronment configuration', async () => {
    const prepare = () => ({ queryParams: {} })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ url: 'http://my_token_endpoint' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with header Content-Type set to application/json', async () => {
    const prepare = () => ({ queryParams: {} })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ headers: new AxiosHeaders({ 'Content-Type': 'application/json' }) })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with method POST', async () => {
    const prepare = () => ({ queryParams: {} })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceOauthTokenRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ method: 'POST' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })
})
