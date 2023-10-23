/* eslint-disable react-native/no-inline-styles */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { ProductDetailFooter } from './product-detail-footer'

const componentMeta: ComponentMeta<typeof ProductDetailFooter> = {
  title: 'ProductDetailFooter',
  component: ProductDetailFooter,
  argTypes: {
    onReserve: {
      action: 'onReserve',
    },
  },
  decorators: [
    Story => (
      <View style={{ flexGrow: 1, flex: 1 }}>
        <View style={{ flexGrow: 1, flex: 1 }} />
        <Story />
      </View>
    ),
  ],
}

export default componentMeta

export const NotAffordable: ComponentStory<typeof ProductDetailFooter> = props => {
  return (
    <ProductDetailFooter
      {...props}
      selectedOffer={{ price: { value: 1000000, currencyIso: 'EUR' }, code: 'TEST' }}
      fulfillmentOption="PICKUP_CODE"
    />
  )
}

export const NotAffordableVoucher: ComponentStory<typeof ProductDetailFooter> = props => {
  return (
    <ProductDetailFooter
      {...props}
      selectedOffer={{ price: { value: 1000000, currencyIso: 'EUR' }, code: 'TEST' }}
      fulfillmentOption="REDEMPTION_CODE"
    />
  )
}
