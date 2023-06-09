import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { Text } from 'react-native'
import { Screen } from './screen'

const componentMeta: ComponentMeta<typeof Screen> = {
  title: 'Screen',
  component: Screen,
}

export default componentMeta

export const Basic: ComponentStory<typeof Screen> = args => <Screen {...args} />

export const WithText: ComponentStory<typeof Screen> = args => (
  <Screen {...args}>
    <Text>{'This is a screen with a text'}</Text>
  </Screen>
)
