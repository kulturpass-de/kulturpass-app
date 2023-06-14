import { EnvironmentConfigurationContent } from './environment-configuration'
import { getEnvironmentConfig } from './utils'

jest.mock('../environment-configuration/environment-configuration', () => ({
  environmentConfigurations: {
    data: [
      {
        name: 'test',
      },
      {
        name: 'test2',
      },
    ],
  } as EnvironmentConfigurationContent,
}))

describe('getEnvironmentConfig', () => {
  it('should load the first environment config with a non valid name', async () => {
    const envConfig = getEnvironmentConfig(undefined)

    expect(envConfig.name).toBe('test')

    const envConfig2 = getEnvironmentConfig('NONVALID')

    expect(envConfig2.name).toBe('test')
  })

  it('should load the environment config with a given name', async () => {
    const envConfig = getEnvironmentConfig('test')

    expect(envConfig.name).toBe('test')

    const envConfig2 = getEnvironmentConfig('test2')

    expect(envConfig2.name).toBe('test2')
  })
})
