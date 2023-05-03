import { getEnvironmentConfigurationCommerce } from '../../environment-configuration/redux/environment-configuration-selectors'
import { RootState } from '../../redux/configure-store'
import { urlJoin } from '../utils/url-join'

export const buildCommerceApiUrl = (path: string, rootState: RootState) => {
  const commerceEnvConfig = getEnvironmentConfigurationCommerce(rootState)

  const baseUrl = commerceEnvConfig.baseUrl
  const baseSiteId = commerceEnvConfig.baseSiteId
  return urlJoin(baseUrl, baseSiteId, path)
}
