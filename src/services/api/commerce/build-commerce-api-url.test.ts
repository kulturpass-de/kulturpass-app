import { buildCommerceApiUrl } from './build-commerce-api-url'
import { RootState } from '../../redux/configure-store'

describe('build-commerce-api-url', () => {
  it('should concat given path with the commerce baseSiteId and basedUrl in the given rootState', async () => {
    const rootState = {
      persisted: {
        environmentConfiguration: {
          currentEnvironment: { commerce: { baseSiteId: 'baseSiteId', baseUrl: 'https://baseUrl' } },
        },
      },
    } as RootState

    const res = buildCommerceApiUrl('some-path-of-url', rootState)

    expect(res).toBe('https://baseUrl/baseSiteId/some-path-of-url')
  })
})
