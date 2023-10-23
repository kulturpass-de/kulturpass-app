import { MutableRefObject, useCallback, useRef } from 'react'
import { Platform } from 'react-native'
import WebView, { WebViewProps } from 'react-native-webview'

export type UseWebviewAndroidPullToRefreshParams = {
  onScroll?: NonNullable<WebViewProps['onScroll']>
  webViewRef: MutableRefObject<WebView | null>
}

export const useWebviewAndroidPullToRefresh = (params: UseWebviewAndroidPullToRefreshParams) => {
  const scrollY = useRef(0)
  const touchY = useRef(0)

  const onScroll = useCallback<NonNullable<WebViewProps['onScroll']>>(
    event => {
      params.onScroll?.(event)

      scrollY.current = event.nativeEvent.contentOffset.y
    },
    [params],
  )

  const onTouchStart = useCallback<NonNullable<WebViewProps['onTouchStart']>>(event => {
    touchY.current = event.nativeEvent.pageY
  }, [])

  const onTouchEnd = useCallback<NonNullable<WebViewProps['onTouchEnd']>>(
    event => {
      if (Platform.OS !== 'android') {
        return
      }

      if (touchY.current - event.nativeEvent.pageY < -200 && scrollY.current === 0) {
        params.webViewRef.current?.reload()
      }
    },
    [params.webViewRef],
  )

  return { onScroll, onTouchStart, onTouchEnd }
}
