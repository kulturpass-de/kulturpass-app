import { Action, AnyAction } from '@reduxjs/toolkit'

import { WebViewId } from '../../../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { RootState } from '../../../redux/configure-store'
import { configureMockStore } from '../../../testing/configure-mock-store'
import { webviewsValidateSession } from '../thunks/webviews-validate-session'
import { onCommerceAccessTokenChange, onCommerceAccessTokenChangeEffect } from './on-commerce-access-token-change'

describe('on-commerce-access-token-change', () => {
  const store = configureMockStore()

  afterEach(() => {
    store.clearActions()
  })

  describe('onCommerceAccessTokenChange', () => {
    it('should match when commerce access_token has changed', async () => {
      let effectDefinition: any

      onCommerceAccessTokenChange(((action: Action) => {
        effectDefinition = action
      }) as any)

      let willRunEffect = effectDefinition.predicate(
        {} as AnyAction,
        { auth: { commerce: null } } as RootState,
        { auth: { commerce: { access_token: 'a' } } } as RootState,
      )
      expect(willRunEffect).toBe(true)

      willRunEffect = effectDefinition.predicate(
        {} as AnyAction,
        { auth: { commerce: { access_token: 'b' } } } as RootState,
        { auth: { commerce: null } } as RootState,
      )
      expect(willRunEffect).toBe(true)

      willRunEffect = effectDefinition.predicate(
        {} as AnyAction,
        { auth: { commerce: { access_token: 'c' } } } as RootState,
        { auth: { commerce: { access_token: 'd' } } } as RootState,
      )
      expect(willRunEffect).toBe(true)
    })
  })

  describe('onCommerceAccessTokenChangeEffect', () => {
    it('should dispatch webviewsValidateSession thunk for each of the WebViewIds', async () => {
      await onCommerceAccessTokenChangeEffect({} as AnyAction, store as any)

      store.expectActions([
        { type: webviewsValidateSession.pending.type, meta: { arg: WebViewId.Home } },
        { type: webviewsValidateSession.pending.type, meta: { arg: WebViewId.Search } },
      ])
    })
  })
})
