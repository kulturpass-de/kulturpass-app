import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { UpdateProfileAlert } from './update-profile-alert'

const componentMeta: ComponentMeta<typeof UpdateProfileAlert> = {
  title: 'Update Profile Alert',
  component: UpdateProfileAlert,
  args: {
    onDiscard: () => {},
    onDismiss: () => {},
    visible: true,
  },
  argTypes: {},
}

export default componentMeta

export const Basic: ComponentStory<typeof UpdateProfileAlert> = args => <UpdateProfileAlert {...args} />
