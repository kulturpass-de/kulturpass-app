import { RootState } from '../../redux/configure-store'
import { appendLocationParameters } from './append-location-parameters'

describe('append-location-parameters', () => {
  it('should append userLocation according to the given rootState', async () => {
    const rootState = {
      persisted: {
        location: {
          currentUserLocation: { coords: { latitude: 1, longitude: 2, accuracy: 3 }, timestamp: 123 },
        },
      },
      user: {},
    } as RootState

    const res = appendLocationParameters({ irrelevantProperty: 'should remain as is' }, rootState)

    expect(res).toHaveProperty('irrelevantProperty', 'should remain as is')
    expect(res).toHaveProperty('userLocation')
    expect(res.userLocation).toBe('1,2')
  })

  it('should append postalCode according to the given rootState', async () => {
    const rootState = {
      persisted: { location: {} },
      user: { data: { preferredPostalCode: '11111' } },
    } as RootState

    const res = appendLocationParameters({ irrelevantProperty: 'should remain as is' }, rootState)

    expect(res).toHaveProperty('irrelevantProperty', 'should remain as is')
    expect(res).toHaveProperty('postalCode', '11111')
  })

  it('should not append postalCode when userLocation in available in the given rootState', async () => {
    const rootState = {
      persisted: {
        location: {
          currentUserLocation: { coords: { latitude: 1, longitude: 2, accuracy: 3 }, timestamp: 123 },
        },
      },
      user: { data: { preferredPostalCode: '11111' } },
    } as RootState

    const res = appendLocationParameters({ irrelevantProperty: 'should remain as is' }, rootState)

    expect(res).toHaveProperty('irrelevantProperty', 'should remain as is')
    expect(res).toHaveProperty('userLocation')
    expect(res.userLocation).toBe('1,2')
    expect(res.postalCode).toBeUndefined()
  })
})
