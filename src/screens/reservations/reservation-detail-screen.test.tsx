import { screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { ProductDetail, ProductTypes } from '../../features/product-detail/types/product-detail'
import { Offer, Order } from '../../services/api/types/commerce/api-types'
import { buildTestId } from '../../services/test-id/test-id'
import { renderScreen } from '../../services/testing/test-utils'
import { ReservationDetailScreen } from './reservation-detail-screen'

export type ReservationDetailScreenProps = {
  productDetail: ProductDetail
  selectedOffer?: Offer
  order: Order
  onClose: () => void
  afterCancelReservationTriggered: () => void
  onPressReportButton: () => void
  completedReservation?: boolean
}

const onClose = jest.fn()
const afterCancelReservationTriggered = jest.fn()
const onPressReportButton = jest.fn()

const selectedOffer: Offer = {
  id: '555',
  shopName: 'Munich Seller Shop',
  shopDescription:
    'Some test shop.<br /><a href="mailto:mail@kulturpass.de" rel="nofollow noreferrer" target="_blank">mail@kulturpass.de</a><br /><a href="tel:05373920733" rel="nofollow noreferrer" target="_blank">05373920733</a>',
  description: 'description of the offer',
  priceAdditionalInfo: 'additional price info',
}

const productDetail: ProductDetail = {
  author: 'Author',
  categories: [],
  code: '555',
  name: 'Product name',
  description: 'Description',
  images: [],
  isbn: '',
  publisher: '',
  purchasable: true,
  url: '',
  productType: ProductTypes.Book,
  offers: [selectedOffer],
}

const order: Order = {
  code: 'TEST-555',
  cancellable: true,
  status: 'READY_FOR_PICKUP',
  entries: [
    {
      offerId: '555',
    },
  ],
}

const render = (props: ReservationDetailScreenProps) => {
  return renderScreen(<ReservationDetailScreen {...props} />)
}

describe('ReservationDetailScreen', () => {
  const props = {
    productDetail: productDetail,
    selectedOffer: {} as Offer,
    order: order,
    completedReservation: true,
    onClose: onClose(),
    afterCancelReservationTriggered: afterCancelReservationTriggered(),
    onPressReportButton: onPressReportButton(),
  }

  test('Should render Reservation Detail Screen', async () => {
    render(props)
    await waitFor(() => expect(screen.getByTestId(buildTestId('reservationDetail_screen'))).toBeOnTheScreen())
  })
})
