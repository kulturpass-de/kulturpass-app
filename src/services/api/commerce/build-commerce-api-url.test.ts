import { RootState } from '../../redux/configure-store'
import { buildCommerceApiUrl } from './build-commerce-api-url'

jest.mock('../../environment-configuration/utils', () => {
  return {
    getEnvironmentConfig: jest.fn(() => ({ commerce: { baseSiteId: 'baseSiteId', baseUrl: 'https://baseUrl' } })),
  }
})

describe('build-commerce-api-url', () => {
  it('should concat given path with the commerce baseSiteId and basedUrl in the given rootState', async () => {
    const rootState = {
      persisted: {
        environmentConfiguration: { currentEnvironmentName: 'test' },
      },
    } as RootState

    const res = buildCommerceApiUrl('some-path-of-url', rootState)

    expect(res).toBe('https://baseUrl/baseSiteId/some-path-of-url')
  })
})
