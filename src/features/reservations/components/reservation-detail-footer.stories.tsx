/* eslint-disable react-native/no-inline-styles */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { View } from 'react-native'
import { ReservationDetailFooter } from './reservation-detail-footer'

const componentMeta: ComponentMeta<typeof ReservationDetailFooter> = {
  title: 'ReservationDetailFooter',
  component: ReservationDetailFooter,
  argTypes: {
    onCancelReservation: {
      action: 'onCancelReservation',
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

export const Refund: ComponentStory<typeof ReservationDetailFooter> = props => {
  return (
    <ReservationDetailFooter
      {...props}
      refunds={{
        refundAmount: { value: 5, currencyIso: 'EUR' },
        totalWithoutRefunds: { value: 50, currencyIso: 'EUR' },
      }}
      price={{ value: 45, currencyIso: 'EUR' }}
      fulfillmentOption="PICKUP_CODE"
    />
  )
}

export const RefundVoucher: ComponentStory<typeof ReservationDetailFooter> = props => {
  return (
    <ReservationDetailFooter
      {...props}
      refunds={{
        refundAmount: { value: 5, currencyIso: 'EUR' },
        totalWithoutRefunds: { value: 50, currencyIso: 'EUR' },
      }}
      price={{ value: 45, currencyIso: 'EUR' }}
      fulfillmentOption="REDEMPTION_CODE"
    />
  )
}

export const NoRefund: ComponentStory<typeof ReservationDetailFooter> = props => {
  return (
    <ReservationDetailFooter {...props} price={{ value: 45, currencyIso: 'EUR' }} fulfillmentOption="REDEMPTION_CODE" />
  )
}
