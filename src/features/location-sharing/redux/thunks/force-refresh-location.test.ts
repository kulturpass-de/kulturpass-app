import { Platform } from 'react-native'
import { RESULTS } from 'react-native-permissions'
import { locationService } from '../../../../services/location/location-service'
import { refreshLocation } from '../../../../services/location/redux/thunks/refresh-location'
import { configureMockStore } from '../../../../services/testing/configure-mock-store'
import { userSlice } from '../../../../services/user/redux/user-slice'
import { forceRefreshLocation } from './force-refresh-location'

jest.mock('../../../../services/location/location-service', () => ({
  __esModule: true,
  locationService: {
    checkLocationPermission: jest.fn(),
    requestLocationPermission: jest.fn(),
  },
}))

describe('force-refresh-location', () => {
  const store = configureMockStore()

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should force refresh location if permission is granted', async () => {
    const mockCheckLocationPermission = jest.fn(() => Promise.resolve(RESULTS.GRANTED))
    const mockRequestLocationPermission = jest.fn(() => Promise.resolve(RESULTS.DENIED))

    locationService.checkLocationPermission = mockCheckLocationPermission
    locationService.requestLocationPermission = mockRequestLocationPermission
    expect(await store.dispatch(forceRefreshLocation()).unwrap()).toBe(true)

    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestLocationPermission).toHaveBeenCalledTimes(0)

    store.expectActions([
      {
        type: userSlice.actions.setUserDeniedLocationServices.type,
        payload: false,
      },
      {
        type: refreshLocation.fulfilled.type,
      },
    ])
  })

  it('should request location permission and refresh location if permission was denied on iOS', async () => {
    const mockCheckLocationPermission = jest.fn(() => Promise.resolve(RESULTS.DENIED))
    const mockRequestLocationPermission = jest.fn(() => Promise.resolve(RESULTS.GRANTED))
    Platform.OS = 'ios'

    locationService.checkLocationPermission = mockCheckLocationPermission
    locationService.requestLocationPermission = mockRequestLocationPermission
    expect(await store.dispatch(forceRefreshLocation()).unwrap()).toBe(true)

    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestLocationPermission).toHaveBeenCalledTimes(1)

    store.expectActions([
      {
        type: userSlice.actions.setUserDeniedLocationServices.type,
        payload: false,
      },
      {
        type: refreshLocation.fulfilled.type,
      },
    ])
  })

  it('should request location permission and not refresh location if permission and request was denied on iOS', async () => {
    const mockCheckLocationPermission = jest.fn(() => Promise.resolve(RESULTS.DENIED))
    const mockRequestLocationPermission = jest.fn(() => Promise.resolve(RESULTS.DENIED))
    Platform.OS = 'ios'

    locationService.checkLocationPermission = mockCheckLocationPermission
    locationService.requestLocationPermission = mockRequestLocationPermission
    expect(await store.dispatch(forceRefreshLocation()).unwrap()).toBe(false)

    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestLocationPermission).toHaveBeenCalledTimes(1)

    store.expectActionNotDispatched(userSlice.actions.setUserDeniedLocationServices.match)
    store.expectActionNotDispatched(refreshLocation.fulfilled.match)
  })

  it('should not request again on android if permission is denied', async () => {
    const mockCheckLocationPermission = jest.fn(() => Promise.resolve(RESULTS.DENIED))
    const mockRequestLocationPermission = jest.fn(() => Promise.resolve(RESULTS.DENIED))
    Platform.OS = 'android'

    locationService.checkLocationPermission = mockCheckLocationPermission
    locationService.requestLocationPermission = mockRequestLocationPermission
    expect(await store.dispatch(forceRefreshLocation()).unwrap()).toBe(false)

    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestLocationPermission).toHaveBeenCalledTimes(0)

    store.expectActionNotDispatched(userSlice.actions.setUserDeniedLocationServices.match)
    store.expectActionNotDispatched(refreshLocation.fulfilled.match)
  })

  it('should not force refresh location if permission is not granted', async () => {
    const mockCheckLocationPermission = jest.fn(() => Promise.resolve(RESULTS.BLOCKED))
    const mockRequestLocationPermission = jest.fn(() => Promise.resolve(RESULTS.DENIED))
    locationService.checkLocationPermission = mockCheckLocationPermission
    locationService.requestLocationPermission = mockRequestLocationPermission
    expect(await store.dispatch(forceRefreshLocation()).unwrap()).toBe(false)

    expect(mockCheckLocationPermission).toHaveBeenCalledTimes(1)
    expect(mockRequestLocationPermission).toHaveBeenCalledTimes(0)

    store.expectActionNotDispatched(userSlice.actions.setUserDeniedLocationServices.match)
    store.expectActionNotDispatched(refreshLocation.fulfilled.match)
  })
})
