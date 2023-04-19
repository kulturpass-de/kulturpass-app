import React, { PropsWithChildren } from 'react'
import { View, StyleSheet, StatusBar, KeyboardAvoidingView, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'

export type ModalScreenProps = PropsWithChildren<{
  testID: TestId
  whiteBottom?: boolean
}>

export const ModalScreen: React.FC<ModalScreenProps> = ({ children, testID, whiteBottom = false }) => {
  const { addTestIdModifier } = useTestIdBuilder()

  /**
   * StatusBar height should be taken into consideration on Android, it is `null` on iOS
   */
  const StatusBarHeight = StatusBar.currentHeight || 0

  /**
   * Top SafeAreaInset should be taken into consideration on iOS, it is `0` on Android
   */
  const { top, bottom } = useSafeAreaInsets()

  return (
    <View style={[styles.container]} testID={addTestIdModifier(testID, 'screen')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={StatusBarHeight + top}
        style={styles.keyboardAvoidingView}>
        {children}
      </KeyboardAvoidingView>
      <View
        style={[
          styles.bottomPadding,
          { height: bottom, backgroundColor: whiteBottom ? colors.basicWhite : colors.basicBackground },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.basicBackground,
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  bottomPadding: {
    width: '100%',
  },
})
