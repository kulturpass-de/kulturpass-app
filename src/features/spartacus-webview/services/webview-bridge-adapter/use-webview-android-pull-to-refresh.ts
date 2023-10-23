import { MutableRefObject, useCallback, useRef } from 'react'
import { Platform } from 'react-native'
import WebView, { WebViewProps } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { selectFiltersOrSortOpen } from '../../../../services/webviews/redux/webviews-selectors'
import { WebViewId } from './types'

export type UseWebviewAndroidPullToRefreshParams = {
  onScroll?: NonNullable<WebViewProps['onScroll']>
  webViewRef: MutableRefObject<WebView | null>
  webViewId: WebViewId
}

export const useWebviewAndroidPullToRefresh = (params: UseWebviewAndroidPullToRefreshParams) => {
  const scrollY = useRef(0)
  const touchY = useRef(0)
  const filtersOrSortOpen = useSelector(selectFiltersOrSortOpen(params.webViewId))

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
      if (Platform.OS !== 'android' || filtersOrSortOpen) {
        return
      }

      if (touchY.current - event.nativeEvent.pageY < -200 && scrollY.current === 0) {
        params.webViewRef.current?.reload()
      }
    },
    [params.webViewRef, filtersOrSortOpen],
  )

  return { onScroll, onTouchStart, onTouchEnd }
}
