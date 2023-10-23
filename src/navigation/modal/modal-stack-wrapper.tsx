import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: spacing[5],
    borderTopRightRadius: spacing[5],
    height: '100%',
    overflow: 'hidden',
  },
})

export const ModalStackWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { colors } = useTheme()
  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <View style={[styles.container, { backgroundColor: colors.primaryBackground }]}>{children}</View>
    </SafeAreaView>
  )
}
