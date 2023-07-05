import { AxiosHeaders, AxiosRequestConfig } from 'axios'
import { getAuthState } from '../../auth/store/auth-selectors'
import { ErrorWithCode } from '../../errors/errors'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { buildCommerceApiUrl } from './build-commerce-api-url'

export const sendCommerceDeleteRequest: CreateQueryFn<{
  path: string
}> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const authState = getAuthState(rootState)

  if (!authState.commerce) {
    return { error: new ErrorWithCode('CommerceSessionData is required for this request', api.endpoint) }
  }

  const prepared = prepare(arg, api)
  const url = buildCommerceApiUrl(prepared.path, rootState)

  const headers = new AxiosHeaders()
  headers.set('Authorization', `Bearer ${authState.commerce.access_token}`)

  const args: AxiosRequestConfig = {
    url,
    headers,
    method: 'DELETE',
  }

  return baseQuery(args, api, extraOptions)
}
