import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { ProductDetailScreen } from '../screens/product-detail-screen'

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
export const BookDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-book.json')} />
)

export const CinemaDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-cinema.json')} />
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
  <ProductDetailScreen {...args} productDetail={require('./mocked-staged-event.json')} />
)

export const VideoDetail: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('./mocked-video.json')} />
)

export const RandomMode: ComponentStory<typeof ProductDetailScreen> = args => (
  <ProductDetailScreen {...args} productDetail={require('././mocked-audio.json')} randomMode />
)
