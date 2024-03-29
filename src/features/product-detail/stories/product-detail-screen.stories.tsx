import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { ProductDetailScreen } from '../../../screens/product-details/product-detail-screen'

const componentMeta: ComponentMeta<typeof ProductDetailScreen> = {
  title: 'Product Detail Screen',
  component: ProductDetailScreen,
  args: {
    randomMode: false,
  },
  argTypes: {
    onClose: {
      action: 'onClose',
    },
    onOfferSelection: {
      action: 'onOfferSelection',
    },
    onRandomReroll: {
      action: 'onRandomReroll',
    },
    reserveProduct: {
      action: 'reserveProduct',
    },
  },
}

export default componentMeta

export const AudioDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-audio.json')} />
)
export const AudioDetailSelectedOffer: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen
    {...args}
    productDetail={require('./mocked-audio.json')}
    selectedOffer={require('./mocked-audio.json').offers[0]}
  />
)

export const BookDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-book.json')} />
)

export const SeasonTicketLibraryDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-season-ticket-library.json')} />
)

export const CinemaDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-cinema.json')} />
)

export const CinemaVoucherDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('././mocked-cinema-voucher-coupon.json')} />
)

export const ExhibitDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-exhibit.json')} />
)

export const MusicInstrumentDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-music-instrument.json')} />
)

export const SheetMusicDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-sheet-music.json')} />
)

export const StagedEventDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen
    {...args}
    productDetail={require('./mocked-staged-event.json')}
    selectedOffer={require('./mocked-staged-event.json').offers[0]}
  />
)

export const RandomMode: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('././mocked-audio.json')} randomMode />
)

export const CulturalWorkshop: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen
    {...args}
    productDetail={require('./mocked-cultural-workshop.json')}
    selectedOffer={require('./mocked-cultural-workshop.json').offers[0]}
  />
)
