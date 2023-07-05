/* eslint-disable react/jsx-no-bind */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { logger } from '../../../services/logger'
import { EidCanScreen } from './eid-can-screen'

const componentMeta: ComponentMeta<typeof EidCanScreen> = {
  title: 'EID Can Input',
  component: EidCanScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidCanScreen> = () => {
  return (
    <View style={styles.container}>
      <EidCanScreen
        onNext={can => {
          logger.log({ can })
        }}
        onClose={() => {
          logger.log('onClose')
        }}
        retry={false}
      />
    </View>
  )
}

export const Error: ComponentStory<typeof EidCanScreen> = () => {
  return (
    <View style={styles.container}>
      <EidCanScreen
        onNext={can => {
          logger.log({ can })
        }}
        onClose={() => {
          logger.log('onClose')
        }}
        retry={true}
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
