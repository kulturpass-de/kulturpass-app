import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'

import { WebviewLoadingIndicator } from './webview-loading-indicator'

const componentMeta: ComponentMeta<typeof WebviewLoadingIndicator> = {
  title: 'Webview Loading Indicator',
  component: WebviewLoadingIndicator,
}

export default componentMeta

export const Basic: ComponentStory<typeof WebviewLoadingIndicator> = args => <WebviewLoadingIndicator {...args} />
