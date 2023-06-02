import { getCdcSessionData } from '../../auth/store/auth-selectors'
import { getCurrentEnvironmentConfigurationName } from '../../environment-configuration/redux/environment-configuration-selectors'
import { ErrorWithCode } from '../../errors/errors'
import { RootState } from '../../redux/configure-store'
import { CreateQueryFn } from '../common/types'
import { calculateSignature } from '../utils/calculate-signature'
import { appendCdcDefaultParameters } from './append-cdc-default-parameters'
import { buildCdcApiUrl } from './build-cdc-api-url'
import { encodeBodyPayload } from '../utils/encode-body-payload'
import { sendCdcPostRequest } from './send-cdc-post-request'
import { getEnvironmentConfig } from '../../environment-configuration/utils'

export const callCdcWithSessionInfoSigned: CreateQueryFn<{
  path: string
  bodyPayload?: Record<string, any>
}> = prepare => async (arg, api, extraOptions, baseQuery) => {
  const rootState = api.getState() as RootState
  const envConfigName = getCurrentEnvironmentConfigurationName(rootState)
  const cdcEnvConfig = getEnvironmentConfig(envConfigName).cdc
  const cdcSessionData = getCdcSessionData(rootState)

  if (!cdcSessionData?.sessionSecret || !cdcSessionData.sessionToken) {
    return { error: new ErrorWithCode('CdcSessionData is required for this request', api.endpoint) }
  }

  const prepared = prepare(arg, api)
  if (!prepared.bodyPayload) {
    prepared.bodyPayload = {}
  }

  const url = buildCdcApiUrl(prepared.path, rootState)

  const bodyPayload = appendCdcDefaultParameters(prepared.bodyPayload)
  bodyPayload.apiKey = cdcEnvConfig.apiKey
  bodyPayload.oauth_token = cdcSessionData.sessionToken

  const bodyPayloadWithEncodedValues = encodeBodyPayload(bodyPayload)
  bodyPayloadWithEncodedValues.sig = calculateSignature(
    cdcSessionData.sessionSecret,
    'POST',
    url,
    bodyPayloadWithEncodedValues,
  )

  return sendCdcPostRequest(url, bodyPayloadWithEncodedValues, api, extraOptions, baseQuery)
}
