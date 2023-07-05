import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { EnvironmentConfiguration } from '../environment-configuration'
import { getCurrentEnvironmentConfigurationName } from '../redux/environment-configuration-selectors'
import { getEnvironmentConfig } from '../utils'

export const useEnvironmentConfiguration = (): EnvironmentConfiguration => {
  const envConfigName = useSelector(getCurrentEnvironmentConfigurationName)
  const environmentConfig = useMemo(() => {
    const envConfig = getEnvironmentConfig(envConfigName)
    if (envConfig === undefined) {
      const message = `No Environment Configuration found."
      + "This error should not happen, please be sure to build the app correctly`
      console.error(message)
      throw new Error(message)
    }
    return envConfig
  }, [envConfigName])
  return environmentConfig
}

export const useEnvironmentConfigurationCommerce = () => {
  return useEnvironmentConfiguration().commerce
}

export const useEnvironmentConfigurationCdc = () => {
  return useEnvironmentConfiguration().cdc
}
