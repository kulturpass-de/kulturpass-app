import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { TabBarIcon } from './tab-bar-icon'

const componentMeta: ComponentMeta<typeof TabBarIcon> = {
  title: 'Tab Bar Icon',
  component: TabBarIcon,
  args: {
    name: 'Home',
    isFocused: false,
  },
  argTypes: {
    name: {
      control: 'radio',
      options: ['Home', 'Search', 'Reservations', 'Favorites', 'Settings'],
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof TabBarIcon> = args => <TabBarIcon {...args} />
