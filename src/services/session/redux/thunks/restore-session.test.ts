import { GeoPosition } from 'react-native-geolocation-service'
import { authSlice } from '../../../auth/store/auth-slice'
import { locationSlice } from '../../../location/redux/location-slice'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { userSlice } from '../../../user/redux/user-slice'
import * as sessionService from '../../session-service'
import { CdcSessionData, CommerceSessionData } from '../../types'
import { restoreSession } from './restore-session'

describe('restore-session', () => {
  const store = configureMockStore({ middlewares: [] })

  const cdcSessionData = {
    sessionToken: 'fake_session_token',
    user: { firstName: 'my_first_name' },
  } as CdcSessionData

  const commerceSessionData = {
    access_token: 'fake_access_token',
  } as CommerceSessionData

  const userLocationData = {
    coords: { latitude: 123, longitude: 123 },
    timestamp: Date.now(),
  } as GeoPosition

  afterEach(() => {
    jest.resetAllMocks()
    store.clearActions()
  })

  it('should set session info to current redux store', async () => {
    jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(cdcSessionData))
    jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(commerceSessionData))
    jest.spyOn(sessionService, 'getUserLocation').mockImplementation(() => Promise.resolve(null))

    await store.dispatch(restoreSession())

    store.expectActionNotDispatched(locationSlice.actions.setCurrentUserLocation.match)

    store.expectActions([
      { type: authSlice.actions.setCdcSession.type, payload: cdcSessionData },
      { type: authSlice.actions.setCommerceSession.type, payload: commerceSessionData },
      { type: userSlice.actions.setUserProfile.type, payload: cdcSessionData.user },
    ])
  })

  it('should not set session info to current redux store, when cdcSessionData is null', async () => {
    jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(null))
    jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(commerceSessionData))
    jest.spyOn(sessionService, 'getUserLocation').mockImplementation(() => Promise.resolve(null))

    await store.dispatch(restoreSession())

    store.expectActionNotDispatched(locationSlice.actions.setCurrentUserLocation.match)
    store.expectActionNotDispatched(authSlice.actions.setCdcSession.match)
    store.expectActionNotDispatched(authSlice.actions.setCommerceSession.match)
    store.expectActionNotDispatched(userSlice.actions.setUserProfile.match)
  })

  it('should not set session info to current redux store, when commerceSessionData is null', async () => {
    jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(cdcSessionData))
    jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(null))
    jest.spyOn(sessionService, 'getUserLocation').mockImplementation(() => Promise.resolve(null))

    await store.dispatch(restoreSession())

    store.expectActionNotDispatched(locationSlice.actions.setCurrentUserLocation.match)
    store.expectActionNotDispatched(authSlice.actions.setCdcSession.match)
    store.expectActionNotDispatched(authSlice.actions.setCommerceSession.match)
    store.expectActionNotDispatched(userSlice.actions.setUserProfile.match)
  })

  it('should set user location to current redux store', async () => {
    jest.spyOn(sessionService, 'getUserLocation').mockImplementation(() => Promise.resolve(userLocationData))
    jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(null))
    jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(null))

    await store.dispatch(restoreSession())

    store.expectActions([{ type: locationSlice.actions.setCurrentUserLocation.type, payload: userLocationData }])
  })

  it('should not set user location to current redux store, when userLocationData is null', async () => {
    jest.spyOn(sessionService, 'getUserLocation').mockImplementation(() => Promise.resolve(null))
    jest.spyOn(sessionService, 'getCdcSession').mockImplementation(() => Promise.resolve(null))
    jest.spyOn(sessionService, 'getCommerceSession').mockImplementation(() => Promise.resolve(null))

    await store.dispatch(restoreSession())

    store.expectActionNotDispatched(locationSlice.actions.setCurrentUserLocation.match)
    store.expectActionNotDispatched(authSlice.actions.setCdcSession.match)
    store.expectActionNotDispatched(authSlice.actions.setCommerceSession.match)
    store.expectActionNotDispatched(userSlice.actions.setUserProfile.match)
  })
})
