import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { BudgetVoucherScreen } from './budget-voucher-screen'
import { BudgetVoucherSuccessScreen } from './budget-voucher-success-screen'

const componentMeta: ComponentMeta<typeof BudgetVoucherSuccessScreen> = {
  title: 'BudgetVoucherSuccessScreen',
  component: BudgetVoucherScreen,
  args: {
    onDone: () => {
      console.log('onDone')
    },
    price: {
      currencyIso: 'EUR',
      value: 80,
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof BudgetVoucherSuccessScreen> = args => <BudgetVoucherSuccessScreen {...args} />
