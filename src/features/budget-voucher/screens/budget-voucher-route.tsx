import React, { useCallback, useState } from 'react'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { HomeRouteName } from '../../../screens/home/home-route'
import { Price } from '../../../services/api/types/commerce/api-types'
import { modalCardStyle } from '../../../theme/utils'
import { BudgetVoucherScreen } from './budget-voucher-screen'
import { BudgetVoucherSuccessScreen } from './budget-voucher-success-screen'

export const BudgetVoucherRouteName = 'BudgetVoucher'

export type BudgetVoucherRouteParams = undefined

export type BudgetVoucherRouteStackParams = { BudgetVoucher: undefined }

const BudgetVoucherRoute: React.FC = () => {
  const tabNavigation = useTabsNavigation()

  const [price, setPrice] = useState<null | Price>(null)

  const onClose = useCallback(() => tabNavigation.goBack(), [tabNavigation])
  const onNext = useCallback(setPrice, [setPrice])
  const onDone = useCallback(() => tabNavigation.navigate(HomeRouteName), [tabNavigation])

  return price !== null ? (
    <BudgetVoucherSuccessScreen onDone={onDone} price={price} />
  ) : (
    <BudgetVoucherScreen onClose={onClose} onNext={onNext} />
  )
}

export const BudgetVoucherRouteConfig = createRouteConfig({
  name: BudgetVoucherRouteName,
  component: BudgetVoucherRoute,
  options: { cardStyle: modalCardStyle },
})
