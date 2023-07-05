/* eslint-disable react/jsx-no-bind */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { logger } from '../../../services/logger'
import { EidPukScreen } from './eid-puk-screen'

const componentMeta: ComponentMeta<typeof EidPukScreen> = {
  title: 'EID Puk Input',
  component: EidPukScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidPukScreen> = () => {
  return (
    <View style={styles.container}>
      <EidPukScreen
        onNext={puk => {
          logger.log({ puk })
        }}
        onClose={() => {
          logger.log('onClose')
        }}
        retry={false}
      />
    </View>
  )
}

export const Error: ComponentStory<typeof EidPukScreen> = () => {
  return (
    <View style={styles.container}>
      <EidPukScreen
        onNext={puk => {
          logger.log({ puk })
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
