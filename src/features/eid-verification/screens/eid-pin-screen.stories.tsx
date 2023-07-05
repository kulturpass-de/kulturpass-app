/* eslint-disable react/jsx-no-bind */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { logger } from '../../../services/logger'
import { EidPinScreen } from './eid-pin-screen'

const componentMeta: ComponentMeta<typeof EidPinScreen> = {
  title: 'EID Pin Input',
  component: EidPinScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidPinScreen> = () => {
  return (
    <View style={styles.container}>
      <EidPinScreen
        onNext={pin => {
          logger.log({ pin })
        }}
        onChangePin={() => {
          logger.log('onChangePin')
        }}
        onClose={() => {
          logger.log('onClose')
        }}
      />
    </View>
  )
}
export const Retry: ComponentStory<typeof EidPinScreen> = () => {
  return (
    <View style={styles.container}>
      <EidPinScreen
        onNext={pin => {
          logger.log({ pin })
        }}
        onChangePin={() => {
          logger.log('onChangePin')
        }}
        onClose={() => {
          logger.log('onClose')
        }}
        retryCounter={2}
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
