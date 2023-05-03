import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native'
import { colors } from '../../theme/colors'
import Lottie from 'lottie-react-native'

export const LoadingIndicatorOverlay: React.FC = () => {
  return (
    <View style={styles.container}>
      <Lottie cacheStrategy="strong" style={styles.spinner} source={require('./loading-spinner.json')} autoPlay loop />
    </View>
  )
}

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.basicWhite,
    opacity: 0.8,
  },
  spinner: {
    width: 48,
    height: 48,
  },
})
