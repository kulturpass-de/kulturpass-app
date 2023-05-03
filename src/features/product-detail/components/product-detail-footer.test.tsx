import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { buildTestId } from '../../../services/test-id/test-id'
import { AppProviders, StoreProvider } from '../../../services/testing/test-utils'
import { ProductDetailFooter } from './product-detail-footer'
import { GetProfileResponseBody } from '../../../services/api/types/commerce/commerce-get-profile'

export const server = setupServer(
  rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        identificationStatus: 'VERIFIED',
        balanceStatus: 'ENTITLED',
        balance: {
          grantedBalance: { value: 200, currencyIso: 'EUR' },
          reservedBalance: { value: 170, currencyIso: 'EUR' },
          availableBalance: { value: 30, currencyIso: 'EUR' },
        },
      } as GetProfileResponseBody),
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderComponent = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <StoreProvider withLoginSession>{children}</StoreProvider>
    </AppProviders>,
  )
}

test('Should render product detail footer with sufficient credit', async () => {
  const onReserve = jest.fn()
  const onFavorite = jest.fn()

  renderComponent(
    <ProductDetailFooter
      onReserve={onReserve}
      onFavorite={onFavorite}
      selectedOffer={{ price: { value: 22.99, currencyIso: 'EUR' } }}
    />,
  )
  expect(await screen.findByTestId(buildTestId('productDetail_footer'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('productDetail_footer_priceTitle'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('productDetail_footer_reserve_button'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('productDetail_footer_reserve_button')))
  expect(onReserve).toHaveBeenCalledTimes(1)

  fireEvent.press(screen.getByTestId(buildTestId('productDetail_footer_favorite_button')))
  expect(onFavorite).toHaveBeenCalledTimes(1)
})

test('Should render product detail footer with non-sufficient credit', async () => {
  const onReserve = jest.fn()
  const onFavorite = jest.fn()

  server.use(
    rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          identificationStatus: 'VERIFIED',
          balanceStatus: 'ENTITLED',
          balance: {
            grantedBalance: { value: 200, currencyIso: 'EUR' },
            reservedBalance: { value: 190, currencyIso: 'EUR' },
            availableBalance: { value: 10, currencyIso: 'EUR' },
          },
        } as GetProfileResponseBody),
      )
    }),
  )

  renderComponent(
    <ProductDetailFooter
      onReserve={onReserve}
      onFavorite={onFavorite}
      selectedOffer={{ price: { value: 22.99, currencyIso: 'EUR' } }}
    />,
  )
  expect(await screen.findByTestId(buildTestId('productDetail_footer'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('productDetail_footer_cannot_afford_text'))).toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('productDetail_footer_price'))).toBeOnTheScreen()

  expect(screen.queryByTestId(buildTestId('productDetail_footer_priceTitle'))).not.toBeOnTheScreen()
  expect(screen.queryByTestId(buildTestId('productDetail_footer_reserve_button'))).not.toBeOnTheScreen()
  expect(screen.queryByTestId(buildTestId('productDetail_footer_favorite_button'))).not.toBeOnTheScreen()
})

test('Should render product detail footer without a total price', async () => {
  const onReserve = jest.fn()
  const onFavorite = jest.fn()

  server.use(
    rest.get('*/cc/kulturapp/users/current', (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          identificationStatus: 'VERIFIED',
          balanceStatus: 'ENTITLED',
          balance: {
            grantedBalance: { value: 200, currencyIso: 'EUR' },
            reservedBalance: { value: 200, currencyIso: 'EUR' },
            availableBalance: { value: 200, currencyIso: 'EUR' },
          },
        } as GetProfileResponseBody),
      )
    }),
  )

  renderComponent(
    <ProductDetailFooter
      onReserve={onReserve}
      onFavorite={onFavorite}
      // no offer = do not display the total price
      // selectedOffer={}
    />,
  )
  expect(await screen.findByTestId(buildTestId('productDetail_footer'))).toBeOnTheScreen()
  expect(screen.queryByTestId(buildTestId('productDetail_footer_priceTitle'))).not.toBeOnTheScreen()
  expect(screen.queryByTestId(buildTestId('productDetail_footer_price'))).not.toBeOnTheScreen()
  expect(screen.getByTestId(buildTestId('productDetail_footer_reserve_button'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('productDetail_footer_reserve_button')))
  expect(onReserve).toHaveBeenCalledTimes(1)

  fireEvent.press(screen.getByTestId(buildTestId('productDetail_footer_favorite_button')))
  expect(onFavorite).toHaveBeenCalledTimes(1)
})
