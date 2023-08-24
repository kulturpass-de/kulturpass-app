import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useSelector } from 'react-redux'
import { Screen } from '../../components/screen/screen'
import { useDisplayReleaseNotes } from '../../features/release-notes/hooks/use-display-release-notes'
import { SpartacusWebView } from '../../features/spartacus-webview/components/webview'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { commerceApi } from '../../services/api/commerce-api'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { useEnvironmentConfigurationCommerce } from '../../services/environment-configuration/hooks/use-environment-configuration'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { ErrorWithCode, NetworkError, UnknownError } from '../../services/errors/errors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HomeHeader } from './home-header'
import { HomeHeaderShrinkable } from './home-header-shrinkable'
import { HomeHeaderWithWebView } from './home-header-with-webview'

export type HomeScreenProps = {}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  useDisplayReleaseNotes()
  const { buildTestId } = useTestIdBuilder()
  const homeUrl = useEnvironmentConfigurationCommerce().homeUrl

  const isLoggedIn = useSelector(getIsUserLoggedIn)

  const { data, refetch, error } = commerceApi.useGetProfileQuery({}, { skip: !isLoggedIn })

  useEffect(() => {
    if (error instanceof ErrorWithCode && !(error instanceof NetworkError)) {
      ErrorAlertManager.current?.showError(new UnknownError())
    }
  }, [error])

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        refetch()
      }
    }, [refetch, isLoggedIn]),
  )

  const { l: language } = useTranslation()

  const offset = useRef(new Animated.Value(0)).current
  const [contentOffset, setContentOffset] = useState<number>(0)
  return (
    <Screen withBasicBackground testID={buildTestId('home')}>
      <HomeHeaderShrinkable offset={offset} onHeight={setContentOffset}>
        <HomeHeaderWithWebView>
          <HomeHeader profile={data} />
        </HomeHeaderWithWebView>
      </HomeHeaderShrinkable>
      <SpartacusWebView
        contentOffset={contentOffset}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], { useNativeDriver: false })}
        webViewId={WebViewId.Home}
        url={homeUrl}
        testID={buildTestId('screens_home_webview')}
        language={language}
      />
    </Screen>
  )
}
