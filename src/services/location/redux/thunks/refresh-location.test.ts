import { GeoPosition } from 'react-native-geolocation-service'
import * as sessionService from '../../../session/session-service'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { userSlice } from '../../../user/redux/user-slice'
import { locationService } from '../../location-service'
import { locationSlice } from '../location-slice'
import { refreshLocation } from './refresh-location'

describe('refreshLocation', () => {
  const store = configureMockStore()

  const userLocationData = {
    coords: { latitude: 123, longitude: 123 },
    timestamp: Date.now(),
  } as GeoPosition

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should refresh location', async () => {
    store.dispatch(userSlice.actions.setUserDeniedLocationServices(false))

    const getCurrentLocationMock = jest
      .spyOn(locationService, 'getCurrentLocation')
      .mockImplementation(() => Promise.resolve(userLocationData))
    const persistUserLocation = jest
      .spyOn(sessionService, 'persistUserLocation')
      .mockImplementation(() => Promise.resolve())
    const clearUserLocation = jest
      .spyOn(sessionService, 'clearUserLocation')
      .mockImplementation(() => Promise.resolve())

    await store.dispatch(refreshLocation())

    expect(getCurrentLocationMock).toHaveBeenCalledTimes(1)
    expect(clearUserLocation).toHaveBeenCalledTimes(0)
    expect(persistUserLocation).toHaveBeenCalledWith(userLocationData)
    store.expectActions([{ type: locationSlice.actions.setCurrentUserLocation.type, payload: userLocationData }])
  })

  it('should set user location to undefined when user location was undefined', async () => {
    store.dispatch(userSlice.actions.setUserDeniedLocationServices(false))

    const getCurrentLocationMock = jest
      .spyOn(locationService, 'getCurrentLocation')
      .mockImplementation(() => Promise.resolve(undefined))
    const persistUserLocation = jest
      .spyOn(sessionService, 'persistUserLocation')
      .mockImplementation(() => Promise.resolve())
    const clearUserLocation = jest
      .spyOn(sessionService, 'clearUserLocation')
      .mockImplementation(() => Promise.resolve())

    await store.dispatch(refreshLocation())

    expect(getCurrentLocationMock).toHaveBeenCalledTimes(1)
    expect(clearUserLocation).toHaveBeenCalledTimes(1)
    expect(persistUserLocation).toHaveBeenCalledTimes(0)
    store.expectActions([{ type: locationSlice.actions.setCurrentUserLocation.type, payload: undefined }])
  })

  it('should set user location to undefined when user location was denied', async () => {
    store.dispatch(userSlice.actions.setUserDeniedLocationServices(true))

    const getCurrentLocationMock = jest
      .spyOn(locationService, 'getCurrentLocation')
      .mockImplementation(() => Promise.resolve(userLocationData))
    const persistUserLocation = jest
      .spyOn(sessionService, 'persistUserLocation')
      .mockImplementation(() => Promise.resolve())
    const clearUserLocation = jest
      .spyOn(sessionService, 'clearUserLocation')
      .mockImplementation(() => Promise.resolve())

    await store.dispatch(refreshLocation())

    expect(getCurrentLocationMock).toHaveBeenCalledTimes(0)
    expect(clearUserLocation).toHaveBeenCalledTimes(1)
    expect(persistUserLocation).toHaveBeenCalledTimes(0)
    store.expectActions([{ type: locationSlice.actions.setCurrentUserLocation.type, payload: undefined }])
  })

  it('should set user location to undefined when user location rejects', async () => {
    store.dispatch(userSlice.actions.setUserDeniedLocationServices(false))

    const getCurrentLocationMock = jest
      .spyOn(locationService, 'getCurrentLocation')
      .mockImplementation(() => Promise.reject())
    const persistUserLocation = jest
      .spyOn(sessionService, 'persistUserLocation')
      .mockImplementation(() => Promise.resolve())
    const clearUserLocation = jest
      .spyOn(sessionService, 'clearUserLocation')
      .mockImplementation(() => Promise.resolve())

    await store.dispatch(refreshLocation())

    expect(getCurrentLocationMock).toHaveBeenCalledTimes(1)
    expect(clearUserLocation).toHaveBeenCalledTimes(1)
    expect(persistUserLocation).toHaveBeenCalledTimes(0)
    store.expectActions([{ type: locationSlice.actions.setCurrentUserLocation.type, payload: undefined }])
  })
})
