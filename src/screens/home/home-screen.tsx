import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useSelector } from 'react-redux'

import { Screen } from '../../components/screen/screen'
import { ErrorAlert } from '../../features/form-validation/components/error-alert'
import { SpartacusWebView } from '../../features/spartacus-webview/components/webview'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { commerceApi } from '../../services/api/commerce-api'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { getCommerceHomeUrl } from '../../services/environment-configuration/redux/environment-configuration-selectors'
import { ErrorWithCode } from '../../services/errors/errors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { HomeHeader } from './home-header'
import { HomeHeaderShrinkable } from './home-header-shrinkable'

export type HomeScreenProps = {}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { buildTestId } = useTestIdBuilder()
  const homeUrl = useSelector(getCommerceHomeUrl)

  const offset = useRef(new Animated.Value(0)).current

  const isLoggedIn = useSelector(getIsUserLoggedIn)

  const { data, refetch, error } = commerceApi.useGetProfileQuery({ force: false }, { skip: !isLoggedIn })

  const [visibleError, setVisibleError] = useState<ErrorWithCode>()
  useEffect(() => {
    if (error instanceof ErrorWithCode) {
      setVisibleError(error)
    }
  }, [error])
  const clearVisibleError = useCallback(() => setVisibleError(undefined), [])

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        refetch()
      }
    }, [refetch, isLoggedIn]),
  )

  return (
    <Screen withBasicBackground testID={buildTestId('home')}>
      <ErrorAlert error={visibleError} onDismiss={clearVisibleError} />
      <HomeHeaderShrinkable offset={offset}>{isLoggedIn && data && <HomeHeader profile={data} />}</HomeHeaderShrinkable>
      <SpartacusWebView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], { useNativeDriver: false })}
        webViewId={WebViewId.Home}
        url={homeUrl}
        testID={buildTestId('screens_home_webview')}
      />
    </Screen>
  )
}
