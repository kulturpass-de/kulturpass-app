import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { LinkText } from './link-text'

const componentMeta: ComponentMeta<typeof LinkText> = {
  title: 'Link Text',
  component: LinkText,
  args: {
    link: 'https://www.sap.com',
    i18nKey: 'eid_aboutVerification_faq_link',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof LinkText> = args => <LinkText {...args} />
