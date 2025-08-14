import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { MobilityOffersProductDetailScreen } from '../screens/mobility-offers-product-detail-screen'

const componentMeta: ComponentMeta<typeof MobilityOffersProductDetailScreen> = {
  title: 'CopyToClipboard',
  component: MobilityOffersProductDetailScreen,
}

export default componentMeta

export const Default: ComponentStory<typeof MobilityOffersProductDetailScreen> = args => {
  return <MobilityOffersProductDetailScreen {...args} />
}
