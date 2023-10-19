import { Action } from '@reduxjs/toolkit'
import { configureMockStore } from '../../../testing/configure-mock-store'
import {
  COMPLETED_STATUSES,
  ORDER_STATUS_CREATED,
  PENDING_STATUSES,
} from '../../types/commerce/commerce-get-reservations'
import { apiOfflineCacheSlice } from '../api-offline-cache-slice'
import { onGetOrderDetailFulfilled, onGetOrderDetailFulfilledEffect } from './on-get-order-detail-fulfilled'

describe('on-get-order-detail-fulfilled', () => {
  const store = configureMockStore()

  const createTriggerAction = (status: string) => ({
    meta: { arg: { endpointName: 'getOrderDetail', originalArgs: { orderCode: 'my_order_code' } } },
    payload: { status },
    type: 'commerceApi/executeQuery/fulfilled',
  })

  afterEach(() => {
    store.clearActions()
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('onGetOrderDetailFulfilled', () => {
    it('should match with getOrderDetail.fulfilled action', async () => {
      let effectDefinition: any

      onGetOrderDetailFulfilled(((action: Action) => {
        effectDefinition = action
      }) as any)

      const expectedTriggerAction = createTriggerAction(ORDER_STATUS_CREATED)
      const willRunEffect = effectDefinition.matcher(expectedTriggerAction)

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onGetOrderDetailFulfilledEffect', () => {
    it('should dispatch setCommerceApiEndpointCache if status is in PENDING_STATUSES', async () => {
      const promises = PENDING_STATUSES.map(status => {
        const triggerAction = createTriggerAction(status)
        return onGetOrderDetailFulfilledEffect(triggerAction as any, store as any)
      })

      await Promise.all(promises)

      const expectedActions = PENDING_STATUSES.map(status =>
        apiOfflineCacheSlice.actions.setCommerceApiEndpointCache({
          endpointName: 'getOrderDetail',
          cacheKey: 'my_order_code',
          payload: { status },
        }),
      )

      store.expectActions(expectedActions)
    })

    it('should dispatch setCommerceApiEndpointCache if status is in COMPLETED_STATUSES', async () => {
      const promises = COMPLETED_STATUSES.map(status => {
        const triggerAction = createTriggerAction(status)
        return onGetOrderDetailFulfilledEffect(triggerAction as any, store as any)
      })

      await Promise.all(promises)

      store.expectActionNotDispatched(apiOfflineCacheSlice.actions.setCommerceApiEndpointCache.match)
    })
  })
})
