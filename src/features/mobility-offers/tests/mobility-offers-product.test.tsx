import { screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { addTestIdModifier, buildTestId } from '../../../services/test-id/test-id'
import { renderScreen } from '../../../services/testing/test-utils'
import { MobilityOffersProduct, MobilityOffersProductProps } from '../screens/mobility-offers-product'

const showVoucherAlert = jest.fn() //
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

const render = (props: MobilityOffersProductProps) => {
  return renderScreen(<MobilityOffersProduct {...props} />)
}

describe('MobilityOffersProductScreen', () => {
  const props = {
    onClose: onClose(),
    voucherData,
    isLoading: false,
    showVoucherAlert,
  }

  test('Should render Mobility Offers Product Screen', async () => {
    const screenTestId = buildTestId('mobility_offers_product')
    render(props)
    await waitFor(() => expect(screen.getByTestId(addTestIdModifier(screenTestId, 'screen'))).toBeOnTheScreen())
  })
})
