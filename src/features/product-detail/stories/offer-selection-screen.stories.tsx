import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { OfferSelectionScreen } from '../../../screens/product-details/offer-selection-screen'
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
