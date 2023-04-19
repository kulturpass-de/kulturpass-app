import React from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '100%',
  },
})

export const ModalStackCardOverlay: React.FC = () => {
  return <View style={styles.container} />
}
