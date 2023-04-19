import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: spacing[5],
    borderTopRightRadius: spacing[5],
    height: '100%',
    backgroundColor: colors.basicBackground,
    overflow: 'hidden',
  },
})

export const ModalStackWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SafeAreaView edges={['top', 'left', 'right']}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  )
}
