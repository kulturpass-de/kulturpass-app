import React, { PropsWithChildren } from 'react'
import { View, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'

export type ModalScreenProps = PropsWithChildren<{
  testID: TestId
  whiteBottom?: boolean
}>

export const ModalScreen: React.FC<ModalScreenProps> = ({ children, testID, whiteBottom = false }) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  /**
   * StatusBar height should be taken into consideration on Android, it is `null` on iOS
   */
  const StatusBarHeight = StatusBar.currentHeight || 0

  /**
   * Top SafeAreaInset should be taken into consideration on iOS, it is `0` on Android
   */
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
      testID={addTestIdModifier(testID, 'screen')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={StatusBarHeight + top}
        style={styles.keyboardAvoidingView}>
        {children}
      </KeyboardAvoidingView>
      <View
        style={[
          styles.bottomPadding,
          { height: bottom, backgroundColor: whiteBottom ? colors.secondaryBackground : colors.primaryBackground },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  bottomPadding: {
    width: '100%',
  },
})
