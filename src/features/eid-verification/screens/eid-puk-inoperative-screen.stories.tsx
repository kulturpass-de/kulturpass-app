/* eslint-disable react/jsx-no-bind */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { logger } from '../../../services/logger'
import { EidPukInoperativeScreen } from './eid-puk-inoperative-screen'

const componentMeta: ComponentMeta<typeof EidPukInoperativeScreen> = {
  title: 'EID Puk Inoperative',
  component: EidPukInoperativeScreen,
}

export default componentMeta

export const Basic: ComponentStory<typeof EidPukInoperativeScreen> = () => {
  return (
    <View style={styles.container}>
      <EidPukInoperativeScreen
        onClose={() => {
          logger.log('onClose')
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
