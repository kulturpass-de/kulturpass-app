import { AxiosHeaders } from 'axios'

import { RootState } from '../../redux/configure-store'
import { configureMockStore } from '../../testing/configure-mock-store'
import { jestFn } from '../../testing/jest-fn'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'
import { sendCommerceGetRequest } from './send-commerce-get-request'

describe('send-commerce-get-request', () => {
  const currentUserLocation = { coords: { latitude: 1, longitude: 2 } }
  const preloadedState = { persisted: { location: { currentUserLocation } } } as RootState
  const store = configureMockStore({ preloadedState })

  const arg = { text: 'some_text_param' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}

  it('should call given prepare with arg and api', async () => {
    const prepare = jestFn()
    const baseQuery: AxiosBaseQueryFn<string> = (_args, _api, _extraOptions) => ({ data: '' })

    sendCommerceGetRequest(prepare)(arg, api, extraOptions, baseQuery)

    expect(prepare).toBeCalledWith(arg, api)
  })

  it('should call baseQuery with queryParams returned by prepare', async () => {
    const queryParams = { my: { query: 'params' } }
    const prepare = () => ({ path: 'my_path', queryParams })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceGetRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ params: queryParams })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should append language parameters to queryParams', async () => {
    const prepare = () => ({ path: 'my_path', appendLanguageQueryParams: true })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceGetRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ params: { lang: 'de' } })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should append location parameters to queryParams', async () => {
    const prepare = () => ({ path: 'my_path', appendLocationQueryParams: true })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceGetRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ params: { userLocation: '1,2' } })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with url returned by prepare', async () => {
    const prepare = () => ({ url: 'my_url' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceGetRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ url: 'my_url' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should create url from path returned by prepare and call baseQuery with it', async () => {
    const prepare = () => ({ path: 'my_path' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceGetRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ url: 'http://localhost/cc/kulturapp/my_path' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })

  it('should have Authorization header if access_token exists in the redux store', async () => {
    const storeWithAccessToken = configureMockStore({
      preloadedState: { auth: { commerce: { access_token: 'my_access_token' } } } as RootState,
    })
    const apiWithAccessToken = { getState: storeWithAccessToken.getState } as BaseQueryApi
    const prepare = () => ({ path: 'my_path' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceGetRequest(prepare)(arg, apiWithAccessToken, extraOptions, baseQuery)

    const args = expect.objectContaining({ headers: new AxiosHeaders({ Authorization: 'Bearer my_access_token' }) })

    expect(baseQuery).toBeCalledWith(args, apiWithAccessToken, extraOptions)
  })

  it('should call baseQuery with method GET', async () => {
    const prepare = () => ({ path: 'my_path' })
    const baseQuery = jestFn<AxiosBaseQueryFn<string>>((_args, _api, _extraOptions) => ({ data: '' }))

    sendCommerceGetRequest(prepare)(arg, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ method: 'GET' })

    expect(baseQuery).toBeCalledWith(args, api, extraOptions)
  })
})
