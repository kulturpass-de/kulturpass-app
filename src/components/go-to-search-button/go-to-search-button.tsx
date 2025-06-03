import React, { useCallback } from 'react'
import { PixelRatio, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import strictUriEncode from 'strict-uri-encode'
import { SpartacusBridge } from '../../features/spartacus-webview/services/webview-bridge-adapter/spartacus-bridge'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { webViewBridgeAdapter } from '../../features/spartacus-webview/services/webview-bridge-adapter/webview-bridge-adapter'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { SearchRouteName } from '../../screens/search/search-route'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { selectWebViewState } from '../../services/webviews/redux/webviews-selectors'
import { HITSLOP } from '../../theme/constants'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../svg-image/svg-image'

const CHEVRON_SIZE = 24

export type GoToSearchButtonProps = React.PropsWithChildren<{
  searchTerm?: string
  accessibilityLabel?: string
  testID: string
  lineHeight?: number
  childrenContainerStyle?: StyleProp<ViewStyle>
}>

export const GoToSearchButton: React.FC<GoToSearchButtonProps> = ({
  searchTerm,
  accessibilityLabel,
  children,
  testID,
  lineHeight = CHEVRON_SIZE,
  childrenContainerStyle,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const tabNavigation = useTabsNavigation()
  const { isReady: searchIsReady } = useSelector(state => selectWebViewState(state, WebViewId.Search))

  const onPress = useCallback(async () => {
    if (!searchTerm) {
      return
    }

    const url = `/search/${strictUriEncode(searchTerm)}`
    if (searchIsReady) {
      // FIXME: temp workaround
      tabNavigation.navigateDeprecated(SearchRouteName)
      await webViewBridgeAdapter.callBridgeFunction(
        WebViewId.Search,
        SpartacusBridge.FunctionCall.Target.RouterNavigate,
        [url],
      )
    } else {
      // FIXME: temp workaround
      tabNavigation.navigateDeprecated(SearchRouteName, { initialNavigationUrl: url })
    }
  }, [searchIsReady, searchTerm, tabNavigation])

  if (!searchTerm) {
    return <>{children}</>
  }

  return (
    <Pressable
      hitSlop={HITSLOP}
      style={styles.container}
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}>
      <View testID={addTestIdModifier(testID, 'children')} style={[styles.childrenContainer, childrenContainerStyle]}>
        {children}
      </View>

      <View
        style={[
          styles.chevronContainer,
          {
            height: lineHeight * PixelRatio.getFontScale(),
          },
        ]}>
        <SvgImage type="chevron" width={CHEVRON_SIZE} height={CHEVRON_SIZE} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: spacing[2],
    flex: 1,
  },
  childrenContainer: { flex: 1, flexShrink: 1, justifyContent: 'center' },
  chevronContainer: {
    marginRight: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
})
