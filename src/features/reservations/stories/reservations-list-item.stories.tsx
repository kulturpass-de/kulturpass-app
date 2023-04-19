import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { ReservationsListItem } from '../components/reservations-list-item'
import {
  DELIVERY_SCENARIO_IN_APP_VOUCHER,
  DELIVERY_SCENARIO_PICKUP,
  ORDER_STATUS_CANCELLED,
  ORDER_STATUS_COMPLETED,
  ORDER_STATUS_CREATED,
  ORDER_STATUS_READY_FOR_PICKUP,
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_SHIPPING,
} from '../../../services/api/types/commerce/commerce-reservations'

const componentMeta: ComponentMeta<typeof ReservationsListItem> = {
  title: 'Reservation List Item',
  component: ReservationsListItem,
  args: {
    productName:
      'Der Herr der Ringe - Die 2 Türme der Su Der Herr der Ringe - Die 2 Türme Die 2 Türme der Su Der Herr der Ringe ',
    imageUrl: '/medias/book.png',
    price: {
      value: 19.99,
      currencyIso: 'EUR',
    },
    shopName: 'Buchhandlung Walther Buchhandlung Walther Buchhandlung Walther',
    completed: false,
  },
}

export default componentMeta

export const Created: ComponentStory<typeof ReservationsListItem> = args => {
  return <ReservationsListItem status={ORDER_STATUS_CREATED} {...args} />
}

export const Shipping: ComponentStory<typeof ReservationsListItem> = args => {
  return <ReservationsListItem status={ORDER_STATUS_SHIPPING} {...args} />
}

export const Cancelled: ComponentStory<typeof ReservationsListItem> = args => {
  return <ReservationsListItem status={ORDER_STATUS_CANCELLED} {...args} />
}

export const ReadyForPickup: ComponentStory<typeof ReservationsListItem> = args => {
  return (
    <ReservationsListItem
      status={ORDER_STATUS_READY_FOR_PICKUP}
      deliveryScenario={DELIVERY_SCENARIO_PICKUP}
      {...args}
    />
  )
}

export const Received: ComponentStory<typeof ReservationsListItem> = args => {
  return <ReservationsListItem status={ORDER_STATUS_RECEIVED} deliveryScenario={DELIVERY_SCENARIO_PICKUP} {...args} />
}

export const Completed: ComponentStory<typeof ReservationsListItem> = args => {
  return <ReservationsListItem status={ORDER_STATUS_COMPLETED} deliveryScenario={DELIVERY_SCENARIO_PICKUP} {...args} />
}

export const VoucherReadyForPickup: ComponentStory<typeof ReservationsListItem> = args => {
  return (
    <ReservationsListItem
      status={ORDER_STATUS_READY_FOR_PICKUP}
      deliveryScenario={DELIVERY_SCENARIO_IN_APP_VOUCHER}
      {...args}
    />
  )
}

export const VoucherReceived: ComponentStory<typeof ReservationsListItem> = args => {
  return (
    <ReservationsListItem
      status={ORDER_STATUS_RECEIVED}
      deliveryScenario={DELIVERY_SCENARIO_IN_APP_VOUCHER}
      {...args}
    />
  )
}

export const VoucherCompleted: ComponentStory<typeof ReservationsListItem> = args => {
  return (
    <ReservationsListItem
      status={ORDER_STATUS_READY_FOR_PICKUP}
      deliveryScenario={DELIVERY_SCENARIO_IN_APP_VOUCHER}
      {...args}
    />
  )
}
