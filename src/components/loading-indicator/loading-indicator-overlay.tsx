import React from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { colors } from '../../theme/colors'
import { useTheme } from '../../theme/hooks/use-theme'
import { LoadingAnimation } from '../loading-animation/loading-animation'

export const LoadingIndicatorOverlay: React.FC = () => {
  const { barStyle } = useTheme()

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.transparentWhite80} translucent barStyle={barStyle} />
      <LoadingAnimation />
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparentWhite80,
  },
})
