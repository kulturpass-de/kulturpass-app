import { GeoPosition } from 'react-native-geolocation-service'
import { mockedSecureStorage } from '../storage/__mocks__/secure-storage'
import { getCdcSession, getCommerceSession, getUserLocation } from './session-service'

jest.mock('../storage/secure-storage', () => mockedSecureStorage)

describe('session-service', () => {
  describe('getCdcSession', () => {
    it('should return cdcSessionData key of SecureStorage', async () => {
      mockedSecureStorage.mockItem('cdcSessionData', { sessionToken: 'my_session_token' })

      const cdcSessionData = await getCdcSession()

      expect(cdcSessionData).toEqual({ sessionToken: 'my_session_token' })
    })
  })

  describe('getCommerceSession', () => {
    it('should return commerceSessionData key of SecureStorage', async () => {
      mockedSecureStorage.mockItem('commerceSessionData', { access_token: 'my_access_token' })

      const commerceSessionData = await getCommerceSession()

      expect(commerceSessionData).toEqual({ access_token: 'my_access_token' })
    })
  })

  describe('getUserLocation', () => {
    it('should return userLocationData key of SecureStorage', async () => {
      const currentTime = Date.now()
      mockedSecureStorage.mockItem('userLocationData', {
        coords: { latitude: 123, longitude: 123 },
        timestamp: currentTime,
      } as GeoPosition)

      const userLocationData = await getUserLocation()

      expect(userLocationData).toEqual({
        coords: { latitude: 123, longitude: 123 },
        timestamp: currentTime,
      })
    })
  })
})
