import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { Icon } from './icon'

const componentMeta: ComponentMeta<typeof Icon> = {
  title: 'Icon',
  component: Icon,
  args: {
    source: 'ShowPassword',
  },
  argTypes: {
    source: {
      control: 'radio',
      options: ['Chevron', 'Cog', 'ArrowBack', 'Close', 'ShowPassword'],
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof Icon> = args => <Icon {...args} />
