import { getCurrentEnvironmentConfigurationName } from '../../environment-configuration/redux/environment-configuration-selectors'
import { getEnvironmentConfig } from '../../environment-configuration/utils'
import { RootState } from '../../redux/configure-store'
import { urlJoin } from '../utils/url-join'

export const buildCommerceApiUrl = (path: string, rootState: RootState) => {
  const envConfigName = getCurrentEnvironmentConfigurationName(rootState)
  const commerceEnvConfig = getEnvironmentConfig(envConfigName).commerce

  const baseUrl = commerceEnvConfig.baseUrl
  const baseSiteId = commerceEnvConfig.baseSiteId
  return urlJoin(baseUrl, baseSiteId, path)
}
