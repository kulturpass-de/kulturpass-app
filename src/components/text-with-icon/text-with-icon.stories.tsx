import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { TextWithIcon } from './text-with-icon'

const componentMeta: ComponentMeta<typeof TextWithIcon> = {
  title: 'Text With Icon',
  component: TextWithIcon,
  args: {
    i18nKey: 'accountDeletion_confirm_title',
    iconType: 'report',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof TextWithIcon> = args => <TextWithIcon {...args} />
