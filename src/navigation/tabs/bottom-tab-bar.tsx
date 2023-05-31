import React, { useCallback } from 'react'
import { AccessibilityProps, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { textStyles } from '../../theme/typography'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { TabBarIcon } from '../../components/tab-bar-icon/tab-bar-icon'
import { TabsParamList } from './types'
import { RouteProp } from '@react-navigation/native'
import { spacing } from '../../theme/spacing'

type BottomTabItemProps = {
  route: RouteProp<TabsParamList, keyof TabsParamList>
  navigation: BottomTabBarProps['navigation']
  isFocused: boolean
  accessibilityHint: AccessibilityProps['accessibilityHint']
}

const BottomTabItem: React.FC<BottomTabItemProps> = ({ route, isFocused, navigation, accessibilityHint }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

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
      accessibilityRole="tab"
      accessibilityHint={accessibilityHint}
      accessible>
      <TabBarIcon isFocused={isFocused} name={route.name} />
      <View style={styles.tabBarLabelContainer}>
        <Text
          testID={buildTestId(`${routeName}_bottomNavigation_label`)}
          style={[isFocused ? textStyles.MicroExtrabold : textStyles.MicroMedium, styles.tabBarLabel]}>
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

  return (
    <View style={[styles.container, { paddingBottom: bottomSafeArea }]}>
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
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    backgroundColor: colors.basicWhite,
    borderTopColor: colors.basicBlack,
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
    color: colors.basicBlack,
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
