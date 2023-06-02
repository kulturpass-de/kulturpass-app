import { screen, within } from '@testing-library/react-native'
import React from 'react'
import { Order } from '../../../services/api/types/commerce/api-types'
import { buildTestId, addTestIdModifier } from '../../../services/test-id/test-id'
import { renderScreen } from '../../../services/testing/test-utils'
import { ReservationsListTabContent } from '../components/reservations-list-tab-content'

const componentTestID = buildTestId('reservations_test')

const renderReservationsList = (completedReservations: boolean, orderEntries: Order[]) => {
  const onOrderPress = jest.fn()
  const refetch = jest.fn()

  renderScreen(
    <ReservationsListTabContent
      isLoading={false}
      refetch={refetch}
      orderEntries={orderEntries}
      onOrderPressed={onOrderPress}
      testID={componentTestID}
      i18nNoItemsTitleKey="reservations_list_noItems_title"
      i18nNoItemsContentKey="reservations_list_noPendingItems_content"
      completedReservations={completedReservations}
      i18nIllustrationAltKey="reservations_list_noPendingItems_image_alt"
      illustrationType="empty-state-reservations"
    />,
  )
}

const reservationsScreenTestId = addTestIdModifier(componentTestID, 'tab')

describe('ReservationsListTabContent', () => {
  let orders: Order[] = [
    {
      status: 'CREATED',
      entries: [{ shopName: 'Test', product: { name: 'Test' }, images: [] }],
      total: { value: 23, currencyIso: 'EUR' },
    } as any,
  ]

  test('Should render order list', async () => {
    renderReservationsList(false, orders)
    expect(await screen.findByTestId(reservationsScreenTestId)).toBeOnTheScreen()
    const amountText = await screen.findByTestId(buildTestId('reservations_listItem_price'))
    expect(amountText).toBeOnTheScreen()
    expect(within(amountText).getByText('23,00 €', { exact: false })).toBeOnTheScreen()
  })

  test('Should render empty list view', async () => {
    renderReservationsList(false, [])
    expect(await screen.findByTestId(reservationsScreenTestId)).toBeOnTheScreen()
    expect(await screen.findByTestId(addTestIdModifier(componentTestID, 'tab'))).toBeOnTheScreen()
  })
})
