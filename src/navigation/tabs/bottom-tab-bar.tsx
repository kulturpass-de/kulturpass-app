import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { RouteProp } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { AccessibilityProps, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { TabBarIcon } from '../../components/tab-bar-icon/tab-bar-icon'
import { WebViewId } from '../../features/spartacus-webview/services/webview-bridge-adapter/types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { selectFiltersOrSortOpen } from '../../services/webviews/redux/webviews-selectors'
import { useTextStyles } from '../../theme/hooks/use-text-styles'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { useIsReduceMotionActive } from '../../utils/accessibility/hooks/use-is-reduce-motion-active'
import { TabsParamList } from './types'

type BottomTabItemProps = {
  route: RouteProp<TabsParamList, keyof TabsParamList>
  navigation: BottomTabBarProps['navigation']
  isFocused: boolean
  accessibilityHint: AccessibilityProps['accessibilityHint']
  isReduceMotionActive: boolean
}

const BottomTabItem: React.FC<BottomTabItemProps> = ({
  route,
  isFocused,
  navigation,
  accessibilityHint,
  isReduceMotionActive,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()
  const [textStyles] = useTextStyles()

  const onPress = useCallback(() => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })
    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({ name: route.name, params: {}, merge: true })
    }
  }, [isFocused, navigation, route.key, route.name])

  const onLongPress = useCallback(() => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    })
  }, [navigation, route.key])

  const routeName = route.name.toLowerCase() as Lowercase<(typeof route)['name']>

  return (
    <Pressable
      style={[styles.tabBarButton, routeName === 'reservations' ? styles.enlargedButton : undefined]}
      testID={buildTestId(`${routeName}_bottomNavigation_button`)}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityLabel={t(`${routeName}_bottomNavigation_label`)}
      accessibilityState={isFocused ? { selected: true } : {}}
      // FIXME: accessibilityRole: 'tab' doesn't seem to work as expected on iOS
      // see https://github.com/react-navigation/react-navigation/commit/3ac22e143509c9de1fdb941b1d833dd348da236c
      accessibilityRole={Platform.select({ ios: 'button', default: 'tab' })}
      accessibilityHint={accessibilityHint}
      accessible>
      <TabBarIcon isReduceMotionActive={isReduceMotionActive} isFocused={isFocused} name={route.name} />
      <View style={styles.tabBarLabelContainer}>
        <Text
          testID={buildTestId(`${routeName}_bottomNavigation_label`)}
          style={[
            isFocused ? textStyles.MicroExtrabold : textStyles.MicroMedium,
            styles.tabBarLabel,
            { color: colors.labelColor },
          ]}>
          {t(`${routeName}_bottomNavigation_label`)}
        </Text>
      </View>
    </Pressable>
  )
}

export const BottomTabBar: React.FC<BottomTabBarProps & { bottomSafeArea: number }> = ({
  state,
  navigation,
  bottomSafeArea,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const isReduceMotionActive = useIsReduceMotionActive()

  const filtersOrSortOpen = useSelector(selectFiltersOrSortOpen(WebViewId.Search))

  if (filtersOrSortOpen) {
    return null
  }

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.container,
        {
          paddingBottom: bottomSafeArea,
          borderTopColor: colors.tabBarDivider,
          backgroundColor: colors.secondaryBackground,
        },
      ]}>
      <View style={styles.tabBarStyle}>
        {state.routes.map((route, index) => (
          <BottomTabItem
            key={route.key}
            route={route as RouteProp<TabsParamList, keyof TabsParamList>}
            navigation={navigation}
            isFocused={state.index === index}
            accessibilityHint={t('tabNavigation_accessibilityHint_count', {
              current: index + 1,
              total: state.routes.length,
            })}
            isReduceMotionActive={isReduceMotionActive}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    borderTopWidth: 2,
  },
  tabBarStyle: {
    flexDirection: 'row',
    minHeight: 56,
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  tabBarLabelContainer: {
    flexDirection: 'row',
  },
  tabBarLabel: {
    paddingTop: spacing[0],
    lineHeight: 12,
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  tabBarButton: {
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 1,
    flex: 1,
  },
  // Needed for the larger reservations button. There might be a better solution
  enlargedButton: {
    flex: 1.3,
  },
})
