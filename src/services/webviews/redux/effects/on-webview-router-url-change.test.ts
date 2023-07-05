import { Action } from '@reduxjs/toolkit'

import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { RootState } from '../../../redux/configure-store'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { webviewsSlice } from '../webviews-slice'
import { onWebViewRouterUrlChange, onWebViewRouterUrlChangeEffect } from './on-webview-router-url-change'

describe('on-webview-router-url-change', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('onWebViewRouterUrlChange', () => {
    it('should match with setWebViewState action', async () => {
      let effectDefinition: any

      onWebViewRouterUrlChange(((action: Action) => {
        effectDefinition = action
      }) as any)

      let willRunEffect = effectDefinition.matcher(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Home, state: {} }),
      )
      expect(willRunEffect).toBe(true)
    })
  })

  describe('onWebViewRouterUrlChangeEffect', () => {
    it('should dispatch webViewBridgeAdapter.reload if newWebViewState.routerUrl is /login', async () => {
      const store = configureMockStore()

      const reload = jest.spyOn(webViewBridgeAdapter, 'reload')

      await onWebViewRouterUrlChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Home, state: { routerUrl: '/login' } }),
        store as any,
      )

      expect(reload).toHaveBeenCalledTimes(1)
      expect(reload).toHaveBeenCalledWith(WebViewId.Home)
    })

    it('should dispatch webViewBridgeAdapter.reload if current webViewState.routerUrl is /login and newWebViewState.isLoggedIn is true', async () => {
      const store = configureMockStore({
        preloadedState: { webviews: { [WebViewId.Search]: { routerUrl: '/login' } } } as RootState,
      })

      const reload = jest.spyOn(webViewBridgeAdapter, 'reload')

      await onWebViewRouterUrlChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Search, state: { isLoggedIn: true } }),
        store as any,
      )

      expect(reload).toHaveBeenCalledTimes(1)
      expect(reload).toHaveBeenCalledWith(WebViewId.Search)
    })
  })
})
