import { Action } from '@reduxjs/toolkit'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { ORDER_STATUS_COMPLETED, ORDER_STATUS_CREATED } from '../../types/commerce/commerce-get-reservations'
import { apiOfflineCacheSlice } from '../api-offline-cache-slice'
import { onGetReservationsFulfilled, onGetReservationsFulfilledEffect } from './on-get-reservations-fulfilled'

jest.mock('../thunks/cache-reservations-products-details')

describe('on-get-reservations-fulfilled', () => {
  const store = configureMockStore()

  const expectedTriggerAction = {
    meta: { arg: { endpointName: 'getReservations' } },
    payload: {
      orders: [
        { code: 'order_created', status: ORDER_STATUS_CREATED },
        { code: 'order_completed', status: ORDER_STATUS_COMPLETED },
      ],
    },
    type: 'commerceApi/executeQuery/fulfilled',
  }

  afterEach(() => {
    store.clearActions()
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('onGetReservationsFulfilled', () => {
    it('should match with getReservations.fulfilled action', async () => {
      let effectDefinition: any

      onGetReservationsFulfilled(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(expectedTriggerAction)

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onGetReservationsFulfilledEffect', () => {
    it('should dispatch setCommerceApiEndpointCache with pending orders', async () => {
      await onGetReservationsFulfilledEffect(expectedTriggerAction as any, store as any)

      const expectedAction = apiOfflineCacheSlice.actions.setCommerceApiEndpointCache({
        endpointName: 'getReservations',
        cache: { args: {}, payload: { orders: [{ code: 'order_created', status: ORDER_STATUS_CREATED }] } },
      })

      store.expectActions([expectedAction])
    })

    it('should dispatch cacheReservationsProductsDetails with pending orders', async () => {
      await onGetReservationsFulfilledEffect(expectedTriggerAction as any, store as any)

      const expectedAction = {
        meta: { arg: [{ code: 'order_created', status: ORDER_STATUS_CREATED }] },
        type: 'apiOfflineCache/cacheReservationsProductsDetails/pending',
      }

      store.expectActions([expectedAction])
    })
  })
})
