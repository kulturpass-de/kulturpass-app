import { AxiosHeaders, AxiosRequestConfig } from 'axios'

import { getCurrentEnvironmentConfigurationName } from '../../environment-configuration/redux/environment-configuration-selectors'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { encodeBodyPayload } from '../utils/encode-body-payload'

export const sendCommerceRevokeOauthTokenRequest: CreateQueryFn<{
  data?: Record<string, any>
}> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const envConfigName = getCurrentEnvironmentConfigurationName(rootState)
  const commerceEnvConfig = getEnvironmentConfig(envConfigName).commerce

  const prepared = prepare(arg, api)
  if (!prepared.data) {
    prepared.data = {}
  }

  const bodyPayloadWithEncodedValues = encodeBodyPayload(prepared.data)

  const url = commerceEnvConfig.auth.revocationEndpoint

  const headers = new AxiosHeaders()
  headers.set('Content-Type', 'application/x-www-form-urlencoded')

  const args: AxiosRequestConfig = { url, method: 'POST', headers, data: bodyPayloadWithEncodedValues }

  return baseQuery(args, api, extraOptions)
}
