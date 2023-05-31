import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React, { useCallback } from 'react'
import { AccessibilityProps, Pressable, StyleSheet, Text, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { ReservationsTabsParamList } from './reservations-screen'
import { isDeviceTextScaled } from '../../theme/utils'

type ReservationsTabItemProps = {
  route: MaterialTopTabBarProps['state']['routes'][0]
  navigation: MaterialTopTabBarProps['navigation']
  isFocused: boolean
  isNotLastElement: boolean
  accessibilityHint: AccessibilityProps['accessibilityHint']
}

const ReservationsTabItem: React.FC<ReservationsTabItemProps> = ({
  isNotLastElement,
  route,
  isFocused,
  navigation,
  accessibilityHint,
}) => {
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

  const routeNameLowerCase = route.name.toLowerCase() as Lowercase<keyof ReservationsTabsParamList>

  return (
    <Pressable
      style={[isDeviceTextScaled() ? styles.flexibleButton : {}, isNotLastElement ? styles.tabBarGap : {}]}
      testID={buildTestId(`reservations_${routeNameLowerCase}_navigation_button`)}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={t(`reservations_${routeNameLowerCase}_navigation_title`)}
      accessibilityRole="tab"
      accessibilityHint={accessibilityHint}
      accessible>
      <Text
        testID={buildTestId(`reservations_${routeNameLowerCase}_navigation_title`)}
        style={[styles.tabBarLabel, isFocused ? textStyles.BodyExtrabold : textStyles.BodyMedium]}>
        {t(`reservations_${routeNameLowerCase}_navigation_title`)}
      </Text>
      {isFocused ? <View style={styles.tabBarIndicatorStyle} /> : null}
    </Pressable>
  )
}

export const ReservationsTabBar: React.FC<MaterialTopTabBarProps> = ({ state, navigation }) => {
  const { t } = useTranslation()

  return (
    <View style={styles.tabBarStyle}>
      {state.routes.map((route, index) => (
        <ReservationsTabItem
          key={route.key}
          route={route}
          navigation={navigation}
          isFocused={state.index === index}
          isNotLastElement={index < state.routes.length - 1}
          accessibilityHint={t('tabNavigation_accessibilityHint_count', {
            current: index + 1,
            total: state.routes.length,
          })}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: spacing[7],
  },
  tabBarGap: {
    marginRight: spacing[4],
  },
  flexibleButton: {
    flex: 1,
  },
  tabBarLabel: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
    color: colors.moonDarkest,
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.moonDarkest,
    height: 2,
    borderRadius: 100,
  },
})
