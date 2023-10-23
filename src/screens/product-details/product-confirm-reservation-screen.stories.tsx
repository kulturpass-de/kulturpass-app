import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProductDetail } from '../../features/product-detail/types/product-detail'
import { ProductConfirmReservationScreen } from './product-confirm-reservation-screen'

const noOp = () => {
  console.log('noOp')
}

const componentMeta: ComponentMeta<typeof ProductConfirmReservationScreen> = {
  title: 'Reservation Confirm Screen',
  component: ProductConfirmReservationScreen,
  decorators: [
    Story => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
  args: {
    afterReserveProduct: noOp,
    onBack: noOp,
    onClose: noOp,
  },
}

export default componentMeta

export const Workshop: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-cultural-workshop.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

export const Audio: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-audio.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

export const CinemaVoucherCoupon: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-cinema-voucher-coupon.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

export const Cinema: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-cinema.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

export const Exhibit: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-exhibit.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

export const MusicInstrument: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-music-instrument.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

export const SheetMusic: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-sheet-music.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

export const StagedEvent: ComponentStory<typeof ProductConfirmReservationScreen> = args => {
  const productDetail: ProductDetail = require('../../features/product-detail/stories/mocked-staged-event.json')

  return (
    <ProductConfirmReservationScreen
      {...args}
      selectedOffer={productDetail?.offers && (productDetail.offers[0] as any)}
      productDetail={productDetail}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    padding: 16,
    flex: 1,
    height: '100%',
    width: '100%',
  },
})
