import Lottie from 'lottie-react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'

export const LoadingAnimation: React.FC = () => {
  const { colorScheme } = useTheme()

  return (
    <Lottie
      style={styles.spinner}
      source={
        colorScheme === 'dark'
          ? require('./loading-animation-dark-lottie.json')
          : require('./loading-animation-light-lottie.json')
      }
      autoPlay
      loop
    />
  )
}

export const styles = StyleSheet.create({
  spinner: {
    width: 48,
    height: 48,
  },
})
