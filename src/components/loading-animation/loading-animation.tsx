import React from 'react'
import Lottie from 'lottie-react-native'
import { StyleSheet } from 'react-native'

export const LoadingAnimation: React.FC = () => {
  return (
    <Lottie
      cacheStrategy="strong"
      style={styles.spinner}
      source={require('./loading-animation-lottie.json')}
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
