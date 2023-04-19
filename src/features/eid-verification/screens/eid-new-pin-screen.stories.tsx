/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { StyleSheet, View } from 'react-native'
import { EidNewPinScreen } from './eid-new-pin-screen'

const componentMeta: ComponentMeta<typeof EidNewPinScreen> = {
  title: 'EID New Pin Input',
  component: EidNewPinScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidNewPinScreen> = () => {
  return (
    <View style={styles.container}>
      <EidNewPinScreen
        onNext={can => {
          console.log({ can })
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
