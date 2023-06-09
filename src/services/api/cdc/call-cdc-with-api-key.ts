import { getCurrentEnvironmentConfigurationName } from '../../environment-configuration/redux/environment-configuration-selectors'
import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { encodeBodyPayload } from '../utils/encode-body-payload'
import { appendCdcDefaultParameters } from './append-cdc-default-parameters'
import { buildCdcApiUrl } from './build-cdc-api-url'
import { sendCdcPostRequest } from './send-cdc-post-request'

export const callCdcWithApiKey: CreateQueryFn<{
  path: string
  bodyPayload?: Record<string, any>
}> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const envConfigName = getCurrentEnvironmentConfigurationName(rootState)
  const cdcEnvConfig = getEnvironmentConfig(envConfigName).cdc

  const prepared = prepare(arg, api)
  if (!prepared.bodyPayload) {
    prepared.bodyPayload = {}
  }

  const url = buildCdcApiUrl(prepared.path, rootState)

  const bodyPayload = appendCdcDefaultParameters(prepared.bodyPayload)
  bodyPayload.apiKey = cdcEnvConfig.apiKey

  const bodyPayloadWithEncodedValues = encodeBodyPayload(bodyPayload)

  return sendCdcPostRequest(url, bodyPayloadWithEncodedValues, api, extraOptions, baseQuery)
}
