import { NavigationContainer } from '@react-navigation/native'
import { render, screen, within } from '@testing-library/react-native'
import { rest } from 'msw'
import { setupServer } from 'msw/lib/node'
import React from 'react'
import { Order } from '../../../services/api/types/commerce/api-types'
import { buildTestId, addTestIdModifier } from '../../../services/test-id/test-id'
import { AppProviders, StoreProvider } from '../../../services/testing/test-utils'
import { ReservationsListTabContent } from '../components/reservations-list-tab-content'

const renderScreen = (children: React.ReactNode) => {
  render(
    <AppProviders>
      <StoreProvider withLoginSession>
        <NavigationContainer>{children}</NavigationContainer>
      </StoreProvider>
    </AppProviders>,
  )
}
const componentTestID = buildTestId('reservations_test')

const renderReservationsList = (completedReservations: boolean) => {
  const onOrderPress = jest.fn()
  const setVisibleError = jest.fn()

  renderScreen(
    <ReservationsListTabContent
      onOrderPressed={onOrderPress}
      testID={componentTestID}
      i18nNoItemsTitleKey="reservations_list_noItems_title"
      i18nNoItemsContentKey="reservations_list_noPendingItems_content"
      completedReservations={completedReservations}
      setVisibleError={setVisibleError}
      i18nIllustrationAltKey="reservations_list_noPendingItems_image_alt"
      illustrationType="empty-state-reservations"
    />,
  )
}

const reservationsScreenTestId = addTestIdModifier(componentTestID, 'tab')

describe('ReservationsListTabContent', () => {
  const server = setupServer()

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test.skip('Should render order list', async () => {
    const orders: Order[] = [
      {
        status: 'CREATED',
        entries: [
          { shopName: 'Test', product: { name: 'Test' }, images: [], totalPrice: { value: 23, currencyIso: 'EUR' } },
        ],
      } as any,
    ]
    server.use(
      rest.get('http://localhost/cc/kulturapp/users/current/reservations', (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            orders: orders,
          }),
        )
      }),
    )

    renderReservationsList(false)
    expect(await screen.findByTestId(reservationsScreenTestId)).toBeOnTheScreen()
    const amountText = screen.getByTestId(buildTestId('reservations_listItem_price'))
    expect(amountText).toBeOnTheScreen()
    expect(within(amountText).getByText('23,00 €', { exact: false })).toBeOnTheScreen()
  })

  test('Should render empty list view', async () => {
    server.use(
      rest.get('http://localhost/cc/kulturapp/users/current/reservations', (_req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            orders: [],
          }),
        )
      }),
    )

    renderReservationsList(false)
    expect(await screen.findByTestId(reservationsScreenTestId)).toBeOnTheScreen()
    expect(await screen.findByTestId(addTestIdModifier(componentTestID, 'tab'))).toBeOnTheScreen()
  })
})
