/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { StyleSheet, View } from 'react-native'
import { ReservationDetailScreen } from './reservation-detail-screen'
import { Offer, Order } from '../../../services/api/types/commerce/api-types'
import { ProductDetail, ProductTypes } from '../../product-detail/types/product-detail'

const componentMeta: ComponentMeta<typeof ReservationDetailScreen> = {
  title: 'Pickup Reservation Detail Screen',
  component: ReservationDetailScreen,
}

const selectedOffer: Offer = {
  id: '555',
}
const productDetail: ProductDetail = {
  // ageRating: 'NO_RESTRICTION',
  // artist: 'Artist',
  author: 'Author',
  categories: [],
  code: '555',
  name: 'Product name',
  // composer: 'Composer',
  description: 'Description',
  // ean: 'EAN-555',
  images: [],
  isbn: '',
  publisher: '',
  purchasable: true,
  url: '',
  productType: ProductTypes.Book,
  offers: [selectedOffer],
}

export default componentMeta

const buildStoryForOrderStatus = (orderStatus: Order['status']) => {
  const order: Order = {
    code: 'TEST-555',
    cancellable: true,
    status: orderStatus,
  }
  return (
    <View style={styles.container}>
      <ReservationDetailScreen
        afterCancelReservationTriggered={() => {}}
        onClose={() => {}}
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
