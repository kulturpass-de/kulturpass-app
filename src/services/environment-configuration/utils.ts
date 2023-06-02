import { EnvironmentConfiguration, environmentConfigurations } from './environment-configuration'

// Cache environment configuration for faster key access
const environmentCache: { [key: string]: EnvironmentConfiguration | undefined } = {}

export const getEnvironmentConfig = (name: string): EnvironmentConfiguration => {
  const env = environmentCache[name]
  if (env !== undefined) {
    return env
  } else {
    const foundEnv = environmentConfigurations.data.find(conf => conf.name === name)
    if (foundEnv !== undefined) {
      environmentCache[name] = foundEnv
      return foundEnv
    } else {
      return environmentConfigurations.data[0]
    }
  }
}
