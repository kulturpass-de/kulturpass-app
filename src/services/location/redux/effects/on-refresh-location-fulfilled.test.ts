import { Action } from '@reduxjs/toolkit'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { webviewsLocationSync } from '../../../webviews/redux/thunks/webviews-location-sync'
import { onRefreshLocationFulfilled, onRefreshLocationFulfilledEffect } from './on-refresh-location-fulfilled'

describe('on-refresh-location-fulfilled', () => {
  const store = configureMockStore()

  const expectedTriggerAction = {
    meta: {},
    type: 'location/refreshLocation/fulfilled',
  }

  afterEach(() => {
    store.clearActions()
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('onRefreshLocationFulfilled', () => {
    it('should match with refreshLocation fulfilled action', async () => {
      let effectDefinition: any

      onRefreshLocationFulfilled(((action: Action) => {
        effectDefinition = action
      }) as any)

      const willRunEffect = effectDefinition.matcher(expectedTriggerAction)

      expect(willRunEffect).toBe(true)
    })
  })

  describe('onRefreshLocationFulfilledEffect', () => {
    it('should call webviewsLocationSync', async () => {
      await onRefreshLocationFulfilledEffect(expectedTriggerAction as any, store as any)

      store.expectActions([
        {
          type: webviewsLocationSync.fulfilled.type,
          meta: {
            arg: WebViewId.Home,
          },
        },
        {
          type: webviewsLocationSync.fulfilled.type,
          meta: {
            arg: WebViewId.Search,
          },
        },
      ])
    })
  })
})
