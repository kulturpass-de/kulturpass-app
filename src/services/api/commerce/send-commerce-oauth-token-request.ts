import { AxiosHeaders, AxiosRequestConfig } from 'axios'

import { getCurrentEnvironmentConfigurationName } from '../../environment-configuration/redux/environment-configuration-selectors'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { getEnvironmentConfig } from '../../environment-configuration/utils'

export const sendCommerceOauthTokenRequest: CreateQueryFn<{
  queryParams: Record<string, any>
}> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const envConfigName = getCurrentEnvironmentConfigurationName(rootState)
  const commerceEnvConfig = getEnvironmentConfig(envConfigName).commerce

  const prepared = prepare(arg, api)
  prepared.queryParams.baseSite = commerceEnvConfig.baseSiteId
  prepared.queryParams.client_id = commerceEnvConfig.auth.clientId
  prepared.queryParams.client_secret = commerceEnvConfig.auth.clientSecret
  prepared.queryParams.grant_type = 'custom'

  const url = commerceEnvConfig.auth.tokenEndpoint

  const headers = new AxiosHeaders()
  headers.set('Content-Type', 'application/json')

  const args: AxiosRequestConfig = { url, method: 'POST', headers, params: prepared.queryParams, data: {} }

  return baseQuery(args, api, extraOptions)
}
