/* eslint-disable react/jsx-no-bind */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { EidNFCNotSupportedScreen } from './eid-nfc-not-supported-screen'

const componentMeta: ComponentMeta<typeof EidNFCNotSupportedScreen> = {
  title: 'EID NFC not supported',
  component: EidNFCNotSupportedScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidNFCNotSupportedScreen> = () => {
  return (
    <View style={styles.container}>
      <EidNFCNotSupportedScreen
        onClose={() => {
          console.log('onClose')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    padding: 16,
    flex: 1,
    height: '100%',
    width: '100%',
  },
})
