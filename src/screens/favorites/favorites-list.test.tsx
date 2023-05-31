import React from 'react'
import { render, screen } from '@testing-library/react-native'

import { FavoritesList } from './favorites-list'
import { FavouritesItem } from '../../services/api/types/commerce/api-types'
import { StoreProvider } from '../../services/testing/test-utils'

test('Should display list of favorites', async () => {
  const favourites: FavouritesItem[] = [
    {
      cartId: 'cart1',
      entryNumber: 0,
      product: {
        code: 'AudioProduct-167159963977',
        description: 'Lively Chorus DE',
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
  ]

  render(
    <StoreProvider>
      <FavoritesList favourites={favourites} />
    </StoreProvider>,
  )

  const results = await screen.findAllByText('Lively Chorus DE')
  expect(results.length > 0).toBeTruthy()

  expect(results[0]).toBeOnTheScreen()
})
