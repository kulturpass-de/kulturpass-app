import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { LoadingIndicatorOverlay } from './loading-indicator-overlay'

const componentMeta: ComponentMeta<typeof LoadingIndicatorOverlay> = {
  title: 'Loading Indicator Overlay',
  component: LoadingIndicatorOverlay,
}

export default componentMeta

export const Basic: ComponentStory<typeof LoadingIndicatorOverlay> = args => <LoadingIndicatorOverlay {...args} />
