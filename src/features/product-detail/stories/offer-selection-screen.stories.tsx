import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { OfferSelectionScreen } from '../screens/offer-selection-screen'
import { ProductDetail } from '../types/product-detail'

const componentMeta: ComponentMeta<typeof OfferSelectionScreen> = {
  title: 'Offer Selection Screen',
  component: OfferSelectionScreen,
  argTypes: {
    onClose: {
      action: 'onClose',
    },
    onBack: {
      action: 'onBack',
    },
    selectOffer: {
      action: 'selectOffer',
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof OfferSelectionScreen> = args => {
  const productDetail: ProductDetail = require('./mocked-audio.json')
  const offers = productDetail.offers ?? []
  return <OfferSelectionScreen {...args} productImageUrl="/medias/test.png" offers={offers} />
}
