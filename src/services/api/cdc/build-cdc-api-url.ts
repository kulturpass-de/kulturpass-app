import { getCurrentEnvironmentConfigurationName } from '../../environment-configuration/redux/environment-configuration-selectors'
import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { RootState } from '../../redux/configure-store'
import { urlJoin } from '../utils/url-join'

export const buildCdcApiUrl = (path: string, rootState: RootState) => {
  const envConfigName = getCurrentEnvironmentConfigurationName(rootState)
  const cdcEnvConfig = getEnvironmentConfig(envConfigName).cdc

  const baseUrl = cdcEnvConfig.baseUrl
  return urlJoin(baseUrl, path)
}
