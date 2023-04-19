import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { resources } from '../../services/translation/setup'
import { TranslationProvider } from '../../services/translation/translation'
import { FavoritesList } from './favorites-list'
import { Cart } from '../../services/api/types/commerce/api-types'
import { StoreProvider } from '../../services/testing/test-utils'

test('Should display list of favorites', async () => {
  const cart: Cart = {
    entries: [
      {
        product: {
          code: 'npfv70',
          images: [
            {
              altText: 'NP-FV 70',
              format: 'zoom',
              imageType: 'PRIMARY',
              url: '/medias/?context=bWFzdGVyfGltYWdlc3wyMjg4MXxpbWFnZS9qcGVnfGFXMWhaMlZ6TDJobE15OW9NREF2T0RjNU56UTROemMxT1RNNU1DNXFjR2N8ZGNlMjMxY2RlNjRlM2E0MDIwZWZiZWMxMjdjYWNlZTIyNDhiNzk1YzI2YzZhZWFiNWQ3YzRkNGMzYzY5NDhmNw',
            },
            {
              altText: 'NP-FV 70',
              format: 'product',
              imageType: 'PRIMARY',
              url: '/medias/?context=bWFzdGVyfGltYWdlc3w5MTQxfGltYWdlL2pwZWd8YVcxaFoyVnpMMmd3WkM5b1pEWXZPRGM1TnpVeE16Y3hNVFkwTmk1cWNHY3w4ODdhNmZhODllMzA3MzA5ZjBhYzkyZGY5MWQzYjYxZTdhNGMyNzFhMzM3ZTZhMTgwYmM5Y2ZjMTkzMzRkMjdj',
            },
            {
              altText: 'NP-FV 70',
              format: 'thumbnail',
              imageType: 'PRIMARY',
              url: '/medias/?context=bWFzdGVyfGltYWdlc3wyMjI2fGltYWdlL2pwZWd8YVcxaFoyVnpMMmcyTXk5b1lUZ3ZPRGM1TnpVek9UazVNVFU0TWk1cWNHY3w4ZjdiMDY1ZmUwMDc0YzkzMWJmMGJiOGQ4OTM0OTA2YzBmNjViZjgwOTlkZjQ3N2JjNzU2NTk4YmM3NDA5YTYy',
            },
            {
              altText: 'NP-FV 70',
              format: 'cartIcon',
              imageType: 'PRIMARY',
              url: '/medias/?context=bWFzdGVyfGltYWdlc3wxNTY5fGltYWdlL2pwZWd8YVcxaFoyVnpMMmd4TWk5b05HUXZPRGM1TnpVMk5qWXpNVGsyTmk1cWNHY3w1NzA4ZDJmZDYyZDdlNDg2Njg2MTkyNTYyNjljYjE3ZGY5NGExMWJlN2M4YTVkZTFkOWU0NWQ2ZTNmOTgzMGZi',
            },
          ],
          name: 'NP-FV 70',
        },
        totalPrice: {
          currencyIso: 'USD',
          formattedValue: '$204.75',
          priceType: 'BUY',
          value: 204.75,
        },
      },
    ],
  }

  render(
    <StoreProvider>
      <TranslationProvider fallbackLng="de" debug={false} resources={resources}>
        {cart.entries ? <FavoritesList orderEntries={cart.entries} /> : null}
      </TranslationProvider>
    </StoreProvider>,
  )

  const results = await screen.findAllByText('NP-FV 70')
  expect(results.length > 0).toBeTruthy()

  expect(results[0]).toBeOnTheScreen()
})
