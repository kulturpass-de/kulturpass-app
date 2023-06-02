import { RootState } from '../../redux/configure-store'
import { buildCdcApiUrl } from './build-cdc-api-url'

jest.mock('../../environment-configuration/utils', () => {
  return {
    getEnvironmentConfig: jest.fn(() => ({
      cdc: {
        baseUrl: 'https://baseUrl.com',
      },
    })),
  }
})

describe('build-cdc-api-url', () => {
  it('should concat given path with the cdc basedUrl in the given rootState', async () => {
    const rootState = {
      persisted: {
        environmentConfiguration: {
          currentEnvironmentName: 'test',
        },
      },
    } as RootState

    const res = buildCdcApiUrl('some-path-of-url', rootState)

    expect(res).toBe('https://baseUrl.com/some-path-of-url')
  })
})
