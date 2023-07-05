import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { WebViewId } from '../../../features/spartacus-webview/services/webview-bridge-adapter/types'

export type WebViewState = {
  isLoggedIn: boolean | null
  isReady: boolean | null
  routerUrl: string | null
  lastAccessToken: string | null
}

export type WebviewsState = {
  [key in WebViewId]: WebViewState
}

const initialState: WebviewsState = {
  [WebViewId.Home]: {
    isLoggedIn: null,
    isReady: null,
    routerUrl: null,
    lastAccessToken: null,
  },
  [WebViewId.Search]: {
    isLoggedIn: null,
    isReady: null,
    routerUrl: null,
    lastAccessToken: null,
  },
}

export const webviewsSlice = createSlice({
  name: 'webviews',
  initialState,
  reducers: {
    setWebViewState: (state, { payload }: PayloadAction<{ webViewId: WebViewId; state: Partial<WebViewState> }>) => {
      if (typeof payload.state.isLoggedIn !== 'undefined') {
        state[payload.webViewId].isLoggedIn = payload.state.isLoggedIn
      }
      if (typeof payload.state.isReady !== 'undefined') {
        state[payload.webViewId].isReady = payload.state.isReady
      }
      if (typeof payload.state.routerUrl !== 'undefined') {
        state[payload.webViewId].routerUrl = payload.state.routerUrl
      }
      if (typeof payload.state.lastAccessToken !== 'undefined') {
        state[payload.webViewId].lastAccessToken = payload.state.lastAccessToken
      }
    },
  },
})
