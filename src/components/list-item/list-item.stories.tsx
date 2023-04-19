import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { ListItem } from './list-item'

const componentMeta: ComponentMeta<typeof ListItem> = {
  title: 'List Item',
  component: ListItem,
  args: {
    title: 'Test List Item',
    testID: 'testID',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof ListItem> = args => <ListItem {...args} />
