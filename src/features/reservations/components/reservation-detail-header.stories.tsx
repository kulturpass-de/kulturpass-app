import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'

import { ReservationDetailHeader } from './reservation-detail-header'

const onClose = () => {}

const componentMeta: ComponentMeta<typeof ReservationDetailHeader> = {
  title: 'Pickup Reservation Detail Header',
  component: ReservationDetailHeader,
}

export default componentMeta

export const WithoutBarcode: ComponentStory<typeof ReservationDetailHeader> = () => {
  const code = (Math.random() * 10).toString()
  return <ReservationDetailHeader onClose={onClose} order={{ code }} />
}

export const WithBardcode: ComponentStory<typeof ReservationDetailHeader> = () => {
  const code = (Math.random() * 10).toString()
  return (
    <ReservationDetailHeader
      onClose={onClose}
      order={{ code, status: 'READY_FOR_PICKUP', entries: [{ barcodeData: 'abcdef' }] }}
    />
  )
}
