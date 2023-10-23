import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { CopyToClipboard } from './copy-to-clipboard'

const componentMeta: ComponentMeta<typeof CopyToClipboard> = {
  title: 'CopyToClipboard',
  component: CopyToClipboard,
  args: {
    accessibilityLabelI18nKey: 'productDetail_offer_copyToClipboard',
    copiedAccessibilityI18nKey: 'productDetail_offer_copiedToClipboard',
    onPress: () => {
      console.log('copied')
    },
  },
}

export default componentMeta

export const Default: ComponentStory<typeof CopyToClipboard> = args => {
  return <CopyToClipboard {...args} />
}
