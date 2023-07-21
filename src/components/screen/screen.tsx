import React, { PropsWithChildren } from 'react'
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Edge, SafeAreaView } from 'react-native-safe-area-context'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'

export type ScreenProps = PropsWithChildren<{
  testID: string
  header?: React.ReactNode
  withBasicBackground?: boolean
}>

export const Screen: React.FC<ScreenProps> = ({ header, children, testID, withBasicBackground = false }) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const edges: Edge[] = header ? ['left', 'right'] : ['top', 'left', 'right']
  const backgroundColor = withBasicBackground || header ? colors.primaryBackground : colors.secondaryBackground

  return (
    <SafeAreaView
      style={[styles.safeAreaView, { backgroundColor }]}
      testID={addTestIdModifier(testID, 'screen')}
      edges={edges}>
      {header}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}>
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
})
