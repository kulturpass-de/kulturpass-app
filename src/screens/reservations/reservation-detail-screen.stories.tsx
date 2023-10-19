/* eslint-disable react/jsx-no-bind */
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProductDetail } from '../../features/product-detail/types/product-detail'
import { Order } from '../../services/api/types/commerce/api-types'
import { ReservationDetailScreen } from './reservation-detail-screen'

const componentMeta: ComponentMeta<typeof ReservationDetailScreen> = {
  title: 'Workshop Reservation Detail Screen',
  component: ReservationDetailScreen,
}

const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-cultural-workshop.json')

export default componentMeta

const buildStoryForOrderStatus = (orderStatus: Order['status']) => {
  const order: Order = {
    code: 'TEST-555',
    cancellable: true,
    status: orderStatus,
    entries: [
      {
        offerId: '555',
      },
    ],
  }

  return (
    <View style={styles.container}>
      <ReservationDetailScreen
        afterCancelReservationTriggered={() => {}}
        onClose={() => {}}
        onPressReportButton={() => {}}
        order={order}
        productDetail={productDetail}
      />
    </View>
  )
}

export const Created: ComponentStory<typeof ReservationDetailScreen> = () => buildStoryForOrderStatus('CREATED')
export const ReadyForPickup: ComponentStory<typeof ReservationDetailScreen> = () =>
  buildStoryForOrderStatus('READY_FOR_PICKUP')
export const Received: ComponentStory<typeof ReservationDetailScreen> = () => buildStoryForOrderStatus('RECEIVED')
export const Completed: ComponentStory<typeof ReservationDetailScreen> = () => buildStoryForOrderStatus('COMPLETED')
export const Cancelling: ComponentStory<typeof ReservationDetailScreen> = () => buildStoryForOrderStatus('CANCELLING')
export const Cancelled: ComponentStory<typeof ReservationDetailScreen> = () => buildStoryForOrderStatus('CANCELLED')

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    padding: 16,
    flex: 1,
    height: '100%',
    width: '100%',
  },
})
