import { AxiosHeaders, AxiosRequestConfig } from 'axios'

import { getAuthState } from '../../auth/store/auth-selectors'
import { ErrorWithCode } from '../../errors/errors'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { buildCommerceApiUrl } from './build-commerce-api-url'

export const sendCommercePostRequest: CreateQueryFn<{
  path: string
  queryParams?: Record<string, any>
  bodyPayload?: Record<string, any>
}> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const authState = getAuthState(rootState)

  if (!authState.commerce) {
    return { error: new ErrorWithCode('CommerceSessionData is required for this request', api.endpoint) }
  }

  const prepared = prepare(arg, api)
  if (!prepared.queryParams) {
    prepared.queryParams = {}
  }
  if (!prepared.bodyPayload) {
    prepared.bodyPayload = {}
  }

  const url = buildCommerceApiUrl(prepared.path, rootState)

  const headers = new AxiosHeaders()
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Bearer ${authState.commerce.access_token}`)

  const args: AxiosRequestConfig = {
    url,
    headers,
    method: 'POST',
    params: prepared.queryParams,
    data: prepared.bodyPayload,
  }

  return baseQuery(args, api, extraOptions)
}
