import { Action } from '@reduxjs/toolkit'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { apiOfflineCacheSlice } from '../api-offline-cache-slice'
import { onGetProductDetailFulfilled, onGetProductDetailFulfilledEffect } from './on-get-product-detail-fulfilled'

describe('on-get-product-detail-fulfilled', () => {
  const store = configureMockStore()

  const expectedTriggerAction = {
    meta: { arg: { endpointName: 'getProductDetail', originalArgs: { productCode: 'my_product_code' } } },
    payload: {},
    type: 'commerceApi/executeQuery/fulfilled',
  }

  afterEach(() => {
    store.clearActions()
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('onGetProductDetailFulfilled', () => {
    it('should match with getProductDetail.fulfilled action', async () => {
      let effectDefinition: any

      onGetProductDetailFulfilled(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(expectedTriggerAction)

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onGetProductDetailFulfilledEffect', () => {
    it('should dispatch setCommerceApiEndpointCache', async () => {
      await onGetProductDetailFulfilledEffect(expectedTriggerAction as any, store as any)

      const expectedAction = apiOfflineCacheSlice.actions.setCommerceApiEndpointCache({
        endpointName: 'getProductDetail',
        cacheKey: 'my_product_code',
        payload: {},
      })

      store.expectActions([expectedAction])
    })
  })
})
