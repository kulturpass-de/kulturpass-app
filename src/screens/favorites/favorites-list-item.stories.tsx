import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { FavoritesListItem } from './favorites-list-item'

const componentMeta: ComponentMeta<typeof FavoritesListItem> = {
  title: 'Favorite List Item',
  component: FavoritesListItem,
  args: {
    product: {
      code: 'AudioProduct-167159963977',
      description: 'Lively Chorus DE',
      eventStartDate: '1985-05-14T11:00:00+0000',
      images: [
        {
          altText: 'REDEMPTION_CODE',
          format: 'product',
          imageType: 'PRIMARY',
          url: '/medias/300Wx300H-null?context=bWFzdGVyfHJvb3R8MjkxNjl8aW1hZ2UvanBlZ3xhREU0TDJneE5DODRPRFV3T0RFNU56YzJOVFF5THpNd01GZDRNekF3U0Y5dWRXeHN8NDE3ZWEyYjQyOGY3NzYyZDVkODUzOTNjNmFmMWIzY2ZiYWEzMjg3NTE2M2VjYTJiOGZjYTdkMzVkZTkxM2Y5MQ',
        },
      ],
      itemType: 'AudioProduct',
      leafCategoryName: 'soulAudio',
      lowestOfferPrice: 35.01,
      name: 'Lively Chorus DE',
      offerCount: 2,
      offersSummary: {
        bestOffer: {
          allOfferPricingsJSON:
            '[{"price":35.01,"unit_origin_price":35.01,"volume_prices":[{"price":35.01,"unit_origin_price":35.01,"quantity_threshold":1}]}]',
          code: 'offer_20575',
          minPurchasableQty: 1,
          minShippingPrice: {
            currencyIso: 'EUR',
            value: 0.0,
          },
          originPrice: {
            currencyIso: 'EUR',
            value: 35.01,
          },
          price: {
            currencyIso: 'EUR',
            value: 35.01,
          },
          quantity: 449,
          shopId: '2008',
          shopName: 'Stuttgart Seller Shop',
          stateCode: '11',
          totalPrice: {
            currencyIso: 'EUR',
            value: 35.01,
          },
        },
        offerCount: 2,
        states: [
          {
            minPrice: {
              currencyIso: 'EUR',
              value: 35.01,
            },
            offerCount: 2,
            stateCode: '11',
            stateLabel: 'Neu',
          },
        ],
      },
      shopDistance: 11.4,
      topCategoryName: 'Tonträger',
      fulfillmentOption: 'REDEMPTION_CODE',
      url: '/Katalog-%C3%B6ffnen/Marktplatz/Tontr%C3%A4ger/R%26B-%26-Soul/Lively-Chorus-DE/p/AudioProduct-167159963977',
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof FavoritesListItem> = args => <FavoritesListItem {...args} />
