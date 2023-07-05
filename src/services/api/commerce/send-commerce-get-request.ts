import { AxiosHeaders, AxiosRequestConfig } from 'axios'
import { getAuthState } from '../../auth/store/auth-selectors'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { appendLanguageParameters } from './append-language-parameters'
import { appendLocationParameters } from './append-location-parameters'
import { buildCommerceApiUrl } from './build-commerce-api-url'

export const sendCommerceGetRequest: CreateQueryFn<
  ({ path: string } | { url: string }) & {
    queryParams?: Record<string, any>
    appendLanguageQueryParams?: boolean
    appendLocationQueryParams?: boolean
    appendNoCacheHeader?: boolean
  }
> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const authState = getAuthState(rootState)

  const prepared = prepare(arg, api)
  if (!prepared.queryParams) {
    prepared.queryParams = {}
  }
  if (prepared.appendLanguageQueryParams) {
    prepared.queryParams = appendLanguageParameters(prepared.queryParams)
  }
  if (prepared.appendLocationQueryParams) {
    prepared.queryParams = appendLocationParameters(prepared.queryParams, rootState)
  }

  const url = 'url' in prepared ? prepared.url : buildCommerceApiUrl(prepared.path, rootState)

  const headers = new AxiosHeaders()
  if (authState.commerce?.access_token) {
    headers.set('Authorization', `Bearer ${authState.commerce.access_token}`)
  }
  if (prepared.appendNoCacheHeader) {
    headers.set('Cache-Control', 'no-cache')
  }

  const args: AxiosRequestConfig = { url, headers, method: 'GET', params: prepared.queryParams }

  return baseQuery(args, api, extraOptions)
}
