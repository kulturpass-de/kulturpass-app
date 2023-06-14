import { EnvironmentConfiguration, environmentConfigurations } from './environment-configuration'

// Cache environment configuration for faster access
let environmentCache: EnvironmentConfiguration | undefined

export const getEnvironmentConfig = (name?: string): EnvironmentConfiguration => {
  if (environmentCache?.name !== undefined && environmentCache.name === name) {
    return environmentCache
  } else {
    const foundEnv = environmentConfigurations.data.find(conf => conf.name === name)
    if (foundEnv !== undefined) {
      environmentCache = foundEnv
      return foundEnv
    } else {
      return environmentConfigurations.data[0]
    }
  }
}
