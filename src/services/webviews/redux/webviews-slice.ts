import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WebViewId } from '../../../features/spartacus-webview/services/webview-bridge-adapter/types'

export type GeolocationState = { latitude: number; longitude: number }

export type WebViewState = {
  isLoggedIn: boolean | null
  isReady: boolean | null
  lastAccessToken: string | null
  previousSubmittedUserLocationState: GeolocationState | undefined | null
  showHeader: boolean | null
  routesToLogin: boolean | null
}

export type WebviewsState = {
  [key in WebViewId]: WebViewState
}

const initialState: WebviewsState = {
  [WebViewId.Home]: {
    isLoggedIn: null,
    isReady: null,
    lastAccessToken: null,
    previousSubmittedUserLocationState: null,
    showHeader: true,
    routesToLogin: null,
  },
  [WebViewId.Search]: {
    isLoggedIn: null,
    isReady: null,
    lastAccessToken: null,
    previousSubmittedUserLocationState: null,
    showHeader: null,
    routesToLogin: null,
  },
}

export const webviewsSlice = createSlice({
  name: 'webviews',
  initialState,
  reducers: {
    setWebViewState: (
      state,
      {
        payload,
      }: PayloadAction<{
        webViewId: WebViewId
        state: Partial<WebViewState>
      }>,
    ) => {
      if (typeof payload.state.isLoggedIn !== 'undefined') {
        state[payload.webViewId].isLoggedIn = payload.state.isLoggedIn
      }
      if (typeof payload.state.isReady !== 'undefined') {
        state[payload.webViewId].isReady = payload.state.isReady
      }
      if (typeof payload.state.showHeader !== 'undefined') {
        state[payload.webViewId].showHeader = payload.state.showHeader
      }
      if (typeof payload.state.routesToLogin !== 'undefined') {
        state[payload.webViewId].routesToLogin = payload.state.routesToLogin
      }
      if (typeof payload.state.lastAccessToken !== 'undefined') {
        state[payload.webViewId].lastAccessToken = payload.state.lastAccessToken
      }
      if (typeof payload.state.previousSubmittedUserLocationState !== 'undefined') {
        state[payload.webViewId].previousSubmittedUserLocationState = payload.state.previousSubmittedUserLocationState
      }
    },
    setPreviousSubmittedUserLocationWebviewState: (
      state,
      {
        payload,
      }: PayloadAction<{ webViewId: WebViewId; location: WebViewState['previousSubmittedUserLocationState'] }>,
    ) => {
      state[payload.webViewId].previousSubmittedUserLocationState = payload.location
    },
  },
})
