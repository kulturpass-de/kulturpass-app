import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { CopyToClipboard } from './copy-to-clipboard'

const componentMeta: ComponentMeta<typeof CopyToClipboard> = {
  title: 'CopyToClipboard',
  component: CopyToClipboard,
  args: {},
}

export default componentMeta

export const Default: ComponentStory<typeof CopyToClipboard> = args => {
  return <CopyToClipboard {...args} />
}
