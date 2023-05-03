import { RootState } from '../../redux/configure-store'
import { buildCdcApiUrl } from './build-cdc-api-url'

describe('build-cdc-api-url', () => {
  it('should concat given path with the cdc basedUrl in the given rootState', async () => {
    const rootState = {
      persisted: {
        environmentConfiguration: {
          currentEnvironment: { cdc: { baseUrl: 'https://baseUrl.com' } },
        },
      },
    } as RootState

    const res = buildCdcApiUrl('some-path-of-url', rootState)

    expect(res).toBe('https://baseUrl.com/some-path-of-url')
  })
})
