/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { StyleSheet, View } from 'react-native'
import { EidChangePinCompletionScreen } from './eid-change-pin-completion-screen'

const componentMeta: ComponentMeta<typeof EidChangePinCompletionScreen> = {
  title: 'EID Change Pin Completion',
  component: EidChangePinCompletionScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidChangePinCompletionScreen> = () => {
  return (
    <View style={styles.container}>
      <EidChangePinCompletionScreen
        onNext={() => {
          console.log('onNext')
        }}
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
