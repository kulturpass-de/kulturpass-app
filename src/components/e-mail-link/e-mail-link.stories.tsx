import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { EMailLink } from './e-mail-link'

const componentMeta: ComponentMeta<typeof EMailLink> = {
  title: 'EMail Link',
  component: EMailLink,
  args: {
    recipient: 'test@test.test',
    content: 'Test content',
    subject: 'Test subject',
    testID: 'link test id',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof EMailLink> = args => <EMailLink {...args} />
