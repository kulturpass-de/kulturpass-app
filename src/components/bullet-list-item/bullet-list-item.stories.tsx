import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { Text } from 'react-native'
import { BulletListItem } from './bullet-list-item'

const componentMeta: ComponentMeta<typeof BulletListItem> = {
  title: 'Bullet List Item',
  component: BulletListItem,
  args: {},
}

export default componentMeta

export const Default: ComponentStory<typeof BulletListItem> = args => (
  <BulletListItem {...args}>
    <Text>{'test item'}</Text>
  </BulletListItem>
)
