import { AxiosHeaders } from 'axios'
import { ErrorWithCode } from '../../errors/errors'
import { RootState } from '../../redux/configure-store'
import { configureMockStore } from '../../testing/configure-mock-store'
import { jestFn } from '../../testing/jest-fn'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'
import { sendCommercePostRequest } from './send-commerce-post-request'

jest.mock('../../environment-configuration/utils', () => {
  return {
    getEnvironmentConfig: jest.fn(() => ({
      commerce: {
        baseSiteId: 'my_base_site_id',
        baseUrl: 'http://my_base_url',
      },
    })),
  }
})

describe('send-commerce-post-request', () => {
  const preloadedState = {
    auth: { commerce: { access_token: 'my_access_token' } },
    persisted: {
      environmentConfiguration: {
        currentEnvironmentName: 'test',
      },
    },
  } as RootState
  const store = configureMockStore({ preloadedState })

  const arg = { text: 'some_text_param' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}

  it('should call given prepare with arg and api', async () => {
    const prepare = jest.fn(() => ({ path: '' }))
    const baseQuery: AxiosBaseQueryFn<string> = (_args, _api, _extraOptions) => ({ data: '' })

    sendCommercePostRequest(prepare)(arg, api, extraOptions, baseQuery)

    expect(prepare).toBeCalledWith(arg, api)
  })

  it('should return a redux compatible ErrorWithCode if commerce authState is undefined', async () => {
    const preloadedStateWithoutCommerceAuthState = {} as RootState
    const storeWithoutCommerceAuthState = configureMockStore({ preloadedState: preloadedStateWithoutCommerceAuthState })
    const apiWithoutCommerceAuthState = { getState: storeWithoutCommerceAuthState.getState } as BaseQueryApi
    const prepare = () => ({ path: 'my_path' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    const result = await sendCommercePostRequest(prepare)(arg, apiWithoutCommerceAuthState, extraOptions, baseQuery)

    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(ErrorWithCode)
  })

  it('should call baseQuery with queryParams returned by prepare', async () => {
    const queryParams = {
      some: 'query_params',
      and: ['some', 123, 'more', null],
      evenWith: undefined,
    }
    const prepare = () => ({ path: 'my_path', queryParams })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommercePostRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ params: expect.objectContaining(queryParams) })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with bodyPayload returned by prepare', async () => {
    const bodyPayload = {
      some: 'query_params',
      and: ['some', 123, 'more', null],
      evenWith: undefined,
    }
    const prepare = () => ({ path: 'my_path', bodyPayload })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommercePostRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ data: expect.objectContaining(bodyPayload) })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery url build from path returned by prepare and commerce environment configuration', async () => {
    const prepare = () => ({ path: 'my_path' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommercePostRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ url: 'http://my_base_url/my_base_site_id/my_path' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQUery with Authorization header and Content-Type header set to application/json', async () => {
    const prepare = () => ({ path: 'my_path' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommercePostRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({
      headers: new AxiosHeaders({ Authorization: 'Bearer my_access_token', 'Content-Type': 'application/json' }),
    })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQUery with method POST', async () => {
    const prepare = () => ({ path: 'my_path' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommercePostRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ method: 'POST' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })
})
