import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '../../theme/colors'

export type LoadingSpinnerProps = {
  isEnabled?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isEnabled }) => {
  if (!isEnabled) {
    return null
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'left', 'right']}>
        <ActivityIndicator color={colors.moonDarkest} />
      </SafeAreaView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: colors.sunLighter,
    opacity: 0.5,
    zIndex: 1,
  },
})
