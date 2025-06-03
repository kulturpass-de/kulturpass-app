import { NavigationContainer } from '@react-navigation/native'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { GetFavoritesResponse } from '../../../services/api/types'
import { GetProfileResponseBody } from '../../../services/api/types/commerce/commerce-get-profile'
import { buildTestId } from '../../../services/test-id/test-id'
import { AppProviders, serverHandlersRequired, StoreProvider } from '../../../services/testing/test-utils'
import { ProductDetailFooter } from './product-detail-footer'

jest.useFakeTimers()

const renderComponent = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <StoreProvider withLoginSession>
        <NavigationContainer>{children}</NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}

describe('ProductDetailFooter', () => {
  const server = setupServer(
    ...serverHandlersRequired,
    http.get('*/cc/kulturapp/users/current', () =>
      HttpResponse.json(
        {
          identificationStatus: 'VERIFIED',
          balanceStatus: 'ENTITLED',
          balance: {
            grantedBalance: { value: 200, currencyIso: 'EUR' },
            reservedBalance: { value: 170, currencyIso: 'EUR' },
            availableBalance: { value: 30, currencyIso: 'EUR' },
          },
        } as GetProfileResponseBody,
        { status: 200 },
      ),
    ),
    http.get('*/cc/kulturapp/users/current/favourites', () =>
      HttpResponse.json(
        {
          favouritesItems: [],
        } as GetFavoritesResponse,
        { status: 200 },
      ),
    ),
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('Should render product detail footer with sufficient credit', async () => {
    const onReserve = jest.fn()

    renderComponent(
      <ProductDetailFooter
        fulfillmentOption="PICKUP_CODE"
        reservationSuspended={false}
        onReserve={onReserve}
        selectedOffer={{ code: 'test', price: { value: 22.99, currencyIso: 'EUR' } }}
      />,
    )

    expect(await screen.findByTestId(buildTestId('productDetail_footer_reserve_button'))).toBeOnTheScreen()
    expect(await screen.findByTestId(buildTestId('productDetail_footer_priceTitleAndPrice'))).toBeOnTheScreen()
    expect(await screen.findByTestId(buildTestId('productDetail_footer'))).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId(buildTestId('productDetail_footer_reserve_button')))
    expect(onReserve).toHaveBeenCalledTimes(1)
  })

  test('Should render product detail footer with non-sufficient credit', async () => {
    const onReserve = jest.fn()

    server.use(
      http.get('*/cc/kulturapp/users/current', () =>
        HttpResponse.json(
          {
            identificationStatus: 'VERIFIED',
            balanceStatus: 'ENTITLED',
            balance: {
              grantedBalance: { value: 200, currencyIso: 'EUR' },
              reservedBalance: { value: 190, currencyIso: 'EUR' },
              availableBalance: { value: 10, currencyIso: 'EUR' },
            },
          } as GetProfileResponseBody,
          { status: 200 },
        ),
      ),
    )

    renderComponent(
      <ProductDetailFooter
        fulfillmentOption="PICKUP_CODE"
        reservationSuspended={false}
        onReserve={onReserve}
        selectedOffer={{ code: 'test', price: { value: 22.99, currencyIso: 'EUR' } }}
      />,
    )
    expect(await screen.findByTestId(buildTestId('productDetail_footer'))).toBeOnTheScreen()
    expect(await screen.findByTestId(buildTestId('productDetail_footer_cannot_afford_text'))).toBeOnTheScreen()
    expect(screen.getByTestId(buildTestId('productDetail_footer_price'))).toBeOnTheScreen()

    expect(screen.queryByTestId(buildTestId('productDetail_footer_priceTitle'))).not.toBeOnTheScreen()
    expect(screen.queryByTestId(buildTestId('productDetail_footer_reserve_button'))).not.toBeOnTheScreen()
    expect(screen.queryByTestId(buildTestId('productDetail_footer_favorite_button'))).not.toBeOnTheScreen()
  })

  test('Should render product detail footer without a total price', async () => {
    const onReserve = jest.fn()

    server.use(
      http.get('*/cc/kulturapp/users/current', () => {
        return HttpResponse.json(
          {
            identificationStatus: 'VERIFIED',
            balanceStatus: 'ENTITLED',
            balance: {
              grantedBalance: { value: 200, currencyIso: 'EUR' },
              reservedBalance: { value: 200, currencyIso: 'EUR' },
              availableBalance: { value: 200, currencyIso: 'EUR' },
            },
          } as GetProfileResponseBody,
          { status: 200 },
        )
      }),
    )

    renderComponent(
      <ProductDetailFooter
        fulfillmentOption="PICKUP_CODE"
        reservationSuspended={false}
        onReserve={onReserve}
        // no offer = show no offer footer
        // selectedOffer={}
      />,
    )

    await act(() => {})

    expect(await screen.findByTestId(buildTestId('productDetail_footer_noOffer_badge'))).toBeOnTheScreen()
    expect(await screen.findByTestId(buildTestId('productDetail_footer_noOffer_text'))).toBeOnTheScreen()
    expect(await screen.findByTestId(buildTestId('productDetail_footer'))).toBeOnTheScreen()

    await waitFor(() =>
      expect(screen.queryAllByTestId(buildTestId('productDetail_footer_reserve_button')).length).toBe(0),
    )
  })

  test('Should render product detail without reservation button if reservationSuspended', async () => {
    const onReserve = jest.fn()

    renderComponent(
      <ProductDetailFooter
        fulfillmentOption="PICKUP_CODE"
        reservationSuspended={true}
        onReserve={onReserve}
        selectedOffer={{ code: 'test', price: { value: 22.99, currencyIso: 'EUR' } }}
      />,
    )

    expect(await screen.findByTestId(buildTestId('productDetail_footer_priceTitleAndPrice'))).toBeOnTheScreen()
    expect(await screen.findByTestId(buildTestId('productDetail_footer'))).toBeOnTheScreen()

    await waitFor(() =>
      expect(screen.queryAllByTestId(buildTestId('productDetail_footer_reserve_button')).length).toBe(0),
    )
  })
})
