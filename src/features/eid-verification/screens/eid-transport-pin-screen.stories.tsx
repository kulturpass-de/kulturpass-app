/* eslint-disable react/jsx-no-bind */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { logger } from '../../../services/logger'
import { EidTransportPinScreen } from './eid-transport-pin-screen'

const componentMeta: ComponentMeta<typeof EidTransportPinScreen> = {
  title: 'EID Transport Pin Input',
  component: EidTransportPinScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidTransportPinScreen> = () => {
  return (
    <View style={styles.container}>
      <EidTransportPinScreen
        onNext={can => {
          logger.log({ can })
        }}
        onClose={() => {
          logger.log('onClose')
        }}
      />
    </View>
  )
}

export const Retry: ComponentStory<typeof EidTransportPinScreen> = () => {
  return (
    <View style={styles.container}>
      <EidTransportPinScreen
        onNext={can => {
          logger.log({ can })
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
