import { getEnvironmentConfigurationCdc } from '../../environment-configuration/redux/environment-configuration-selectors'
import { RootState } from '../../redux/configure-store'
import { urlJoin } from '../utils/url-join'

export const buildCdcApiUrl = (path: string, rootState: RootState) => {
  const cdcEnvConfig = getEnvironmentConfigurationCdc(rootState)

  const baseUrl = cdcEnvConfig.baseUrl
  return urlJoin(baseUrl, path)
}
