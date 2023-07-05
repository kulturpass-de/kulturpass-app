import { Action } from '@reduxjs/toolkit'
import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { webviewsValidateSession } from '../thunks/webviews-validate-session'
import { webviewsSlice } from '../webviews-slice'
import { onWebViewStateChange, onWebViewStateChangeEffect } from './on-webview-state-change'

describe('on-webview-state-change', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('onWebViewStateChange', () => {
    it('should match with setWebViewState action', async () => {
      let effectDefinition: any

      onWebViewStateChange(((action: Action) => {
        effectDefinition = action
      }) as any)

      let willRunEffect = effectDefinition.matcher(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Home, state: {} }),
      )
      expect(willRunEffect).toBe(true)
    })
  })

  describe('onWebViewStateChangeEffect', () => {
    it('should dispatch webviewsValidateSession when webViewState isLoggedIn is changed', async () => {
      const store = configureMockStore()

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Home, state: { isLoggedIn: undefined } }),
        store as any,
      )

      store.expectActionNotDispatched(webviewsValidateSession.pending.match)

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Home, state: { isLoggedIn: true } }),
        store as any,
      )

      store.expectActions([{ type: webviewsValidateSession.pending.type, meta: { arg: WebViewId.Home } }])

      store.clearActions()

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Home, state: { isLoggedIn: false } }),
        store as any,
      )

      store.expectActions([{ type: webviewsValidateSession.pending.type, meta: { arg: WebViewId.Home } }])
    })

    it('should dispatch webviewsValidateSession when webViewState isReady is changed', async () => {
      const store = configureMockStore()

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Search, state: { isReady: undefined } }),
        store as any,
      )

      store.expectActionNotDispatched(webviewsValidateSession.pending.match)

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Search, state: { isReady: true } }),
        store as any,
      )

      store.expectActions([{ type: webviewsValidateSession.pending.type, meta: { arg: WebViewId.Search } }])

      store.clearActions()

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Search, state: { isReady: false } }),
        store as any,
      )

      store.expectActions([{ type: webviewsValidateSession.pending.type, meta: { arg: WebViewId.Search } }])
    })

    it('should not dispatch webviewsValidateSession when webViewState routerUrl is changed', async () => {
      const store = configureMockStore()

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Search, state: { routerUrl: '' } }),
        store as any,
      )

      store.expectActionNotDispatched(webviewsValidateSession.pending.match)

      await onWebViewStateChangeEffect(
        webviewsSlice.actions.setWebViewState({ webViewId: WebViewId.Search, state: { routerUrl: '/login' } }),
        store as any,
      )

      store.expectActionNotDispatched(webviewsValidateSession.pending.match)
    })
  })
})
