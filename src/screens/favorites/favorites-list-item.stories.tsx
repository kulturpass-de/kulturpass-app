import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import { FavoritesListItem } from './favorites-list-item'

const componentMeta: ComponentMeta<typeof FavoritesListItem> = {
  title: 'Favorite List Item',
  component: FavoritesListItem,
  args: {
    favourite: {
      cartId: 'cart1',
      entryNumber: 0,
      product: {
        code: 'AudioProduct-167159963977',
        description: 'Lively Chorus DE',
        eventStartDate: '1985-05-14T11:00:00+0000',
        images: [
          {
            format: 'thumbnail',
            imageType: 'PRIMARY',
            url: '/medias/96Wx96H-null?context=bWFzdGVyfHJvb3R8NDIwMHxpbWFnZS9qcGVnfGFHWTNMMmd3T0M4NE56azRNelk1TmpjM016UXlMemsyVjNnNU5raGZiblZzYkF8ZTRhM2FlMjAyNTRiZGFhYzA4N2ZmMWNhZTMwNTI2MzFhMGNjOTFiNzBlZDkyMTAwYmQ4NGRmOGNkMmNmN2NlMQ',
          },
          {
            format: 'product',
            imageType: 'PRIMARY',
            url: '/medias/300Wx300H-null?context=bWFzdGVyfHJvb3R8Mjc1NjR8aW1hZ2UvanBlZ3xhREpsTDJnMllpODROems0TXpZNE16WTJOakl5THpNd01GZDRNekF3U0Y5dWRXeHN8MDcyOTZmZTM4MmVkYWIwM2E2MGMyZDExNjc4Yjg4MmY1YjY5YWE4YmVlNGUzZDQzMTI4ZDNlYjdiZTJkZmMwOQ',
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
        url: '/Katalog-%C3%B6ffnen/Marktplatz/Tontr%C3%A4ger/R%26B-%26-Soul/Lively-Chorus-DE/p/AudioProduct-167159963977',
      },
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof FavoritesListItem> = args => <FavoritesListItem {...args} />
