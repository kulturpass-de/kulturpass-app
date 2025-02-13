import { screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { addTestIdModifier, buildTestId } from '../../../services/test-id/test-id'
import { renderScreen } from '../../../services/testing/test-utils'
import { MobilityOffersProductDetailScreen } from '../screens/mobility-offers-product-detail-screen'

export type MobilityOffersProductDetailScreenProps = {
  onClose: () => void
}

const onClose = jest.fn()

const voucherData = {
  code: 'flix-test-2025',
  template: 'flix',
  description: 'FlixTrain',
  claimStartDate: '2025-01-01T00:00:00+01:00',
  claimEndDate: '2026-01-01T00:00:00+01:00',
  accessEndDate: '2026-01-01T00:00:00+01:00',
  redemptionUrl: 'https://flix.com',
  validityInHours: 48,
  validityPeriodEnd: '2025-01-31',
  voucher: {
    code: 'MBF5678UZ9',
    validTo: '2026-01-15T00:00:00+01:00',
  },
}

const render = (props: MobilityOffersProductDetailScreenProps) => {
  return renderScreen(<MobilityOffersProductDetailScreen voucherData={voucherData} {...props} />)
}

describe('MobilityOffersProductDetailScreen', () => {
  const props = {
    onClose: onClose(),
  }

  test('Should render Mobility Offers Detail Screen', async () => {
    const screenTestId = buildTestId('mobility_offers_product_detail')
    render(props)
    await waitFor(() => expect(screen.getByTestId(addTestIdModifier(screenTestId, 'screen'))).toBeOnTheScreen())
  })
})
