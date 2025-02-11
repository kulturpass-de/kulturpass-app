import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { MobilityOffersProduct } from '../screens/mobility-offers-product'

const componentMeta: ComponentMeta<typeof MobilityOffersProduct> = {
  title: 'Mobility Offers Product Screen',
  component: MobilityOffersProduct,
  args: {
    voucherData: {
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
    },
  },
}

export default componentMeta

export const Default: ComponentStory<typeof MobilityOffersProduct> = args => {
  return <MobilityOffersProduct {...args} />
}
