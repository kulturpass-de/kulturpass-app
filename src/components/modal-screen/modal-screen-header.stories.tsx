import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { ModalScreenHeader } from './modal-screen-header'

const componentMeta: ComponentMeta<typeof ModalScreenHeader> = {
  title: 'Modal Screen Header',
  component: ModalScreenHeader,
  args: {
    titleI18nKey: 'settings_headline',
  },
  argTypes: {
    onPressBack: {
      action: 'onPressBack',
    },
    onPressClose: {
      control: 'onPressClose',
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof ModalScreenHeader> = args => <ModalScreenHeader {...args} />
