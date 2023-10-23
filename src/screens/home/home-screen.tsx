import { useFocusEffect } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Screen } from '../../components/screen/screen'
import { HomeHeader } from '../../features/home/components/home-header'
import { HomeHeaderShrinkable } from '../../features/home/components/home-header-shrinkable'
import { useDisplayReleaseNotes } from '../../features/release-notes/hooks/use-display-release-notes'
import { SpartacusWebView } from '../../features/spartacus-webview/components/webview'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { useEnvironmentConfigurationCommerce } from '../../services/environment-configuration/hooks/use-environment-configuration'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { NetworkError } from '../../services/errors/errors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useGetProfile } from '../../services/user/use-get-profile'
import { selectHomeHeaderShown } from '../../services/webviews/redux/webviews-selectors'
import { spacing } from '../../theme/spacing'
import { useIsScreenReaderActive } from '../../utils/accessibility/hooks/use-is-screen-reader-active'

export type HomeScreenProps = {}

export const HomeScreen: React.FC<HomeScreenProps> = () => {
  useDisplayReleaseNotes()
  const { buildTestId } = useTestIdBuilder()
  const isScreenReaderActive = useIsScreenReaderActive()
  const homeUrl = useEnvironmentConfigurationCommerce().homeUrl
  const showHeader = useSelector(selectHomeHeaderShown)

  const { data, refetch, error } = useGetProfile()

  useEffect(() => {
    // Ignore NetworkError, so that the user is not spammed with error messages while being offline
    if (error && !(error instanceof NetworkError)) {
      ErrorAlertManager.current?.showError(error)
    }
  }, [error])

  useFocusEffect(refetch)

  const { l: language } = useTranslation()

  const offset = useRef(new Animated.Value(0)).current
  const [contentOffset, setContentOffset] = useState<number>(0)

  const homeHeader = showHeader === true ? <HomeHeader profile={data} /> : null
  return (
    <Screen withBasicBackground testID={buildTestId('home')}>
      {isScreenReaderActive ? (
        <View style={styles.screenReaderHeaderContainer}>{homeHeader}</View>
      ) : (
        <HomeHeaderShrinkable offset={offset} onHeight={setContentOffset}>
          {homeHeader}
        </HomeHeaderShrinkable>
      )}
      <SpartacusWebView
        contentOffset={isScreenReaderActive ? 0 : contentOffset}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], { useNativeDriver: false })}
        webViewId={WebViewId.Home}
        url={homeUrl}
        testID={buildTestId('screens_home_webview')}
        language={language}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  screenReaderHeaderContainer: {
    paddingHorizontal: spacing[2],
    marginHorizontal: spacing[2],
    paddingTop: Platform.OS === 'ios' ? spacing[1] : spacing[4],
  },
})
