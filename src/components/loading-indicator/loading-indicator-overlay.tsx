import React from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { LoadingAnimation } from '../loading-animation/loading-animation'

export const LoadingIndicatorOverlay: React.FC = () => {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.alertBackdrop }]}>
      <StatusBar backgroundColor={colors.alertBackdrop} translucent />
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
  },
})
