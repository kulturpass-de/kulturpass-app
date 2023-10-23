import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { CircleIconButton } from './circle-icon-button'

const componentMeta: ComponentMeta<typeof CircleIconButton> = {
  title: 'CircleIconButton',
  component: CircleIconButton,
  args: {
    testID: 'TEST',
    accessibilityLabelI18nKey: 'productDetail_header_closeButton',
    iconSource: 'close',
  },
  argTypes: {
    onPress: {
      control: 'onPress',
    },
  },
}

export default componentMeta

export const Default: ComponentStory<typeof CircleIconButton> = args => <CircleIconButton {...args} />
