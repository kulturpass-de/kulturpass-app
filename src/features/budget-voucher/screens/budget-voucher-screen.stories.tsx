import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { BudgetVoucherScreen } from './budget-voucher-screen'

const componentMeta: ComponentMeta<typeof BudgetVoucherScreen> = {
  title: 'BudgetVoucherScreen',
  component: BudgetVoucherScreen,
  args: {
    onClose: () => {
      console.log('onClose')
    },
    onNext: () => {
      console.log('onNext')
    },
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof BudgetVoucherScreen> = args => <BudgetVoucherScreen {...args} />

export const WithCodeExpiredError: ComponentStory<typeof BudgetVoucherScreen> = args => (
  <BudgetVoucherScreen
    {...args}
    error={{
      type: 'KpBudgetVoucherCodeExpiredError',
    }}
  />
)
