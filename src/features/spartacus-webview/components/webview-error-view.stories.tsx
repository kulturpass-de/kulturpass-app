import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { ERR_NO_INTERNET, WebviewErrorView } from './webview-error-view'

const componentMeta: ComponentMeta<typeof WebviewErrorView> = {
  title: 'Webview Error View',
  component: WebviewErrorView,
  args: {
    errorCode: 1234,
  },
  argTypes: { onRefresh: { action: 'onRefresh' } },
}

export default componentMeta

export const Basic: ComponentStory<typeof WebviewErrorView> = args => <WebviewErrorView {...args} />

export const NoInternet: ComponentStory<typeof WebviewErrorView> = args => (
  <WebviewErrorView {...args} errorCode={ERR_NO_INTERNET} />
)
