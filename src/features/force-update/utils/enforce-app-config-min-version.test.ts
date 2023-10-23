import { rootNavigationRef } from '../../../navigation/navigation-container'
import { ForceUpdateRouteName } from '../../../screens/app/force-update-route'
import { AppConfig } from '../../../services/redux/versions/current'
import { enforceAppConfigMinVersion } from './enforce-app-config-min-version'

jest.mock('../../../../package.json', () => ({ version: '0.5.0' }))

describe('enforce-app-config-min-version', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should call rootNavigationRef.reset if appConfig min version is higher than package.json one', async () => {
    const reset = jest.spyOn(rootNavigationRef, 'reset').mockImplementation(() => {})

    enforceAppConfigMinVersion({ appVersions: { min: '0.6.0' } } as AppConfig)

    expect(reset).toBeCalledWith({
      index: 0,
      routes: [{ name: 'Modal', state: { routes: [{ name: ForceUpdateRouteName }] } }],
    })
  })

  it('should not call rootNavigationRef.reset if appConfig min version is lower than package.json one', async () => {
    const reset = jest.spyOn(rootNavigationRef, 'reset').mockImplementation(() => {})

    enforceAppConfigMinVersion({ appVersions: { min: '0.3.89' } } as AppConfig)

    expect(reset).toBeCalledTimes(0)
  })
})
