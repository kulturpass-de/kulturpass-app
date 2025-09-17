import { getFocusedRouteNameFromRoute, Route, useRoute } from '@react-navigation/native'
import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { EndOfLifeRouteName } from '../../screens/app/end-of-life-route'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: spacing[5],
    borderTopRightRadius: spacing[5],
    height: '100%',
    overflow: 'hidden',
  },
  nonModalContainer: { height: '100%', overflow: 'hidden' },
})

const checkIsModal = (route: Partial<Route<string>>): boolean => {
  return getFocusedRouteNameFromRoute(route) !== EndOfLifeRouteName
}

export const ModalStackWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const route = useRoute()

  if (!checkIsModal(route)) {
    return (
      <View
        style={[
          styles.nonModalContainer,
          {
            backgroundColor: colors.primaryBackground,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        {children}
      </View>
    )
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <View style={[styles.container, { backgroundColor: colors.primaryBackground }]}>{children}</View>
    </SafeAreaView>
  )
}
