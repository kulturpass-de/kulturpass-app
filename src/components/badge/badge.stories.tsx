import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { Badge } from './badge'

const componentMeta: ComponentMeta<typeof Badge> = {
  title: 'Badge',
  component: Badge,
  args: {
    i18nKey: 'voucher_badge',
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof Badge> = args => <Badge {...args} />
